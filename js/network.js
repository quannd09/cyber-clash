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

        this.notifyStatus(`Đang tạo phòng [${this.roomCode}]...`);

        try {
            if (typeof Peer === 'undefined') {
                this.notifyStatus('Lỗi: Thư viện PeerJS chưa được tải!', true);
                return;
            }

            this.peer = new Peer(peerId, {
                debug: 1
            });

            this.peer.on('open', (id) => {
                this.notifyStatus(`Phòng đã sẵn sàng! Đang đợi người chơi thứ 2...`);
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
                    // Trùng mã phòng, tạo lại mã khác
                    this.createRoom();
                } else {
                    this.notifyStatus(`Lỗi máy chủ mạng: ${err.type || err.message}`, true);
                }
            });

        } catch (e) {
            console.error('[Create Room Exception]', e);
            this.notifyStatus(`Không thể khởi tạo phòng: ${e.message}`, true);
        }
    }

    joinRoom(rawCode) {
        this.disconnect();
        const code = this.cleanCode(rawCode);
        if (!code || code === 'CLASH-') {
            this.notifyStatus('Vui lòng nhập mã phòng hợp lệ!', true);
            return;
        }

        this.role = 'CLIENT';
        this.roomCode = code;
        const hostPeerId = this.getPeerIdFromCode(code);

        this.notifyStatus(`Đang tìm kiếm phòng [${code}]...`);

        try {
            if (typeof Peer === 'undefined') {
                this.notifyStatus('Lỗi: Thư viện PeerJS chưa được tải!', true);
                return;
            }

            this.peer = new Peer(undefined, {
                debug: 1
            });

            this.peer.on('open', (myId) => {
                this.notifyStatus(`Đang bắt tay với phòng [${code}]...`);
                const conn = this.peer.connect(hostPeerId, {
                    reliable: true
                });
                this.conn = conn;
                this.setupConnection(conn, false);
            });

            this.peer.on('error', (err) => {
                console.error('[Network Client Error]', err);
                if (err.type === 'peer-unavailable') {
                    this.notifyStatus(`Mã phòng [${code}] không tồn tại hoặc đã đóng!`, true);
                } else {
                    this.notifyStatus(`Lỗi kết nối: ${err.type || err.message}`, true);
                }
            });

        } catch (e) {
            console.error('[Join Room Exception]', e);
            this.notifyStatus(`Không thể tham gia phòng: ${e.message}`, true);
        }
    }

    setupConnection(conn, isHost) {
        const handleOpen = () => {
            this.isConnected = true;
            this.notifyStatus(`✅ Kết nối thành công! Đang vào sảnh đấu...`);
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
            this.notifyStatus(`⚠️ Kết nối với đối thủ đã bị gián đoạn!`, true);
            if (this.onDisconnected) {
                this.onDisconnected();
            }
        });

        conn.on('error', (err) => {
            console.error('[DataChannel Error]', err);
            this.notifyStatus(`Lỗi đường truyền: ${err.message}`, true);
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
