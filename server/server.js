// High-Performance WebSocket Relay Server for Cyber Clash (Online 1)
// Designed for instant 1-click deployment on Render.com or local Node.js
const http = require('http');
const { WebSocketServer, WebSocket } = require('ws');

const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const GAME_ROOT = path.resolve(__dirname, '..');

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.ogg': 'audio/ogg',
    '.ttf': 'font/ttf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

// HTTP server for static game files & health checks
const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const urlPath = req.url.split('?')[0];

    // Dedicated health check endpoint for Render
    if (urlPath === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'online',
            service: 'Cyber Clash WebSocket Relay + Web Host',
            activeRooms: rooms.size,
            uptime: Math.round(process.uptime()),
            timestamp: new Date().toISOString()
        }));
        return;
    }

    // Serve game files
    let relativeFile = urlPath === '/' ? '/index.html' : urlPath;
    const safeFilePath = path.normalize(path.join(GAME_ROOT, relativeFile));

    // Prevent directory traversal attacks
    if (!safeFilePath.startsWith(GAME_ROOT)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    fs.stat(safeFilePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(safeFilePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        const isCodeAsset = (ext === '.html' || ext === '.js' || ext === '.mjs' || ext === '.css' || ext === '.json');
        const cacheControl = isCodeAsset ? 'no-cache, no-store, must-revalidate, max-age=0' : 'public, max-age=86400';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stats.size,
            'Cache-Control': cacheControl,
            'Pragma': 'no-cache',
            'Expires': '0'
        });

        const stream = fs.createReadStream(safeFilePath);
        stream.pipe(res);
    });
});

// WebSocket Server attached to HTTP Server
const wss = new WebSocketServer({ server });

// Room storage: roomCode -> { host: WebSocket, client: WebSocket, createdAt: number, lastActive: number }
const rooms = new Map();

function safeSend(ws, payload) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        try {
            ws.send(typeof payload === 'string' ? payload : JSON.stringify(payload));
        } catch (err) {
            console.error('[Relay Send Error]', err.message);
        }
    }
}

wss.on('connection', (ws, req) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    ws.isAlive = true;
    ws.roomCode = null;
    ws.role = null;

    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.on('message', (message) => {
        let packet;
        try {
            packet = JSON.parse(message);
        } catch (e) {
            console.warn('[Invalid JSON packet]', message.toString());
            return;
        }

        const type = packet.type;

        switch (type) {
            case 'PING':
                safeSend(ws, { type: 'PONG', timestamp: Date.now() });
                break;

            case 'CREATE_ROOM': {
                const code = (packet.roomCode || '').toUpperCase().trim();
                if (!code) {
                    safeSend(ws, { type: 'ERROR', message: 'Invalid room code!' });
                    return;
                }

                // If room already exists with an active host, close it
                if (rooms.has(code)) {
                    const existing = rooms.get(code);
                    if (existing.host && existing.host !== ws) {
                        safeSend(existing.host, { type: 'ERROR', message: 'Room recreated from another device!' });
                    }
                }

                const mode = packet.mode || '1v1';
                const maxPlayers = mode === '2v2' ? 4 : 2;

                ws.roomCode = code;
                ws.role = 'HOST';
                ws.slotIndex = 0;
                rooms.set(code, {
                    host: ws,
                    client: null,
                    members: [ws],
                    mode: mode,
                    maxPlayers: maxPlayers,
                    createdAt: Date.now(),
                    lastActive: Date.now()
                });

                console.log(`[Room Created] ${code} (Mode: ${mode}) by ${clientIp}`);
                safeSend(ws, { type: 'ROOM_CREATED', roomCode: code, slotIndex: 0, mode: mode });
                break;
            }

            case 'JOIN_ROOM': {
                const code = (packet.roomCode || '').toUpperCase().trim();
                if (!code || !rooms.has(code)) {
                    safeSend(ws, { type: 'ERROR', message: `Room [${code}] does not exist or has expired!` });
                    return;
                }

                const room = rooms.get(code);
                const currentCount = (room.members && room.members.length) || (room.client ? 2 : 1);
                const maxLimit = room.maxPlayers || 2;

                if (currentCount >= maxLimit) {
                    safeSend(ws, { type: 'ERROR', message: `Room [${code}] is full (${maxLimit} players max)!` });
                    return;
                }

                if (!room.members) {
                    room.members = [room.host];
                }

                const slotIndex = room.members.length;
                ws.roomCode = code;
                ws.role = 'CLIENT';
                ws.slotIndex = slotIndex;
                room.members.push(ws);
                if (slotIndex === 1) {
                    room.client = ws;
                }
                room.lastActive = Date.now();

                console.log(`[Player Joined] ${code} Slot: ${slotIndex} Client: ${clientIp}`);

                // Notify client they successfully joined
                safeSend(ws, { type: 'ROOM_JOINED', roomCode: code, role: 'CLIENT', slotIndex: slotIndex, mode: room.mode });

                // Notify host that player has connected (for 1v1 compat)
                if (room.host && room.host.readyState === WebSocket.OPEN) {
                    safeSend(room.host, { type: 'OPPONENT_JOINED', role: 'HOST', roomCode: code, slotIndex: slotIndex });
                }

                // Broadcast room members update
                const membersPayload = {
                    type: 'ROOM_MEMBERS_UPDATE',
                    playerCount: room.members.length,
                    maxPlayers: room.maxPlayers,
                    mode: room.mode,
                    slots: room.members.map((m, idx) => ({ slotIndex: idx, role: m.role }))
                };
                for (const m of room.members) {
                    if (m && m.readyState === WebSocket.OPEN) {
                        safeSend(m, membersPayload);
                    }
                }
                break;
            }

            case 'RELAY': {
                // High-speed forwarding of game payload to other players in room
                const code = ws.roomCode;
                if (!code || !rooms.has(code)) return;

                const room = rooms.get(code);
                room.lastActive = Date.now();

                const senderSlot = ws.slotIndex !== undefined ? ws.slotIndex : (ws.role === 'HOST' ? 0 : 1);
                if (room.members && room.members.length > 0) {
                    for (const target of room.members) {
                        if (target !== ws && target.readyState === WebSocket.OPEN) {
                            safeSend(target, { type: 'RELAY', data: packet.data, senderSlot: senderSlot });
                        }
                    }
                } else {
                    const target = (ws.role === 'HOST') ? room.client : room.host;
                    if (target && target.readyState === WebSocket.OPEN) {
                        safeSend(target, { type: 'RELAY', data: packet.data, senderSlot: senderSlot });
                    }
                }
                break;
            }

            case 'LEAVE_ROOM': {
                cleanupClient(ws);
                break;
            }

            default:
                break;
        }
    });

    ws.on('close', () => {
        cleanupClient(ws);
    });

    ws.on('error', (err) => {
        console.error('[WebSocket Error]', err.message);
        cleanupClient(ws);
    });
});

function cleanupClient(ws) {
    const code = ws.roomCode;
    if (!code || !rooms.has(code)) return;

    const room = rooms.get(code);

    if (ws.role === 'HOST') {
        // Host left -> inform all clients and destroy room
        if (room.members) {
            for (const m of room.members) {
                if (m !== ws && m.readyState === WebSocket.OPEN) {
                    safeSend(m, { type: 'OPPONENT_LEFT', message: 'Host has left the room!' });
                }
            }
        } else if (room.client && room.client.readyState === WebSocket.OPEN) {
            safeSend(room.client, { type: 'OPPONENT_LEFT', message: 'Host has left the room!' });
        }
        rooms.delete(code);
        console.log(`[Room Closed] Host left room ${code}`);
    } else if (ws.role === 'CLIENT') {
        // Client left -> inform host and remove from room members
        if (room.members) {
            const idx = room.members.indexOf(ws);
            if (idx !== -1) {
                room.members.splice(idx, 1);
            }
            if (room.client === ws) {
                room.client = null;
            }
            const membersPayload = {
                type: 'ROOM_MEMBERS_UPDATE',
                playerCount: room.members.length,
                maxPlayers: room.maxPlayers,
                mode: room.mode,
                slots: room.members.map((m, i) => ({ slotIndex: i, role: m.role }))
            };
            for (const m of room.members) {
                if (m && m.readyState === WebSocket.OPEN) {
                    safeSend(m, { type: 'OPPONENT_LEFT', message: 'A player has left the room!' });
                    safeSend(m, membersPayload);
                }
            }
        } else {
            if (room.host && room.host.readyState === WebSocket.OPEN) {
                safeSend(room.host, { type: 'OPPONENT_LEFT', message: 'Opponent has disconnected!' });
            }
            room.client = null;
        }
        console.log(`[Client Disconnected] Room ${code} player left`);
    }

    ws.roomCode = null;
    ws.role = null;
}

// Keep-alive heartbeat interval (every 25 seconds) to prevent Render.com idle sleep
const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (!ws.isAlive) {
            ws.terminate();
            return;
        }
        ws.isAlive = false;
        ws.ping();
    });

    // Cleanup stale rooms inactive for > 30 minutes
    const now = Date.now();
    for (const [code, room] of rooms.entries()) {
        if (now - room.lastActive > 30 * 60 * 1000) {
            console.log(`[Garbage Collection] Deleted inactive room ${code}`);
            if (room.host) room.host.terminate();
            if (room.client) room.client.terminate();
            rooms.delete(code);
        }
    }
}, 25000);

wss.on('close', () => {
    clearInterval(heartbeatInterval);
});

server.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 Cyber Clash WebSocket Relay Server Running`);
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌐 Health URL: http://localhost:${PORT}/health`);
    console.log(`===============================================`);
});
