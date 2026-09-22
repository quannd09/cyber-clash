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

        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stats.size,
            'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
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
                    safeSend(ws, { type: 'ERROR', message: 'Mã phòng không hợp lệ!' });
                    return;
                }

                // If room already exists with an active host, close it
                if (rooms.has(code)) {
                    const existing = rooms.get(code);
                    if (existing.host && existing.host !== ws) {
                        safeSend(existing.host, { type: 'ERROR', message: 'Phòng đã được tạo lại từ thiết bị khác!' });
                    }
                }

                ws.roomCode = code;
                ws.role = 'HOST';
                rooms.set(code, {
                    host: ws,
                    client: null,
                    createdAt: Date.now(),
                    lastActive: Date.now()
                });

                console.log(`[Room Created] ${code} by ${clientIp}`);
                safeSend(ws, { type: 'ROOM_CREATED', roomCode: code });
                break;
            }

            case 'JOIN_ROOM': {
                const code = (packet.roomCode || '').toUpperCase().trim();
                if (!code || !rooms.has(code)) {
                    safeSend(ws, { type: 'ERROR', message: `Phòng [${code}] không tồn tại hoặc đã hết hạn!` });
                    return;
                }

                const room = rooms.get(code);
                if (room.client && room.client !== ws && room.client.readyState === WebSocket.OPEN) {
                    safeSend(ws, { type: 'ERROR', message: `Phòng [${code}] đã đủ 2 người chơi!` });
                    return;
                }

                ws.roomCode = code;
                ws.role = 'CLIENT';
                room.client = ws;
                room.lastActive = Date.now();

                console.log(`[Player Joined] ${code} Client: ${clientIp}`);

                // Notify client they successfully joined
                safeSend(ws, { type: 'ROOM_JOINED', roomCode: code, role: 'CLIENT' });

                // Notify host that opponent has connected
                if (room.host && room.host.readyState === WebSocket.OPEN) {
                    safeSend(room.host, { type: 'OPPONENT_JOINED', role: 'HOST', roomCode: code });
                }
                break;
            }

            case 'RELAY': {
                // High-speed forwarding of game payload to opponent
                const code = ws.roomCode;
                if (!code || !rooms.has(code)) return;

                const room = rooms.get(code);
                room.lastActive = Date.now();

                const target = (ws.role === 'HOST') ? room.client : room.host;
                if (target && target.readyState === WebSocket.OPEN) {
                    safeSend(target, { type: 'RELAY', data: packet.data });
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
        // Host left -> inform client and destroy room
        if (room.client && room.client.readyState === WebSocket.OPEN) {
            safeSend(room.client, { type: 'OPPONENT_LEFT', message: 'Chủ phòng (Host) đã thoát!' });
        }
        rooms.delete(code);
        console.log(`[Room Closed] Host left room ${code}`);
    } else if (ws.role === 'CLIENT') {
        // Client left -> inform host and reset client slot
        if (room.host && room.host.readyState === WebSocket.OPEN) {
            safeSend(room.host, { type: 'OPPONENT_LEFT', message: 'Đối thủ đã ngắt kết nối!' });
        }
        room.client = null;
        console.log(`[Client Disconnected] Room ${code} waiting for new player`);
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
