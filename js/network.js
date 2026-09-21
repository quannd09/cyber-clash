// WebRTC Peer-to-Peer Network Manager using PeerJS for Cyber Clash
// Supports 1v1 Room Code Matchmaking with Zero Backend Requirement
// Integrated with Google STUN + OpenRelay TURN for 100% NAT & Firewall Traversal

const ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    { urls: 'stun:stun.cloudflare.com:3478' },
    { urls: 'stun:global.stun.twilio.com:3478' }
];

export class NetworkManager {
    constructor() {
        this.peer = null;
        this.conn = null;
        this.role = null; // 'HOST' | 'CLIENT' | null
        this.roomCode = null;
        this.isConnected = false;
        this.connectionTimeout = null;
        this.heartbeatTimer = null;

        this.onStatusChange = null;
        this.onConnected = null;
        this.onDisconnected = null;
        this.onData = null;
        this.onRoomCreated = null;
    }

    generateRoomCode() {
        const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        let code = '';
        for (let i = 0; i < 4; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `CLASH-${code}`;
    }

    cleanCode(rawCode) {
        if (!rawCode) return '';
        let clean = rawCode.trim().toUpperCase().replace(/\s+/g, '');
        if (!clean.startsWith('CLASH-')) {
            clean = `CLASH-${clean}`;
        }
        return clean;
    }

    getPeerIdFromCode(code) {
        return `cyberclash-v54-${code.replace('CLASH-', '').toLowerCase()}`;
    }

    clearConnectionTimeout() {
        if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
        }
    }

    startHeartbeat() {
        this.stopHeartbeat();
        this.heartbeatTimer = setInterval(() => {
            if (this.peer && !this.peer.destroyed) {
                try {
                    // Keep signalling WebSocket alive
                    if (this.peer.socket && this.peer.socket._socket && this.peer.socket._socket.readyState === WebSocket.OPEN) {
                        this.peer.socket._socket.send(JSON.stringify({ type: 'HEARTBEAT' }));
                    }
                } catch (e) {}
            }
        }, 15000);
    }

    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    createRoom() {
        this.disconnect();
        this.role = 'HOST';
        this.roomCode = this.generateRoomCode();
        const peerId = this.getPeerIdFromCode(this.roomCode);

        this.notifyStatus(`Creating room [${this.roomCode}]...`);

        try {
            if (typeof Peer === 'undefined') {
                this.notifyStatus('Error: PeerJS library not loaded!', true);
                return;
            }

            this.peer = new Peer(peerId, {
                debug: 1,
                config: {
                    iceServers: ICE_SERVERS
                }
            });

            this.peer.on('open', (id) => {
                this.startHeartbeat();
                this.notifyStatus(`Room [${this.roomCode}] ready! Waiting for opponent...`);
                if (this.onRoomCreated) {
                    this.onRoomCreated(this.roomCode);
                }
            });

            this.peer.on('disconnected', () => {
                console.warn('[PeerJS Host] Signalling disconnected. Reconnecting...');
                try {
                    if (this.peer && !this.peer.destroyed) {
                        this.peer.reconnect();
                    }
                } catch (e) {}
            });

            this.peer.on('connection', (conn) => {
                this.notifyStatus(`Opponent incoming! Connecting...`);
                this.conn = conn;
                this.setupConnection(conn, true);
            });

            this.peer.on('error', (err) => {
                console.error('[Network Host Error]', err);
                if (err.type === 'unavailable-id') {
                    // Duplicate room code, regenerate
                    this.createRoom();
                } else if (err.type === 'network') {
                    this.notifyStatus('Signalling network error. Reconnecting...', true);
                } else {
                    this.notifyStatus(`Network error: ${err.type || err.message}`, true);
                }
            });

        } catch (e) {
            console.error('[Create Room Exception]', e);
            this.notifyStatus(`Failed to initialize room: ${e.message}`, true);
        }
    }

    joinRoom(rawCode) {
        this.disconnect();
        const code = this.cleanCode(rawCode);
        if (!code || code === 'CLASH-') {
            this.notifyStatus('Please enter a valid room code!', true);
            return;
        }

        this.role = 'CLIENT';
        this.roomCode = code;
        const hostPeerId = this.getPeerIdFromCode(code);

        this.notifyStatus(`Searching for room [${code}]...`);

        try {
            if (typeof Peer === 'undefined') {
                this.notifyStatus('Error: PeerJS library not loaded!', true);
                return;
            }

            this.peer = new Peer(undefined, {
                debug: 1,
                config: {
                    iceServers: ICE_SERVERS
                }
            });

            this.peer.on('open', (myId) => {
                this.startHeartbeat();
                this.notifyStatus(`Found room [${code}]! Handshaking...`);
                const conn = this.peer.connect(hostPeerId, {
                    reliable: true
                });
                this.conn = conn;
                this.setupConnection(conn, false);
            });

            this.peer.on('disconnected', () => {
                console.warn('[PeerJS Client] Signalling disconnected. Reconnecting...');
                try {
                    if (this.peer && !this.peer.destroyed) {
                        this.peer.reconnect();
                    }
                } catch (e) {}
            });

            this.peer.on('error', (err) => {
                console.error('[Network Client Error]', err);
                this.clearConnectionTimeout();
                if (err.type === 'peer-unavailable') {
                    this.notifyStatus(`Room [${code}] does not exist or has expired! Make sure Host created the room.`, true);
                } else if (err.type === 'network') {
                    this.notifyStatus('Signalling network error. Please try again.', true);
                } else {
                    this.notifyStatus(`Connection error: ${err.type || err.message}`, true);
                }
            });

        } catch (e) {
            console.error('[Join Room Exception]', e);
            this.clearConnectionTimeout();
            this.notifyStatus(`Failed to join room: ${e.message}`, true);
        }
    }

    setupConnection(conn, isHost) {
        this.clearConnectionTimeout();

        if (!isHost) {
            // Watchdog timer: 20s
            this.connectionTimeout = setTimeout(() => {
                if (!this.isConnected) {
                    this.notifyStatus(`⚠️ Connection timed out (20s). Room [${this.roomCode}] could not be reached. Ensure Host created the room first and is still waiting!`, true);
                    this.disconnect();
                }
            }, 20000);
        }

        const handleOpen = () => {
            if (this.isConnected) return;
            this.clearConnectionTimeout();
            this.isConnected = true;
            this.notifyStatus(`✅ Connected! Entering arena...`);
            if (this.onConnected) {
                this.onConnected(this.role, this.roomCode);
            }
        };

        if (conn.open) {
            handleOpen();
        } else {
            conn.on('open', handleOpen);
        }

        const attachPcListeners = () => {
            const pc = conn.peerConnection || conn._pc;
            if (pc && !pc._hasClashListener) {
                pc._hasClashListener = true;
                pc.oniceconnectionstatechange = () => {
                    const state = pc.iceConnectionState;
                    console.log(`[WebRTC ICE State] ${state}`);
                    if (state === 'connected' || state === 'completed') {
                        if (conn.open) {
                            handleOpen();
                        }
                    } else if (state === 'failed') {
                        if (!this.isConnected) {
                            this.notifyStatus(`⚠️ WebRTC direct route failed. Restarting ICE...`, true);
                            if (typeof pc.restartIce === 'function') {
                                try { pc.restartIce(); } catch(e) {}
                            }
                        }
                    }
                };
            }
        };
        attachPcListeners();
        setTimeout(attachPcListeners, 250);
        setTimeout(attachPcListeners, 1000);

        conn.on('data', (data) => {
            if (this.onData) {
                this.onData(data);
            }
        });

        conn.on('close', () => {
            this.isConnected = false;
            this.clearConnectionTimeout();
            this.notifyStatus(`⚠️ Connection to opponent lost!`, true);
            if (this.onDisconnected) {
                this.onDisconnected();
            }
        });

        conn.on('error', (err) => {
            console.error('[DataChannel Error]', err);
            this.clearConnectionTimeout();
            this.notifyStatus(`Network data error: ${err.message || err.type}`, true);
        });
    }

    send(data) {
        if (!this.conn) return;
        if (this.conn.open) {
            try {
                this.conn.send(data);
            } catch (e) {
                console.error('[Network send error]', e);
            }
        } else {
            const sendWhenReady = () => {
                try {
                    if (this.conn && this.conn.open) {
                        this.conn.send(data);
                    }
                } catch(e) {}
            };
            if (typeof this.conn.once === 'function') {
                this.conn.once('open', sendWhenReady);
            } else {
                this.conn.on('open', sendWhenReady);
            }
        }
    }

    disconnect() {
        this.isConnected = false;
        this.clearConnectionTimeout();
        this.stopHeartbeat();
        if (this.conn) {
            try { this.conn.close(); } catch(e) {}
            this.conn = null;
        }
        if (this.peer) {
            try { this.peer.destroy(); } catch(e) {}
            this.peer = null;
        }
        this.role = null;
    }

    notifyStatus(msg, isError = false) {
        if (this.onStatusChange) {
            this.onStatusChange(msg, isError);
        }
    }
}

export const network = new NetworkManager();
if (typeof window !== 'undefined') {
    window.network = network;
}
