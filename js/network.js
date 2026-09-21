// WebRTC Peer-to-Peer Network Manager using PeerJS for Cyber Clash
// Supports 1v1 Room Code Matchmaking with Zero Backend Requirement

export class NetworkManager {
    constructor() {
        this.peer = null;
        this.conn = null;
        this.role = null; // 'HOST' | 'CLIENT' | null
        this.roomCode = null;
        this.isConnected = false;

        this.onStatusChange = null;
        this.onConnected = null;
        this.onDisconnected = null;
        this.onData = null;
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
        return `cyberclash-v47-${code.replace('CLASH-', '').toLowerCase()}`;
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
                debug: 1
            });

            this.peer.on('open', (id) => {
                this.notifyStatus(`Room ready! Waiting for opponent...`);
                if (this.onRoomCreated) {
                    this.onRoomCreated(this.roomCode);
                }
            });

            this.peer.on('connection', (conn) => {
                this.conn = conn;
                this.setupConnection(conn, true);
            });

            this.peer.on('error', (err) => {
                console.error('[Network Host Error]', err);
                if (err.type === 'unavailable-id') {
                    // Duplicate room code, regenerate
                    this.createRoom();
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
                debug: 1
            });

            this.peer.on('open', (myId) => {
                this.notifyStatus(`Connecting to room [${code}]...`);
                const conn = this.peer.connect(hostPeerId, {
                    reliable: true
                });
                this.conn = conn;
                this.setupConnection(conn, false);
            });

            this.peer.on('error', (err) => {
                console.error('[Network Client Error]', err);
                if (err.type === 'peer-unavailable') {
                    this.notifyStatus(`Room [${code}] does not exist or has expired!`, true);
                } else {
                    this.notifyStatus(`Connection error: ${err.type || err.message}`, true);
                }
            });

        } catch (e) {
            console.error('[Join Room Exception]', e);
            this.notifyStatus(`Failed to join room: ${e.message}`, true);
        }
    }

    setupConnection(conn, isHost) {
        const handleOpen = () => {
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

        conn.on('data', (data) => {
            if (this.onData) {
                this.onData(data);
            }
        });

        conn.on('close', () => {
            this.isConnected = false;
            this.notifyStatus(`⚠️ Connection to opponent lost!`, true);
            if (this.onDisconnected) {
                this.onDisconnected();
            }
        });

        conn.on('error', (err) => {
            console.error('[DataChannel Error]', err);
            this.notifyStatus(`Network data error: ${err.message}`, true);
        });
    }

    send(data) {
        if (this.conn && this.conn.open) {
            try {
                this.conn.send(data);
            } catch (e) {
                console.error('[Network send error]', e);
            }
        }
    }

    disconnect() {
        this.isConnected = false;
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
