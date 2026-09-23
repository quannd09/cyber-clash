// Dual-Engine Network Manager for Cyber Clash
// Supports:
// - ONLINE 1: High-Speed Persistent WebSockets via Server Relay (Render.com / Localhost)
// - ONLINE 2: Peer-to-Peer WebRTC via PeerJS + Google STUN & OpenRelay TURN

const ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    { urls: 'stun:stun.cloudflare.com:3478' },
    { urls: 'stun:global.stun.twilio.com:3478' },
    {
        urls: [
            'turn:openrelay.metered.ca:80',
            'turn:openrelay.metered.ca:443',
            'turn:openrelay.metered.ca:443?transport=tcp'
        ],
        username: 'openrelayproject',
        credential: 'openrelayproject'
    }
];

function generateRoomCode() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `CLASH-${code}`;
}

function cleanRoomCode(rawCode) {
    if (!rawCode) return '';
    let clean = rawCode.trim().toUpperCase().replace(/\s+/g, '');
    if (!clean.startsWith('CLASH-')) {
        clean = `CLASH-${clean}`;
    }
    return clean;
}

// ---------------------------------------------------------------------
// PROVIDER 1: WEBSOCKET RELAY SERVER (ONLINE 1 - RENDER / LOCALHOST)
// ---------------------------------------------------------------------
export class WebSocketNetworkProvider {
    constructor(manager) {
        this.manager = manager;
        this.ws = null;
        this.role = null; // 'HOST' | 'CLIENT' | null
        this.slotIndex = 0;
        this.roomMode = '1v1';
        this.roomCode = null;
        this.isConnected = false;
        this.heartbeatTimer = null;
        this.connectionTimeout = null;
        this.pendingAction = null; // 'CREATE' | 'JOIN'
    }

    getServerUrl() {
        const custom = localStorage.getItem('cyberclash_ws_url');
        if (custom && custom.trim()) return custom.trim();

        if (typeof window !== 'undefined') {
            const host = window.location.hostname;
            if (host === 'localhost' || host === '127.0.0.1') {
                return 'ws://localhost:3000';
            }
            // Auto-detect when hosted on web platforms like Render
            if (window.location.protocol === 'https:' || window.location.protocol === 'http:') {
                return window.location.origin.replace(/^http/, 'ws');
            }
        }
        // Default Render cloud server
        return 'wss://cyber-clash-itv1.onrender.com';
    }

    setServerUrl(url) {
        if (url) {
            localStorage.setItem('cyberclash_ws_url', url.trim());
        } else {
            localStorage.removeItem('cyberclash_ws_url');
        }
    }

    connectSocket(onReady) {
        const url = this.getServerUrl();

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            if (onReady) onReady();
            return;
        }

        if (this.ws) {
            try { this.ws.close(); } catch(e) {}
            this.ws = null;
        }

        this.manager.notifyStatus(`[Online 1] Đang kết nối tới WebSocket Server (${url})...`);

        try {
            this.ws = new WebSocket(url);
        } catch (err) {
            this.manager.notifyStatus(`[Online 1] Lỗi URL WebSocket: ${err.message}`, true);
            return;
        }

        this.connectionTimeout = setTimeout(() => {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                this.manager.notifyStatus(`[Online 1] Không thể kết nối tới Server (${url}). Vui lòng đảm bảo server đang chạy!`, true);
                this.disconnect();
            }
        }, 10000);

        this.ws.onopen = () => {
            if (this.connectionTimeout) {
                clearTimeout(this.connectionTimeout);
                this.connectionTimeout = null;
            }
            this.startHeartbeat();
            if (onReady) onReady();
        };

        this.ws.onmessage = (event) => {
            let packet;
            try {
                packet = JSON.parse(event.data);
            } catch (e) {
                return;
            }

            const type = packet.type;

            if (type === 'ROOM_CREATED') {
                this.role = 'HOST';
                this.slotIndex = packet.slotIndex || 0;
                this.roomMode = packet.mode || '1v1';
                this.roomCode = packet.roomCode;
                this.manager.notifyRoomCreated(this.roomCode, this.slotIndex, this.roomMode);
                this.manager.notifyStatus(`[Online 1] Phòng [${this.roomCode}] đã sẵn sàng! Đang chờ đối thủ...`);
            } else if (type === 'ROOM_JOINED') {
                this.role = 'CLIENT';
                this.slotIndex = packet.slotIndex !== undefined ? packet.slotIndex : 1;
                this.roomMode = packet.mode || '1v1';
                this.roomCode = packet.roomCode;
                this.isConnected = true;
                this.manager.notifyStatus(`[Online 1] ✅ Đã kết nối vào phòng [${this.roomCode}]! (Slot ${this.slotIndex + 1})`);
                this.manager.notifyConnected(this.role, this.roomCode, this.slotIndex, this.roomMode);
            } else if (type === 'OPPONENT_JOINED') {
                // Host receives this when a client joins
                this.isConnected = true;
                this.manager.notifyStatus(`[Online 1] ✅ Người chơi mới đã vào phòng!`);
                this.manager.notifyConnected(this.role, this.roomCode, this.slotIndex, this.roomMode);
            } else if (type === 'ROOM_MEMBERS_UPDATE') {
                this.manager.notifyMembersUpdate(packet);
            } else if (type === 'RELAY') {
                this.manager.notifyData(packet.data, packet.senderSlot);
            } else if (type === 'OPPONENT_LEFT') {
                this.manager.notifyStatus(`[Online 1] ⚠️ ${packet.message || 'Người chơi đã thoát phòng!'}`, true);
                this.manager.notifyDisconnected();
            } else if (type === 'ERROR') {
                this.manager.notifyStatus(`[Online 1] ❌ ${packet.message}`, true);
            }
        };

        this.ws.onclose = () => {
            this.stopHeartbeat();
            if (this.isConnected) {
                this.isConnected = false;
                this.manager.notifyStatus(`[Online 1] Mất kết nối tới WebSocket Server!`, true);
                this.manager.notifyDisconnected();
            }
        };

        this.ws.onerror = (err) => {
            console.warn('[Online 1 WS Error]', err);
        };
    }

    startHeartbeat() {
        this.stopHeartbeat();
        this.heartbeatTimer = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({ type: 'PING' }));
            }
        }, 15000);
    }

    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    createRoom(mode = '1v1') {
        this.disconnect();
        this.roomCode = generateRoomCode();
        this.roomMode = mode;
        this.pendingAction = 'CREATE';

        this.connectSocket(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({
                    type: 'CREATE_ROOM',
                    roomCode: this.roomCode,
                    mode: mode
                }));
            }
        });
    }

    joinRoom(rawCode) {
        this.disconnect();
        const code = cleanRoomCode(rawCode);
        if (!code || code === 'CLASH-') {
            this.manager.notifyStatus('[Online 1] Vui lòng nhập mã phòng hợp lệ!', true);
            return;
        }

        this.roomCode = code;
        this.pendingAction = 'JOIN';

        this.connectSocket(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.manager.notifyStatus(`[Online 1] Đang tìm và vào phòng [${this.roomCode}]...`);
                this.ws.send(JSON.stringify({
                    type: 'JOIN_ROOM',
                    roomCode: this.roomCode
                }));
            }
        });
    }

    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            try {
                this.ws.send(JSON.stringify({
                    type: 'RELAY',
                    data: data
                }));
            } catch (err) {
                console.error('[Online 1 Send Error]', err);
            }
        }
    }

    disconnect() {
        if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
        }
        this.stopHeartbeat();
        this.isConnected = false;

        if (this.ws) {
            if (this.ws.readyState === WebSocket.OPEN) {
                try {
                    this.ws.send(JSON.stringify({ type: 'LEAVE_ROOM' }));
                } catch(e) {}
            }
            try { this.ws.close(); } catch(e) {}
            this.ws = null;
        }
        this.role = null;
        this.pendingAction = null;
    }
}

// ---------------------------------------------------------------------
// PROVIDER 2: WEBRTC P2P VIA PEERJS (ONLINE 2 - ZERO BACKEND)
// ---------------------------------------------------------------------
export class WebRTCNetworkProvider {
    constructor(manager) {
        this.manager = manager;
        this.peer = null;
        this.conn = null;
        this.role = null; // 'HOST' | 'CLIENT' | null
        this.roomCode = null;
        this.isConnected = false;
        this.connectionTimeout = null;
        this.heartbeatTimer = null;
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
        this.roomCode = generateRoomCode();
        const peerId = this.getPeerIdFromCode(this.roomCode);

        this.manager.notifyStatus(`[Online 2] Khởi tạo phòng P2P [${this.roomCode}]...`);

        try {
            if (typeof Peer === 'undefined') {
                this.manager.notifyStatus('[Online 2] Lỗi: Thư viện PeerJS chưa được tải!', true);
                return;
            }

            this.peer = new Peer(peerId, {
                debug: 1,
                config: {
                    iceServers: ICE_SERVERS
                }
            });

            this.peer.on('open', () => {
                this.startHeartbeat();
                this.manager.notifyStatus(`[Online 2] Phòng [${this.roomCode}] sẵn sàng! Đang chờ đối thủ...`);
                this.manager.notifyRoomCreated(this.roomCode);
            });

            this.peer.on('disconnected', () => {
                try {
                    if (this.peer && !this.peer.destroyed) {
                        this.peer.reconnect();
                    }
                } catch (e) {}
            });

            this.peer.on('connection', (conn) => {
                this.manager.notifyStatus(`[Online 2] Đối thủ đang bắt tay P2P...`);
                this.conn = conn;
                this.setupConnection(conn, true);
            });

            this.peer.on('error', (err) => {
                console.error('[WebRTC Host Error]', err);
                if (err.type === 'unavailable-id') {
                    this.createRoom();
                } else if (err.type === 'network') {
                    this.manager.notifyStatus('[Online 2] Lỗi mạng báo hiệu. Đang thử lại...', true);
                } else {
                    this.manager.notifyStatus(`[Online 2] Lỗi kết nối: ${err.type || err.message}`, true);
                }
            });

        } catch (e) {
            console.error('[Create Room Exception]', e);
            this.manager.notifyStatus(`[Online 2] Không thể khởi tạo phòng: ${e.message}`, true);
        }
    }

    joinRoom(rawCode) {
        this.disconnect();
        const code = cleanRoomCode(rawCode);
        if (!code || code === 'CLASH-') {
            this.manager.notifyStatus('[Online 2] Vui lòng nhập mã phòng hợp lệ!', true);
            return;
        }

        this.role = 'CLIENT';
        this.roomCode = code;
        const hostPeerId = this.getPeerIdFromCode(code);

        this.manager.notifyStatus(`[Online 2] Đang tìm phòng [${code}] qua WebRTC...`);

        try {
            if (typeof Peer === 'undefined') {
                this.manager.notifyStatus('[Online 2] Lỗi: Thư viện PeerJS chưa được tải!', true);
                return;
            }

            this.peer = new Peer(undefined, {
                debug: 1,
                config: {
                    iceServers: ICE_SERVERS
                }
            });

            this.peer.on('open', () => {
                this.startHeartbeat();
                this.manager.notifyStatus(`[Online 2] Tìm thấy phòng [${code}]! Đang bắt tay STUN/TURN...`);
                const conn = this.peer.connect(hostPeerId, {
                    reliable: true
                });
                this.conn = conn;
                this.setupConnection(conn, false);
            });

            this.peer.on('disconnected', () => {
                try {
                    if (this.peer && !this.peer.destroyed) {
                        this.peer.reconnect();
                    }
                } catch (e) {}
            });

            this.peer.on('error', (err) => {
                console.error('[WebRTC Client Error]', err);
                this.clearConnectionTimeout();
                if (err.type === 'peer-unavailable') {
                    this.manager.notifyStatus(`[Online 2] Phòng [${code}] không tồn tại hoặc đã đóng!`, true);
                } else {
                    this.manager.notifyStatus(`[Online 2] Lỗi kết nối: ${err.type || err.message}`, true);
                }
            });

        } catch (e) {
            console.error('[Join Room Exception]', e);
            this.clearConnectionTimeout();
            this.manager.notifyStatus(`[Online 2] Không thể tham gia phòng: ${e.message}`, true);
        }
    }

    setupConnection(conn, isHost) {
        this.clearConnectionTimeout();

        if (!isHost) {
            this.connectionTimeout = setTimeout(() => {
                if (!this.isConnected) {
                    this.manager.notifyStatus(`[Online 2] ⚠️ Quá thời gian chờ (20s). Bạn có thể thử chuyển sang chế độ ONLINE 1 (WebSocket)!`, true);
                    this.disconnect();
                }
            }, 20000);
        }

        const handleOpen = () => {
            if (this.isConnected) return;
            this.clearConnectionTimeout();
            this.isConnected = true;
            this.manager.notifyStatus(`[Online 2] ✅ Kết nối P2P thành công! Đang vào sàn đấu...`);
            this.manager.notifyConnected(this.role, this.roomCode);
        };

        if (conn.open) {
            handleOpen();
        } else {
            conn.on('open', handleOpen);
        }

        conn.on('data', (data) => {
            this.manager.notifyData(data);
        });

        conn.on('close', () => {
            this.isConnected = false;
            this.clearConnectionTimeout();
            this.manager.notifyStatus(`[Online 2] ⚠️ Mất kết nối P2P với đối thủ!`, true);
            this.manager.notifyDisconnected();
        });

        conn.on('error', (err) => {
            console.error('[DataChannel Error]', err);
            this.clearConnectionTimeout();
            this.manager.notifyStatus(`[Online 2] Lỗi DataChannel: ${err.message || err.type}`, true);
        });
    }

    send(data) {
        if (!this.conn) return;
        if (this.conn.open) {
            try {
                this.conn.send(data);
            } catch (e) {
                console.error('[WebRTC send error]', e);
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
}

// ---------------------------------------------------------------------
// UNIFIED NETWORK MANAGER (FACADE FOR ONLINE 1 & ONLINE 2)
// ---------------------------------------------------------------------
export class NetworkManager {
    constructor() {
        this.mode = 'WEBSOCKET'; // 'WEBSOCKET' (Online 1) | 'WEBRTC' (Online 2)
        this.wsProvider = new WebSocketNetworkProvider(this);
        this.rtcProvider = new WebRTCNetworkProvider(this);
        this.activeProvider = this.wsProvider;

        this.onStatusChange = null;
        this.onConnected = null;
        this.onDisconnected = null;
        this.onData = null;
        this.onRoomCreated = null;
    }

    setMode(newMode) {
        const target = (newMode === 'WEBRTC') ? 'WEBRTC' : 'WEBSOCKET';
        if (this.mode === target) return;

        this.disconnect();
        this.mode = target;
        this.activeProvider = (target === 'WEBRTC') ? this.rtcProvider : this.wsProvider;
        
        const modeLabel = target === 'WEBSOCKET' ? 'ONLINE 1 (WebSocket Server)' : 'ONLINE 2 (WebRTC P2P)';
        this.notifyStatus(`Đã chọn chế độ: ${modeLabel}`);
    }

    get role() {
        return this.activeProvider.role;
    }

    set role(r) {
        this.activeProvider.role = r;
    }

    get slotIndex() {
        return this.activeProvider.slotIndex || 0;
    }

    get roomMode() {
        return this.activeProvider.roomMode || '1v1';
    }

    get isConnected() {
        return this.activeProvider.isConnected;
    }

    get roomCode() {
        return this.activeProvider.roomCode;
    }

    setWsServerUrl(url) {
        this.wsProvider.setServerUrl(url);
    }

    getWsServerUrl() {
        return this.wsProvider.getServerUrl();
    }

    createRoom(mode = '1v1') {
        return this.activeProvider.createRoom(mode);
    }

    joinRoom(code) {
        return this.activeProvider.joinRoom(code);
    }

    send(data) {
        return this.activeProvider.send(data);
    }

    disconnect() {
        this.wsProvider.disconnect();
        this.rtcProvider.disconnect();
    }

    notifyStatus(msg, isError = false) {
        if (this.onStatusChange) {
            this.onStatusChange(msg, isError);
        }
    }

    notifyConnected(role, roomCode, slotIndex, roomMode) {
        if (this.onConnected) {
            this.onConnected(role, roomCode, slotIndex, roomMode);
        }
    }

    notifyMembersUpdate(info) {
        if (this.onMembersUpdate) {
            this.onMembersUpdate(info);
        }
    }

    notifyDisconnected() {
        if (this.onDisconnected) {
            this.onDisconnected();
        }
    }

    notifyData(data, senderSlot) {
        if (this.onData) {
            this.onData(data, senderSlot);
        }
    }

    notifyRoomCreated(code, slotIndex, mode) {
        if (this.onRoomCreated) {
            this.onRoomCreated(code, slotIndex, mode);
        }
    }
}

export const network = new NetworkManager();
if (typeof window !== 'undefined') {
    window.network = network;
}
