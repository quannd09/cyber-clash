import { assets } from './assets.js?v=73';
import { network } from './network.js?v=73';
import { input } from './input.js?v=73';

const SKILL_DATA = {
    yanagi: {
        title: '⚡ TSUKISHIRO YANAGI (MELEE • 475 HP)',
        color: '#a78bfa',
        p1: [
            { key: 'Left Click / F (Melee)', name: 'Moon Spear', desc: '' },
            { key: 'R (Skill)', name: 'Flash Blink', desc: '' },
            { key: 'Space (Ultimate)', name: 'Lightning Cannon', desc: '' }
        ],
        p2: [
            { key: 'J (Melee)', name: 'Moon Spear', desc: '' },
            { key: 'I (Skill)', name: 'Flash Blink', desc: '' },
            { key: 'Enter (Ultimate)', name: 'Lightning Cannon', desc: '' }
        ]
    },
    velina: {
        title: '🌸 VERINA AIRGID (RANGED • 480 HP)',
        color: '#34d399',
        p1: [
            { key: 'Left Click / F (Ranged)', name: 'Comet Blast', desc: '' },
            { key: 'R (Skill)', name: 'Photosynthesis (Hồi 50 HP)', desc: '' },
            { key: 'Space (Ultimate)', name: 'Life Blossom Storm (Không hồi máu)', desc: '' }
        ],
        p2: [
            { key: 'J (Ranged)', name: 'Comet Blast', desc: '' },
            { key: 'I (Skill)', name: 'Photosynthesis (Hồi 50 HP)', desc: '' },
            { key: 'Enter (Ultimate)', name: 'Life Blossom Storm (Không hồi máu)', desc: '' }
        ]
    },
    nicole: {
        title: '💼 NICOLE DEMARA (RANGED • 500 HP)',
        color: '#f472b6',
        p1: [
            { key: 'Left Click / F (Ranged)', name: 'Briefcase Cannon', desc: '' },
            { key: 'R (Skill)', name: 'Vault Dash', desc: '' },
            { key: 'Space (Ultimate)', name: 'Gravitational Black Hole', desc: '' }
        ],
        p2: [
            { key: 'J (Ranged)', name: 'Briefcase Cannon', desc: '' },
            { key: 'I (Skill)', name: 'Vault Dash', desc: '' },
            { key: 'Enter (Ultimate)', name: 'Gravitational Black Hole', desc: '' }
        ]
    },
    trigger: {
        title: '🎯 TRIGGER (RANGED • 460 HP)',
        color: '#38bdf8',
        p1: [
            { key: 'Left Click / F (Ranged)', name: 'Purge Shot', desc: '' },
            { key: 'R (Skill)', name: 'Sniper Stance', desc: '' },
            { key: 'Space (Ultimate)', name: 'Synchronized Firepower', desc: '' }
        ],
        p2: [
            { key: 'J (Ranged)', name: 'Purge Shot', desc: '' },
            { key: 'I (Skill)', name: 'Sniper Stance', desc: '' },
            { key: 'Enter (Ultimate)', name: 'Synchronized Firepower', desc: '' }
        ]
    },
    vivian: {
        title: '🔮 VIVIAN BANSHEE (RANGED • 600 HP)',
        color: '#c084fc',
        p1: [
            { key: 'Left Click / F (Ranged)', name: 'Phantom Feathers', desc: '' },
            { key: 'R (Skill)', name: 'Blooming Ward', desc: '' },
            { key: 'Space (Ultimate)', name: 'Feather Storm Harbinger', desc: '' }
        ],
        p2: [
            { key: 'J (Ranged)', name: 'Phantom Feathers', desc: '' },
            { key: 'I (Skill)', name: 'Blooming Ward', desc: '' },
            { key: 'Enter (Ultimate)', name: 'Feather Storm Harbinger', desc: '' }
        ]
    },
    jotaro: {
        title: '👊 JOTARO KUJO (MELEE • 550 HP)',
        color: '#818cf8',
        p1: [
            { key: 'Left Click / F (Melee)', name: 'ORA ORA ORA!', desc: '' },
            { key: 'R (Skill)', name: 'Star Finger', desc: '' },
            { key: 'Space (Ultimate)', name: 'The World: Time Stop', desc: '' }
        ],
        p2: [
            { key: 'J (Melee)', name: 'ORA ORA ORA!', desc: '' },
            { key: 'I (Skill)', name: 'Star Finger', desc: '' },
            { key: 'Enter (Ultimate)', name: 'The World: Time Stop', desc: '' }
        ]
    },
    goku: {
        title: '🥋 SON GOKU (MELEE • 520 HP)',
        color: '#fbbf24',
        p1: [
            { key: 'Left Click / F (Melee)', name: 'Dragon Fist Ki', desc: '' },
            { key: 'R (Skill)', name: 'Instant Transmission (1.5x Dame)', desc: '' },
            { key: 'Space (Ultimate)', name: 'Super Kamehameha', desc: '' }
        ],
        p2: [
            { key: 'J (Melee)', name: 'Dragon Fist Ki', desc: '' },
            { key: 'I (Skill)', name: 'Instant Transmission (1.5x Dame)', desc: '' },
            { key: 'Enter (Ultimate)', name: 'Super Kamehameha', desc: '' }
        ]
    },
    giorno: {
        title: '🐞 GIORNO GIOVANNA (MELEE • 510 HP)',
        color: '#facc15',
        p1: [
            { key: 'Left Click / F (Melee)', name: 'MUDA MUDA MUDA!', desc: '' },
            { key: 'R (Skill)', name: 'Tree of Life', desc: '' },
            { key: 'Space (Ultimate)', name: 'Return To Zero', desc: '' }
        ],
        p2: [
            { key: 'J (Melee)', name: 'MUDA MUDA MUDA!', desc: '' },
            { key: 'I (Skill)', name: 'Tree of Life', desc: '' },
            { key: 'Enter (Ultimate)', name: 'Return To Zero', desc: '' }
        ]
    },
    naoya: {
        title: '🎞️ NAOYA ZEN\'IN (MELEE • 465 HP)',
        color: '#a3e635',
        p1: [
            { key: 'Left Click / F (Melee)', name: '24 FPS Projection Fists', desc: '' },
            { key: 'R (Skill)', name: 'Projection Step', desc: '' },
            { key: 'Space (Ultimate)', name: '10 FPS Mach 3 Barrage (x1.25 Dame)', desc: '' }
        ],
        p2: [
            { key: 'J (Melee)', name: '24 FPS Projection Fists', desc: '' },
            { key: 'I (Skill)', name: 'Projection Step', desc: '' },
            { key: 'Enter (Ultimate)', name: '10 FPS Mach 3 Barrage (x1.25 Dame)', desc: '' }
        ]
    },
    luffy: {
        title: '🍖 MONKEY D. LUFFY (MELEE • 540 HP)',
        color: '#ef4444',
        p1: [
            { key: 'Left Click / F (Melee)', name: 'Gomu Gomu Pistol', desc: '' },
            { key: 'R (Skill)', name: 'Gigant Stomp', desc: '' },
            { key: 'Space (Ultimate)', name: 'Bajrang Gun', desc: '' }
        ],
        p2: [
            { key: 'J (Melee)', name: 'Gomu Gomu Pistol', desc: '' },
            { key: 'I (Skill)', name: 'Gigant Stomp', desc: '' },
            { key: 'Enter (Ultimate)', name: 'Bajrang Gun', desc: '' }
        ]
    },
    gojo: {
        title: '♾️ SATORU GOJO (MELEE • 500 HP)',
        color: '#0284c7',
        p1: [
            { key: 'Left Click / F (Melee)', name: 'Black Flash Infinity', desc: '' },
            { key: 'R (Skill)', name: 'Hollow Purple 🟣', desc: '' },
            { key: 'Space (Ultimate)', name: 'Unlimited Void 🌌', desc: '' }
        ],
        p2: [
            { key: 'J (Melee)', name: 'Black Flash Infinity', desc: '' },
            { key: 'I (Skill)', name: 'Hollow Purple 🟣', desc: '' },
            { key: 'Enter (Ultimate)', name: 'Unlimited Void 🌌', desc: '' }
        ]
    },
    sukuna: {
        title: '⛩️ RYOMEN SUKUNA (MELEE • 530 HP)',
        color: '#f43f5e',
        p1: [
            { key: 'Left Click / F (Melee)', name: 'Dismantle Slashes', desc: '' },
            { key: 'R (Skill)', name: 'Crimson Fireball 🔥', desc: '' },
            { key: 'Space (Ultimate)', name: 'Malevolent Shrine ⛩️', desc: '' }
        ],
        p2: [
            { key: 'J (Melee)', name: 'Dismantle Slashes', desc: '' },
            { key: 'I (Skill)', name: 'Crimson Fireball 🔥', desc: '' },
            { key: 'Enter (Ultimate)', name: 'Malevolent Shrine ⛩️', desc: '' }
        ]
    }
};

export class UIManager {
    constructor(onStartMatch, onRematch, onNetworkModeChange, onNetworkConnected, onNetworkGameData, onBotDifficultyChange) {
        this.onStartMatch = onStartMatch;
        this.onRematch = onRematch;
        this.onNetworkModeChange = onNetworkModeChange;
        this.onNetworkConnected = onNetworkConnected;
        this.onNetworkGameData = onNetworkGameData;
        this.onBotDifficultyChange = onBotDifficultyChange;

        this.loadoutScreen = document.getElementById('loadout-screen');
        this.victoryScreen = document.getElementById('victory-screen');
        this.controlsModal = document.getElementById('controls-modal');

        this.gameMode = 'LOCAL'; // 'LOCAL' | 'BOT' | 'ONLINE'
        this.botDifficulty = 'normal'; // 'easy' | 'normal' | 'master' | 'impossible'
        this.networkRole = null; // 'HOST' | 'CLIENT' | null
        this.currentRoomCode = null;

        this.p1Ready = false;
        this.p2Ready = false;

        this.p1Char = 'yanagi';
        this.p2Char = 'velina';

        this.initUI();
    }

    initUI() {
        this.setupCharacterSelection();
        this.setupOnlineUI();

        // Ready Buttons
        const p1ReadyBtn = document.getElementById('p1-ready-btn');
        const p2ReadyBtn = document.getElementById('p2-ready-btn');

        if (p1ReadyBtn) {
            p1ReadyBtn.addEventListener('click', () => {
                this.requestFullscreen();
                if (this.gameMode === 'ONLINE' && this.networkRole === 'CLIENT') return;

                if (this.gameMode === 'BOT') {
                    if (this.p1Ready) return;
                    this.p1Ready = true;
                    this.p2Ready = true;
                    p1ReadyBtn.classList.add('ready');
                    p1ReadyBtn.textContent = '✔️ READY!';
                    setTimeout(() => {
                        this.hideLoadout();
                        this.onStartMatch(this.p1Char, this.p2Char);
                    }, 250);
                    return;
                }

                this.p1Ready = !this.p1Ready;
                p1ReadyBtn.classList.toggle('ready', this.p1Ready);
                p1ReadyBtn.textContent = this.p1Ready ? '✔️ P1 READY!' : 'READY (Press F / Space)';

                if (this.gameMode === 'ONLINE') {
                    network.send({ type: 'READY_STATE', player: 'p1', ready: this.p1Ready });
                }
                this.checkBothReady();
            });
        }

        if (p2ReadyBtn) {
            p2ReadyBtn.addEventListener('click', () => {
                this.requestFullscreen();
                if (this.gameMode === 'BOT') return;
                if (this.gameMode === 'ONLINE' && this.networkRole === 'HOST') return;
                this.p2Ready = !this.p2Ready;
                p2ReadyBtn.classList.toggle('ready', this.p2Ready);
                p2ReadyBtn.textContent = this.p2Ready ? '✔️ P2 READY!' : (this.gameMode === 'ONLINE' ? 'READY (Press F / Space)' : 'READY (Press J / Enter)');

                if (this.gameMode === 'ONLINE') {
                    network.send({ type: 'READY_STATE', player: 'p2', ready: this.p2Ready });
                }
                this.checkBothReady();
            });
        }

        // Rematch Button
        const rematchBtn = document.getElementById('rematch-btn');
        if (rematchBtn) {
            const handleRematch = (e) => {
                if (e) { e.preventDefault(); e.stopPropagation(); }
                if (this.gameMode === 'ONLINE') {
                    network.send({ type: 'ONLINE_REMATCH' });
                }
                this.hideVictory();
                if (this.onRematch) this.onRematch();
                this.showLoadout();
            };
            rematchBtn.addEventListener('click', handleRematch);
            rematchBtn.addEventListener('touchend', handleRematch, { passive: false });
        }

        // Return to Lobby / Main Menu Exit Button from Victory Screen
        const victoryExitBtn = document.getElementById('btn-victory-lobby');
        if (victoryExitBtn) {
            const handleVictoryExit = (e) => {
                if (e) { e.preventDefault(); e.stopPropagation(); }
                if (this.gameMode === 'ONLINE') {
                    network.send({ type: 'PLAYER_LEFT' });
                    network.disconnect();
                    if (this.switchToLocal) {
                        this.switchToLocal();
                    }
                }
                this.hideVictory();
                if (this.onRematch) this.onRematch();
                this.showLoadout();
            };
            victoryExitBtn.addEventListener('click', handleVictoryExit);
            victoryExitBtn.addEventListener('touchend', handleVictoryExit, { passive: false });
        }

        // Help Modal Toggle & Close Handlers
        const closeModal = () => {
            const modal = document.getElementById('controls-modal');
            if (modal) modal.classList.add('hidden');
        };

        const openModal = () => {
            const modal = document.getElementById('controls-modal');
            if (modal) modal.classList.remove('hidden');
        };

        const helpBtn = document.getElementById('help-toggle-btn');
        if (helpBtn) {
            helpBtn.addEventListener('click', openModal);
        }

        const closeHelpBtn = document.getElementById('close-help-btn');
        if (closeHelpBtn) {
            closeHelpBtn.addEventListener('click', closeModal);
        }

        const modalCloseX = document.querySelector('.modal-close-btn');
        if (modalCloseX) {
            modalCloseX.addEventListener('click', closeModal);
        }

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });

        this.setupKeybindsModal();
    }

    setupCharacterSelection() {
        // Player 1 click handlers
        document.querySelectorAll('.char-card[data-player="p1"]').forEach(card => {
            card.addEventListener('click', () => {
                if (this.gameMode === 'ONLINE' && this.networkRole === 'CLIENT') return;
                const charId = card.dataset.char;
                this.p1Char = charId;
                this.updateCardSelection('p1', charId);
                this.renderSkillInfo('p1', charId);

                if (this.gameMode === 'ONLINE') {
                    network.send({ type: 'CHAR_SELECT', player: 'p1', charId });
                }
            });
        });

        // Player 2 click handlers
        document.querySelectorAll('.char-card[data-player="p2"]').forEach(card => {
            card.addEventListener('click', () => {
                if (this.gameMode === 'ONLINE' && this.networkRole === 'HOST') return;
                const charId = card.dataset.char;
                this.p2Char = charId;
                this.updateCardSelection('p2', charId);
                this.renderSkillInfo('p2', charId);

                if (this.gameMode === 'ONLINE') {
                    network.send({ type: 'CHAR_SELECT', player: 'p2', charId });
                }
            });
        });
    }

    setupOnlineUI() {
        const localTab = document.getElementById('mode-local-tab');
        const botTab = document.getElementById('mode-bot-tab');
        const onlineTab = document.getElementById('mode-online-tab');
        const botDiffPanel = document.getElementById('bot-difficulty-panel');
        const lobbyPanel = document.getElementById('online-lobby-panel');
        const fightersContainer = document.getElementById('loadout-fighters-container');
        const matchBanner = document.getElementById('online-match-banner');
        const btnCreateRoom = document.getElementById('btn-create-room');
        const btnJoinRoom = document.getElementById('btn-join-room');
        const btnCopyCode = document.getElementById('btn-copy-code');
        const btnLeaveOnline = document.getElementById('btn-leave-online');
        const btnCancelHost = document.getElementById('btn-cancel-host');
        const btnCancelJoin = document.getElementById('btn-cancel-join');
        const inputRoomCode = document.getElementById('input-room-code');
        const hostCodeBox = document.getElementById('host-code-box');
        const displayRoomCode = document.getElementById('display-room-code');
        const clientWaitBox = document.getElementById('client-wait-box');
        const clientWaitMsg = document.getElementById('client-wait-msg');
        const globalMsg = document.getElementById('online-global-msg');
        const bannerRoomCode = document.getElementById('banner-room-code');
        const bannerRoleText = document.getElementById('banner-role-text');

        const switchToLocal = () => {
            this.gameMode = 'LOCAL';
            this.networkRole = null;
            this.currentRoomCode = null;
            network.disconnect();

            if (localTab) localTab.classList.add('active');
            if (botTab) botTab.classList.remove('active');
            if (onlineTab) onlineTab.classList.remove('active');
            if (botDiffPanel) botDiffPanel.classList.add('hidden');
            if (lobbyPanel) lobbyPanel.classList.add('hidden');
            if (matchBanner) matchBanner.classList.add('hidden');
            if (fightersContainer) fightersContainer.classList.remove('hidden');
            if (hostCodeBox) hostCodeBox.classList.add('hidden');
            if (clientWaitBox) clientWaitBox.classList.add('hidden');

            this.restoreLocalFighterPermissions();
            if (this.onNetworkModeChange) this.onNetworkModeChange('LOCAL');
        };
        this.switchToLocal = switchToLocal;

        const switchToBot = () => {
            this.gameMode = 'BOT';
            this.networkRole = null;
            this.currentRoomCode = null;
            network.disconnect();

            if (localTab) localTab.classList.remove('active');
            if (botTab) botTab.classList.add('active');
            if (onlineTab) onlineTab.classList.remove('active');
            if (botDiffPanel) botDiffPanel.classList.remove('hidden');
            if (lobbyPanel) lobbyPanel.classList.add('hidden');
            if (matchBanner) matchBanner.classList.add('hidden');
            if (fightersContainer) fightersContainer.classList.remove('hidden');
            if (hostCodeBox) hostCodeBox.classList.add('hidden');
            if (clientWaitBox) clientWaitBox.classList.add('hidden');

            this.applyBotFighterPermissions();
            if (this.onNetworkModeChange) this.onNetworkModeChange('BOT');
            if (this.onBotDifficultyChange) this.onBotDifficultyChange(this.botDifficulty);
        };

        const switchToOnline = () => {
            this.gameMode = 'ONLINE';
            if (localTab) localTab.classList.remove('active');
            if (botTab) botTab.classList.remove('active');
            if (onlineTab) onlineTab.classList.add('active');
            if (botDiffPanel) botDiffPanel.classList.add('hidden');

            if (network.isConnected) {
                if (lobbyPanel) lobbyPanel.classList.add('hidden');
                if (matchBanner) matchBanner.classList.remove('hidden');
                if (fightersContainer) fightersContainer.classList.remove('hidden');
            } else {
                if (lobbyPanel) lobbyPanel.classList.remove('hidden');
                if (matchBanner) matchBanner.classList.add('hidden');
                if (fightersContainer) fightersContainer.classList.add('hidden');
            }
            if (this.onNetworkModeChange) this.onNetworkModeChange('ONLINE');
        };

        if (localTab) localTab.addEventListener('click', switchToLocal);
        if (botTab) botTab.addEventListener('click', switchToBot);
        if (onlineTab) onlineTab.addEventListener('click', switchToOnline);

        // Difficulty Buttons
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.botDifficulty = btn.dataset.diff;
                this.updateBotLabels();
                if (this.onBotDifficultyChange) this.onBotDifficultyChange(this.botDifficulty);
            });
        });

        // CREATE ROOM (HOST)
        if (btnCreateRoom) {
            btnCreateRoom.addEventListener('click', () => {
                if (clientWaitBox) clientWaitBox.classList.add('hidden');
                if (inputRoomCode) inputRoomCode.value = '';
                if (globalMsg) {
                    globalMsg.textContent = 'Initializing WebRTC peer room...';
                    globalMsg.classList.remove('error');
                }
                network.createRoom();
            });
        }

        // CANCEL HOST ROOM
        if (btnCancelHost) {
            btnCancelHost.addEventListener('click', () => {
                network.disconnect();
                if (hostCodeBox) hostCodeBox.classList.add('hidden');
                if (globalMsg) {
                    globalMsg.textContent = 'Room cancelled. You can create a new room or join your opponent.';
                    globalMsg.classList.remove('error');
                }
            });
        }

        // JOIN ROOM (CLIENT)
        if (btnJoinRoom) {
            btnJoinRoom.addEventListener('click', () => {
                const code = inputRoomCode ? inputRoomCode.value.trim() : '';
                if (!code) {
                    if (globalMsg) {
                        globalMsg.textContent = 'Please enter a room code before joining!';
                        globalMsg.classList.add('error');
                    }
                    return;
                }
                if (hostCodeBox) hostCodeBox.classList.add('hidden');
                if (clientWaitBox) clientWaitBox.classList.remove('hidden');
                if (clientWaitMsg) clientWaitMsg.textContent = `🔄 Connecting to [${code.toUpperCase()}]...`;
                network.joinRoom(code);
            });
        }

        // CANCEL JOIN
        if (btnCancelJoin) {
            btnCancelJoin.addEventListener('click', () => {
                network.disconnect();
                if (clientWaitBox) clientWaitBox.classList.add('hidden');
                if (globalMsg) {
                    globalMsg.textContent = 'Connection attempt cancelled.';
                    globalMsg.classList.remove('error');
                }
            });
        }

        // Enter key in input box
        if (inputRoomCode) {
            inputRoomCode.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && btnJoinRoom) {
                    btnJoinRoom.click();
                }
            });
        }

        // COPY CODE
        if (btnCopyCode) {
            btnCopyCode.addEventListener('click', () => {
                if (displayRoomCode && displayRoomCode.textContent) {
                    navigator.clipboard.writeText(displayRoomCode.textContent).then(() => {
                        btnCopyCode.textContent = '✔️ COPIED!';
                        setTimeout(() => { btnCopyCode.textContent = '📋 COPY'; }, 2000);
                    });
                }
            });
        }

        // LEAVE ONLINE
        if (btnLeaveOnline) {
            btnLeaveOnline.addEventListener('click', switchToLocal);
        }

        const btnDisconnectOk = document.getElementById('btn-disconnect-ok');
        if (btnDisconnectOk) {
            btnDisconnectOk.addEventListener('click', () => {
                const modal = document.getElementById('disconnect-modal');
                if (modal) modal.classList.add('hidden');
                switchToLocal();
            });
        }

        // Network Callbacks
        network.onRoomCreated = (code) => {
            if (hostCodeBox) hostCodeBox.classList.remove('hidden');
            if (displayRoomCode) displayRoomCode.textContent = code;
            if (globalMsg) {
                globalMsg.textContent = `Room [${code}] ready! Share this code with your opponent.`;
                globalMsg.classList.remove('error');
            }
        };

        network.onStatusChange = (msg, isError) => {
            if (globalMsg) {
                globalMsg.textContent = msg;
                globalMsg.classList.toggle('error', !!isError);
            }
            if (clientWaitMsg) {
                clientWaitMsg.textContent = msg;
            }
        };

        network.onConnected = (role, code) => {
            this.networkRole = role;
            this.currentRoomCode = code;

            if (lobbyPanel) lobbyPanel.classList.add('hidden');
            if (matchBanner) matchBanner.classList.remove('hidden');
            if (fightersContainer) fightersContainer.classList.remove('hidden');

            if (bannerRoomCode) bannerRoomCode.textContent = code;
            if (bannerRoleText) {
                bannerRoleText.textContent = role === 'HOST' ? 'ROLE: HOST (P1)' : 'ROLE: CLIENT (P2)';
            }

            this.applyOnlinePermissions(role);
            if (this.onNetworkConnected) {
                this.onNetworkConnected(role, code);
            }
        };

        network.onDisconnected = () => {
            const modal = document.getElementById('disconnect-modal');
            if (modal) modal.classList.remove('hidden');
        };

        network.onData = (data) => {
            this.handleIncomingNetworkData(data);
        };
    }

    applyOnlinePermissions(role) {
        if (role === 'HOST') {
            document.querySelectorAll('.char-card[data-player="p2"]').forEach(card => card.classList.add('card-disabled'));
            document.querySelectorAll('.char-card[data-player="p1"]').forEach(card => card.classList.remove('card-disabled'));

            const p2Btn = document.getElementById('p2-ready-btn');
            if (p2Btn) p2Btn.style.pointerEvents = 'none';

            const p1Btn = document.getElementById('p1-ready-btn');
            if (p1Btn) p1Btn.style.pointerEvents = 'auto';
        } else if (role === 'CLIENT') {
            document.querySelectorAll('.char-card[data-player="p1"]').forEach(card => card.classList.add('card-disabled'));
            document.querySelectorAll('.char-card[data-player="p2"]').forEach(card => card.classList.remove('card-disabled'));

            const p1Btn = document.getElementById('p1-ready-btn');
            if (p1Btn) p1Btn.style.pointerEvents = 'none';

            const p2Btn = document.getElementById('p2-ready-btn');
            if (p2Btn) p2Btn.style.pointerEvents = 'auto';

            // Client gets to use WASD OR Arrow keys on their own computer!
            const p2HeaderLabel = document.querySelector('.player-box.p2-border .section-label');
            if (p2HeaderLabel) p2HeaderLabel.textContent = '[WASD / ARROW KEYS + F/J / H/L / R/I / SPACE/ENTER]';
            if (p2Btn) p2Btn.textContent = 'READY (Press F / Space / J / Enter)';
            this.renderSkillInfo('p2', this.p2Char);
        }
    }

    updateBotLabels() {
        const p2HeaderTitle = document.querySelector('.player-box.p2-border .player-header .p2-color');
        const p2HeaderLabel = document.querySelector('.player-box.p2-border .player-header .section-label');
        if (p2HeaderTitle) p2HeaderTitle.textContent = 'BOT (CPU)';
        if (p2HeaderLabel) p2HeaderLabel.textContent = `[AI OPPONENT • ${this.botDifficulty.toUpperCase()}]`;
    }

    applyBotFighterPermissions() {
        document.querySelectorAll('.char-card').forEach(card => card.classList.remove('card-disabled'));

        const p1Title = document.querySelector('.player-box.p1-border .player-header .p1-color');
        if (p1Title) p1Title.textContent = 'PLAYER 1 (YOU)';

        this.updateBotLabels();

        const p1Btn = document.getElementById('p1-ready-btn');
        if (p1Btn) {
            p1Btn.style.pointerEvents = 'auto';
            p1Btn.textContent = 'READY (Press F / Space)';
            p1Btn.classList.remove('ready');
        }

        const p2Btn = document.getElementById('p2-ready-btn');
        if (p2Btn) {
            p2Btn.style.pointerEvents = 'none';
            p2Btn.textContent = '🤖 BOT READY';
            p2Btn.classList.add('ready');
        }
        this.p1Ready = false;
        this.p2Ready = true;
    }

    restoreLocalFighterPermissions() {
        document.querySelectorAll('.char-card').forEach(card => card.classList.remove('card-disabled'));

        const p1Title = document.querySelector('.player-box.p1-border .player-header .p1-color');
        if (p1Title) p1Title.textContent = 'PLAYER 1';

        const p2Title = document.querySelector('.player-box.p2-border .player-header .p2-color');
        if (p2Title) p2Title.textContent = 'PLAYER 2';

        const p1Btn = document.getElementById('p1-ready-btn');
        if (p1Btn) {
            p1Btn.style.pointerEvents = 'auto';
            p1Btn.textContent = 'READY (Press F / Space)';
            p1Btn.classList.remove('ready');
        }

        const p2Btn = document.getElementById('p2-ready-btn');
        if (p2Btn) {
            p2Btn.style.pointerEvents = 'auto';
            p2Btn.textContent = 'READY (Press J / Enter)';
            p2Btn.classList.remove('ready');
        }

        const p2HeaderLabel = document.querySelector('.player-box.p2-border .player-header .section-label');
        if (p2HeaderLabel) p2HeaderLabel.textContent = '[ARROW KEYS + J / L / I / U / ENTER]';

        this.p1Ready = false;
        this.p2Ready = false;
    }

    handleIncomingNetworkData(data) {
        if (!data) return;

        if (data.type === 'CHAR_SELECT') {
            if (data.player === 'p1') {
                this.p1Char = data.charId;
                this.updateCardSelection('p1', data.charId);
                this.renderSkillInfo('p1', data.charId);
            } else if (data.player === 'p2') {
                this.p2Char = data.charId;
                this.updateCardSelection('p2', data.charId);
                this.renderSkillInfo('p2', data.charId);
            }
        } else if (data.type === 'READY_STATE') {
            if (data.player === 'p1') {
                this.p1Ready = data.ready;
                const p1Btn = document.getElementById('p1-ready-btn');
                if (p1Btn) {
                    p1Btn.classList.toggle('ready', data.ready);
                    p1Btn.textContent = data.ready ? '✔️ P1 READY!' : 'READY (Press F / Space)';
                }
            } else if (data.player === 'p2') {
                this.p2Ready = data.ready;
                const p2Btn = document.getElementById('p2-ready-btn');
                if (p2Btn) {
                    p2Btn.classList.toggle('ready', data.ready);
                    p2Btn.textContent = data.ready ? '✔️ P2 READY!' : 'READY (Press J / Enter)';
                }
            }
            this.checkBothReady();
        } else if (data.type === 'MATCH_START') {
            this.hideLoadout();
            this.onStartMatch(data.p1Char, data.p2Char);
        } else if (data.type === 'ONLINE_REMATCH') {
            this.hideVictory();
            if (this.onRematch) this.onRematch();
            this.showLoadout();
        } else if (data.type === 'PLAYER_LEFT') {
            this.hideVictory();
            network.disconnect();
            if (this.switchToLocal) this.switchToLocal();
            const modal = document.getElementById('disconnect-modal');
            const msg = document.getElementById('disconnect-msg');
            if (msg) msg.textContent = 'Đối thủ đã rời khỏi phòng hoặc thoát về menu chính.';
            if (modal) modal.classList.remove('hidden');
        } else if (this.onNetworkGameData) {
            this.onNetworkGameData(data);
        }
    }

    updateCardSelection(player, charId) {
        document.querySelectorAll(`.char-card[data-player="${player}"]`).forEach(card => {
            card.classList.remove('selected', 'selected-yanagi', 'selected-velina', 'selected-nicole', 'selected-trigger', 'selected-vivian', 'selected-jotaro', 'selected-goku', 'selected-giorno', 'selected-naoya', 'selected-luffy', 'selected-gojo', 'selected-sukuna');
            if (card.dataset.char === charId) {
                card.classList.add('selected', `selected-${charId}`);
            }
        });
    }

    renderSkillInfo(player, charId) {
        const box = document.getElementById(`${player}-skill-info`);
        if (!box) return;

        const data = SKILL_DATA[charId];
        if (!data) return;
        const moves = data[player] || [];
        const isOnlineClient = (this.gameMode === 'ONLINE' && (this.networkRole === 'CLIENT' || network.role === 'CLIENT') && player === 'p2');
        const playerIndex = isOnlineClient ? 0 : (player === 'p1' ? 0 : 1);

        const atkKey = input.getBindingDisplay(playerIndex, 'lightAttack');
        const sklKey = input.getBindingDisplay(playerIndex, 'skill');
        const ultKey = input.getBindingDisplay(playerIndex, 'ultimate');

        let html = `
            <div class="skill-info-header">
                <span class="skill-char-name" style="color: ${data.color};">${data.title}</span>
                <span class="skill-badge">MOVES</span>
            </div>
        `;

        moves.forEach((m, idx) => {
            let keyDisplay = m.key;
            if (idx === 0) {
                keyDisplay = (player === 'p1' || isOnlineClient) ? `Left Click / ${atkKey} (Attack)` : `${atkKey} (Attack)`;
            } else if (idx === 1) {
                keyDisplay = `${sklKey} (Skill)`;
            } else if (idx === 2) {
                keyDisplay = `${ultKey} (Ultimate)`;
            }

            html += `
                <div class="skill-row">
                    <span class="skill-key">${keyDisplay}</span>
                    <span class="skill-name">${m.name}</span>
                    <span class="skill-desc">${m.desc}</span>
                </div>
            `;
        });

        box.innerHTML = html;
    }

    setupKeybindsModal() {
        const modal = document.getElementById('keybinds-modal');
        const openBtn = document.getElementById('keybinds-toggle-btn');
        const resetBtn = document.getElementById('btn-reset-keybinds');
        const p1Table = document.getElementById('p1-keybinds-table');
        const p2Table = document.getElementById('p2-keybinds-table');

        if (!modal) return;

        const ACTIONS = [
            { id: 'up', label: 'Move Up' },
            { id: 'down', label: 'Move Down' },
            { id: 'left', label: 'Move Left' },
            { id: 'right', label: 'Move Right' },
            { id: 'lightAttack', label: 'Normal Attack' },
            { id: 'shield', label: 'Shield / Parry' },
            { id: 'skill', label: 'Special Skill' },
            { id: 'dash', label: 'Dash / Boost' },
            { id: 'ultimate', label: 'Ultimate Overdrive' }
        ];

        let activeListeningBtn = null;

        const renderTables = () => {
            if (p1Table) {
                p1Table.innerHTML = ACTIONS.map(a => `
                    <tr>
                        <td><span class="keybind-label">${a.label}</span></td>
                        <td style="text-align: right;">
                            <button class="rebind-btn" data-player="0" data-action="${a.id}">${input.getBindingDisplay(0, a.id)}</button>
                        </td>
                    </tr>
                `).join('');
            }
            if (p2Table) {
                p2Table.innerHTML = ACTIONS.map(a => `
                    <tr>
                        <td><span class="keybind-label">${a.label}</span></td>
                        <td style="text-align: right;">
                            <button class="rebind-btn" data-player="1" data-action="${a.id}">${input.getBindingDisplay(1, a.id)}</button>
                        </td>
                    </tr>
                `).join('');
            }

            // Add click listeners to all rebind buttons
            modal.querySelectorAll('.rebind-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (activeListeningBtn && activeListeningBtn !== btn) {
                        const p = parseInt(activeListeningBtn.dataset.player, 10);
                        const a = activeListeningBtn.dataset.action;
                        activeListeningBtn.classList.remove('listening');
                        activeListeningBtn.textContent = input.getBindingDisplay(p, a);
                    }

                    activeListeningBtn = btn;
                    btn.classList.add('listening');
                    btn.textContent = 'BẤM PHÍM...';
                });
            });
        };

        // Key listening listener
        window.addEventListener('keydown', (e) => {
            if (!activeListeningBtn) return;
            if (e.key === 'Escape') {
                const p = parseInt(activeListeningBtn.dataset.player, 10);
                const a = activeListeningBtn.dataset.action;
                activeListeningBtn.classList.remove('listening');
                activeListeningBtn.textContent = input.getBindingDisplay(p, a);
                activeListeningBtn = null;
                return;
            }

            e.preventDefault();
            const playerIndex = parseInt(activeListeningBtn.dataset.player, 10);
            const actionId = activeListeningBtn.dataset.action;

            input.rebindAction(playerIndex, actionId, e.code, e.key);
            activeListeningBtn.textContent = input.getBindingDisplay(playerIndex, actionId);
            activeListeningBtn.classList.remove('listening');
            activeListeningBtn = null;

            // Re-render skill info box to reflect custom bindings
            this.renderSkillInfo('p1', this.p1Char);
            this.renderSkillInfo('p2', this.p2Char);
        });

        if (openBtn) {
            openBtn.addEventListener('click', () => {
                modal.classList.remove('hidden');
                renderTables();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                input.resetDefaults();
                renderTables();
                this.renderSkillInfo('p1', this.p1Char);
                this.renderSkillInfo('p2', this.p2Char);
            });
        }

        renderTables();
    }

    checkBothReady() {
        if (this.p1Ready && this.p2Ready) {
            if (this.gameMode === 'ONLINE') {
                if (this.networkRole === 'HOST' || network.role === 'HOST') {
                    network.send({ type: 'MATCH_START', p1Char: this.p1Char, p2Char: this.p2Char });
                    setTimeout(() => {
                        this.hideLoadout();
                        this.onStartMatch(this.p1Char, this.p2Char);
                    }, 300);
                }
            } else {
                setTimeout(() => {
                    this.hideLoadout();
                    this.onStartMatch(this.p1Char, this.p2Char);
                }, 300);
            }
        }
    }

    showLoadout() {
        this.p1Ready = false;
        this.p2Ready = (this.gameMode === 'BOT');
        const p1Btn = document.getElementById('p1-ready-btn');
        const p2Btn = document.getElementById('p2-ready-btn');
        if (p1Btn) { p1Btn.classList.remove('ready'); p1Btn.textContent = 'READY (Press F / Space)'; }
        if (p2Btn) {
            if (this.gameMode === 'BOT') {
                p2Btn.classList.add('ready');
                p2Btn.textContent = '🤖 BOT READY';
            } else {
                p2Btn.classList.remove('ready');
                p2Btn.textContent = (this.gameMode === 'ONLINE' && this.networkRole === 'CLIENT') ? 'READY (Press F / Space)' : 'READY (Press J / Enter)';
            }
        }

        this.loadoutScreen.classList.remove('hidden');
        this.victoryScreen.classList.add('hidden');
    }

    hideLoadout() {
        this.loadoutScreen.classList.add('hidden');
    }

    showVictory(winnerName, winnerColor) {
        this.victoryScreen.classList.remove('hidden');
        const title = document.getElementById('winner-title');
        if (title) {
            title.textContent = `${winnerName.toUpperCase()} WINS!`;
            title.style.color = winnerColor;
            title.style.textShadow = `0 0 25px ${winnerColor}`;
        }
    }

    hideVictory() {
        this.victoryScreen.classList.add('hidden');
    }

    requestFullscreen() {
        if (typeof window !== 'undefined' && window.game && typeof window.game.requestFullscreen === 'function') {
            window.game.requestFullscreen();
            return;
        }
        try {
            const container = document.getElementById('game-container') || document.documentElement;
            if (container.requestFullscreen) {
                container.requestFullscreen({ navigationUI: 'hide' }).catch(() => {});
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            }
        } catch (err) {}
    }
}
