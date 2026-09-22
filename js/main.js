// Main Game Controller & 60 FPS RequestAnimationFrame Loop
import { sound } from './audio.js?v=80';
import { input } from './input.js?v=80';
import { fx } from './particles.js?v=80';
import { combat, Projectile } from './combat.js?v=80';
import { Cyborg } from './cyborg.js?v=80';
import { GameRenderer } from './renderer.js?v=80';
import { UIManager } from './ui.js?v=80';
import { network } from './network.js?v=80';
import { BotController } from './bot.js?v=80';

const STATE_LOADOUT = 'LOADOUT';
const STATE_COUNTDOWN = 'COUNTDOWN';
const STATE_FIGHT = 'FIGHT';
const STATE_ROUND_OVER = 'ROUND_OVER';
const STATE_VICTORY = 'VICTORY';

class CyberClashGame {
    constructor() {
        window.game = this;
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.input = input;
        this.renderer = new GameRenderer(this.canvas, this.ctx);

        // Arena Boundaries (Margin inside canvas)
        this.bounds = {
            minX: 70,
            maxX: 1210,
            minY: 90,
            maxY: 690
        };

        // Players (P1: Tsukishiro Yanagi, P2: Velina Airgid)
        this.p1 = new Cyborg(0, 240, 390, '#a78bfa', 'TSUKISHIRO YANAGI', 'yanagi');
        this.p2 = new Cyborg(1, 1040, 390, '#34d399', 'VELINA AIRGID', 'velina');

        this.state = STATE_LOADOUT;
        this.round = 1;
        this.matchTimer = 90;
        this.countdownTimer = 0;
        this.roundOverTimer = 0;
        this.roundMessage = '';

        // Game Modes & AI Bot
        this.gameMode = 'LOCAL'; // 'LOCAL' | 'BOT' | 'ONLINE'
        this.bot = new BotController('normal');
        this.networkRole = null; // 'HOST' | 'CLIENT' | null
        this.latestClientInputs = null;
        this.clientInputBuffer = null;
        this.latestSnapshot = null;

        this.ui = new UIManager(
            (p1Loadout, p2Loadout) => this.startMatch(p1Loadout, p2Loadout),
            () => this.resetMatch(),
            (mode) => this.setGameMode(mode),
            (role, code) => { this.networkRole = role; },
            (data) => this.handleNetworkGameData(data),
            (diff) => { this.bot.setDifficulty(diff); }
        );

        this.setGameMode('LOCAL');
        this.initResize();
        this.initAudioUnlock();
        this.initMobileControls();
        this.initGameLoop();
    }

    setGameMode(mode) {
        this.gameMode = mode;
        const isLocal2P = (mode === 'LOCAL');
        if (input && typeof input.setMouseEnabled === 'function') {
            input.setMouseEnabled(!isLocal2P);
        }
        if (this.canvas) {
            this.canvas.style.cursor = isLocal2P ? 'default' : 'crosshair';
        }
    }

    get isOnlineHost() {
        return this.gameMode === 'ONLINE' && (this.networkRole === 'HOST' || network.role === 'HOST');
    }

    get isOnlineClient() {
        return this.gameMode === 'ONLINE' && (this.networkRole === 'CLIENT' || network.role === 'CLIENT');
    }

    initResize() {
        const resize = () => {
            this.canvas.width = 1280;
            this.canvas.height = 720;
        };
        resize();
        window.addEventListener('resize', resize);
    }

    initAudioUnlock() {
        const unlock = () => {
            sound.init();
            sound.resume();
            window.removeEventListener('click', unlock);
            window.removeEventListener('keydown', unlock);
        };
        window.addEventListener('click', unlock);
        window.addEventListener('keydown', unlock);
    }

    initMobileControls() {
        if (this.input && typeof this.input.initTouchControls === 'function') {
            this.input.initTouchControls(document.getElementById('game-container'));
        }

        // Fullscreen Toggle Button (with touchend + click, debounce, and stopPropagation)
        const fsBtn = document.getElementById('fullscreen-toggle-btn');
        if (fsBtn) {
            let lastFsToggle = 0;
            const onFsToggle = (e) => {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                const now = Date.now();
                if (now - lastFsToggle < 300) return;
                lastFsToggle = now;
                this.toggleFullscreen();
            };
            fsBtn.addEventListener('touchend', onFsToggle, { passive: false });
            fsBtn.addEventListener('click', onFsToggle);
        }

        // Touch Controls Toggle Button (AUTO / ON / OFF)
        const touchBtn = document.getElementById('touch-toggle-btn');
        if (touchBtn) {
            const updateTouchBtnText = () => {
                const mode = this.input.touchControlMode || 'auto';
                touchBtn.textContent = `📱 Touch: ${mode.toUpperCase()}`;
                this.updateTouchControlsVisibility();
            };
            updateTouchBtnText();
            touchBtn.addEventListener('click', () => {
                this.input.cycleTouchControlMode();
                updateTouchBtnText();
            });
        }

        // Auto-request fullscreen on tap/click when playing game (excluding interactive UI buttons)
        const triggerAutoFullscreen = (e) => {
            if (e && e.target && e.target.closest('button, input, select, .modal-box, .controls-content, .help-toggle, .char-card, .diff-btn, .mode-tab, .ready-btn, .rematch-btn, .victory-exit-btn, .touch-btn')) {
                return;
            }
            if (this.state !== STATE_LOADOUT && !this.isFullscreen()) {
                this.requestFullscreen();
            }
        };
        window.addEventListener('click', triggerAutoFullscreen, { passive: true });
        window.addEventListener('touchend', triggerAutoFullscreen, { passive: true });

        // Fullscreen change events to sync UI state
        const onFsChange = () => {
            this.syncFullscreenUI(this.isFullscreen());
        };
        document.addEventListener('fullscreenchange', onFsChange);
        document.addEventListener('webkitfullscreenchange', onFsChange);
        document.addEventListener('mozfullscreenchange', onFsChange);
        document.addEventListener('MSFullscreenChange', onFsChange);

        this.updateTouchControlsVisibility();
    }

    isFullscreen() {
        return !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement ||
            document.body.classList.contains('mobile-fullscreen-active') ||
            (document.getElementById('game-container') && document.getElementById('game-container').classList.contains('mobile-fullscreen-active'))
        );
    }

    toggleFullscreen() {
        if (this.isFullscreen()) {
            this.exitFullscreen();
        } else {
            this.requestFullscreen();
        }
    }

    requestFullscreen() {
        const container = document.getElementById('game-container') || document.documentElement;
        let nativeAttempted = false;

        try {
            if (container.requestFullscreen) {
                container.requestFullscreen({ navigationUI: 'hide' }).catch(() => {
                    this.enablePseudoFullscreen();
                });
                nativeAttempted = true;
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
                nativeAttempted = true;
            } else if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen({ navigationUI: 'hide' }).catch(() => {
                    this.enablePseudoFullscreen();
                });
                nativeAttempted = true;
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
                nativeAttempted = true;
            }
        } catch (e) {
            nativeAttempted = false;
        }

        if (!nativeAttempted) {
            this.enablePseudoFullscreen();
        }

        // On mobile devices, always also add the pseudo-fullscreen class to ensure zero-margin view
        if (/Android|iPhone|iPad|iPod|mobile/i.test(navigator.userAgent)) {
            this.enablePseudoFullscreen();
        }

        try {
            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock('landscape').catch(() => {});
            }
        } catch (e) {}

        try {
            window.scrollTo(0, 1);
        } catch (e) {}

        this.syncFullscreenUI(true);
    }

    exitFullscreen() {
        try {
            if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
                if (document.exitFullscreen) {
                    document.exitFullscreen().catch(() => {});
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        } catch (e) {}

        this.disablePseudoFullscreen();

        try {
            if (screen.orientation && screen.orientation.unlock) {
                screen.orientation.unlock();
            }
        } catch (e) {}

        this.syncFullscreenUI(false);
    }

    enablePseudoFullscreen() {
        document.body.classList.add('mobile-fullscreen-active');
        const container = document.getElementById('game-container');
        if (container) container.classList.add('mobile-fullscreen-active');
    }

    disablePseudoFullscreen() {
        document.body.classList.remove('mobile-fullscreen-active');
        const container = document.getElementById('game-container');
        if (container) container.classList.remove('mobile-fullscreen-active');
    }

    syncFullscreenUI(active) {
        const fsBtn = document.getElementById('fullscreen-toggle-btn');
        if (fsBtn) {
            fsBtn.textContent = active ? '🗗 Windowed' : '⛶ Fullscreen';
        }
    }

    updateTouchControlsVisibility() {
        const touchOverlay = document.getElementById('touch-controls');
        if (!touchOverlay) return;

        const inFight = (this.state === STATE_FIGHT || this.state === STATE_COUNTDOWN || this.state === STATE_ROUND_OVER);
        const shouldShow = inFight && Boolean(this.input.touchEnabled);

        if (shouldShow) {
            touchOverlay.classList.remove('hidden');
        } else {
            touchOverlay.classList.add('hidden');
        }
    }

    startMatch(p1Char, p2Char) {
        this.requestFullscreen();
        const charNames = {
            yanagi: 'TSUKISHIRO YANAGI',
            velina: 'VERINA AIRGID',
            nicole: 'NICOLE DEMARA',
            trigger: 'TRIGGER',
            vivian: 'VIVIAN BANSHEE',
            jotaro: 'JOTARO KUJO',
            goku: 'SON GOKU',
            giorno: 'GIORNO GIOVANNA',
            naoya: "NAOYA ZEN'IN",
            luffy: 'MONKEY D. LUFFY',
            gojo: 'SATORU GOJO',
            sukuna: 'RYOMEN SUKUNA',
            saitama: 'SAITAMA',
            tst26: 'TST-26'
        };
        const charColors = {
            yanagi: '#a78bfa',
            velina: '#34d399',
            nicole: '#f472b6',
            trigger: '#38bdf8',
            vivian: '#c084fc',
            jotaro: '#818cf8',
            goku: '#fbbf24',
            giorno: '#facc15',
            naoya: '#a3e635',
            luffy: '#ef4444',
            gojo: '#0284c7',
            sukuna: '#f43f5e',
            saitama: '#eab308',
            tst26: '#ec4899'
        };

        const p1Name = charNames[p1Char] || 'TSUKISHIRO YANAGI';
        let p2Name = charNames[p2Char] || 'VERINA AIRGID';
        if (this.gameMode === 'BOT') {
            p2Name = `[BOT] ${p2Name}`;
        }
        const p1Color = charColors[p1Char] || '#a78bfa';
        const p2Color = charColors[p2Char] || '#34d399';

        this.p1 = new Cyborg(0, 240, 390, p1Color, p1Name, p1Char);
        this.p2 = new Cyborg(1, 1040, 390, p2Color, p2Name, p2Char);

        this.p1.roundsWon = 0;
        this.p2.roundsWon = 0;
        this.round = 1;
        this.latestClientInputs = null;
        this.clientInputBuffer = null;
        this.latestSnapshot = null;

        // Ensure mode controls and cursor are in sync (e.g. mouse disabled in Local mode)
        this.setGameMode(this.gameMode);

        // Ensure keyboard focus is on window/canvas so keystrokes register immediately
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }
        window.focus();

        sound.startBGM();
        this.startRound();
    }

    resetMatch() {
        this.state = STATE_LOADOUT;
        this.p1.roundsWon = 0;
        this.p2.roundsWon = 0;
        this.round = 1;
        this.latestClientInputs = null;
        this.clientInputBuffer = null;
        this.latestSnapshot = null;
        this.ui.showLoadout();
        this.updateTouchControlsVisibility();
    }

    startRound() {
        this.state = STATE_COUNTDOWN;
        this.countdownTimer = 150; // ~2.5s
        this.matchTimer = 90;
        this.roundMessage = `ROUND ${this.round}`;

        this.p1.reset(240, 390, 0);
        this.p2.reset(1040, 390, Math.PI);
        combat.reset();
        fx.clear();

        sound.playRoundStart();
        this.updateTouchControlsVisibility();
    }

    initGameLoop() {
        this.lastTime = performance.now();

        // 1. Primary smooth 60/120+ FPS loop via requestAnimationFrame when tab is visible
        const rafLoop = (now) => {
            requestAnimationFrame(rafLoop);
            if (!document.hidden) {
                try {
                    this.step(now);
                } catch (err) {
                    console.error('[GameLoop Error]', err);
                }
            }
        };
        requestAnimationFrame(rafLoop);

        // 2. Resilient Background Worker ticker: ensures Host physics and network sync
        // continue running at solid 60 FPS even when tab is backgrounded or minimized
        try {
            const workerCode = `
                let timer = null;
                self.onmessage = function(e) {
                    if (e.data === 'start') {
                        if (!timer) timer = setInterval(() => self.postMessage('tick'), 1000 / 60);
                    } else if (e.data === 'stop') {
                        if (timer) { clearInterval(timer); timer = null; }
                    }
                };
            `;
            const blob = new Blob([workerCode], { type: 'application/javascript' });
            const workerUrl = URL.createObjectURL(blob);
            this.worker = new Worker(workerUrl);
            this.worker.onmessage = () => {
                // If tab is in background (requestAnimationFrame paused), keep game logic & network running!
                if (document.hidden) {
                    try {
                        this.step(performance.now());
                    } catch (err) {
                        console.error('[Worker Step Error]', err);
                    }
                }
            };
            this.worker.postMessage('start');
        } catch (e) {
            console.warn('[Loop] Web Worker ticker fallback failed, using window interval fallback', e);
            setInterval(() => {
                if (document.hidden) {
                    try {
                        this.step(performance.now());
                    } catch (err) {
                        console.error('[Interval Step Error]', err);
                    }
                }
            }, 1000 / 60);
        }
    }

    step(now) {
        try {
            const dtMs = now - this.lastTime;
            this.lastTime = now;
            // Ensure dt is always positive and valid number
            const dt = Math.max(0.1, Math.min(2.5, (dtMs && !isNaN(dtMs)) ? (dtMs / (1000 / 60)) : 1));

            if (input && typeof input.update === 'function') {
                input.update();
            }

            this.update(dt);
            if (!document.hidden) {
                this.render();
            }

            if (input && typeof input.postUpdate === 'function') {
                input.postUpdate();
            }
        } catch (err) {
            console.error('[Step Error]', err);
        }
    }

    update(dt) {
        this.renderer.update(dt);
        fx.update(dt);

        if (this.state === STATE_LOADOUT) {
            if (this.gameMode === 'LOCAL') {
                if (input.isKeyJustPressed('KeyF') || input.isKeyJustPressed('Space')) {
                    const btn = document.getElementById('p1-ready-btn');
                    if (btn) btn.click();
                }
                if (input.isKeyJustPressed('Numpad1') || input.isKeyJustPressed('KeyJ') || input.isKeyJustPressed('Enter')) {
                    const btn = document.getElementById('p2-ready-btn');
                    if (btn) btn.click();
                }
            } else if (this.gameMode === 'BOT') {
                if (input.isKeyJustPressed('KeyF') || input.isKeyJustPressed('Space')) {
                    const btn = document.getElementById('p1-ready-btn');
                    if (btn) btn.click();
                }
            } else if (this.gameMode === 'ONLINE') {
                if (this.isOnlineHost) {
                    if (input.isKeyJustPressed('KeyF') || input.isKeyJustPressed('Space')) {
                        const btn = document.getElementById('p1-ready-btn');
                        if (btn) btn.click();
                    }
                } else if (this.isOnlineClient) {
                    if (input.isKeyJustPressed('KeyF') || input.isKeyJustPressed('KeyJ') || input.isKeyJustPressed('Space') || input.isKeyJustPressed('Enter')) {
                        const btn = document.getElementById('p2-ready-btn');
                        if (btn) btn.click();
                    }
                }
            }
            return;
        }

        // CLIENT IN ONLINE MODE:
        if (this.isOnlineClient) {
            if (this.state !== STATE_LOADOUT) {
                if (input && typeof input.isMouseActive === 'function' && input.isMouseActive()) {
                    if (input.mouse && typeof input.mouse.x === 'number' && this.p2) {
                        const dx = input.mouse.x - this.p2.x;
                        const dy = input.mouse.y - this.p2.y;
                        if (Math.hypot(dx, dy) > 10) {
                            this.p2.setAimAngle(Math.atan2(dy, dx));
                        }
                    }
                }
                this.sendClientInput();
            }
            return;
        }

        // HOST OR LOCAL:
        if (this.state === STATE_COUNTDOWN) {
            this.countdownTimer -= dt;
            if (this.countdownTimer > 60) {
                this.roundMessage = `ROUND ${this.round}`;
            } else if (this.countdownTimer > 0) {
                this.roundMessage = 'READY... FIGHT!';
            } else {
                this.state = STATE_FIGHT;
                this.roundMessage = '';
            }

            if (this.isOnlineHost) {
                this.broadcastStateSnapshot();
            }
        }

        if (this.state === STATE_FIGHT) {
            try {
                if (this.gameMode === 'LOCAL') {
                    this.processPlayerInputs(this.p1, 0, this.p2);
                    this.processPlayerInputs(this.p2, 1, this.p1);
                } else if (this.gameMode === 'BOT') {
                    this.processPlayerInputs(this.p1, 0, this.p2);
                    if (this.bot && typeof this.bot.update === 'function') {
                        this.bot.update(this.p2, this.p1, dt, this.bounds);
                    }
                } else if (this.isOnlineHost) {
                    this.processPlayerInputs(this.p1, 0, this.p2);
                    this.applyClientInputs(this.p2, this.clientInputBuffer || this.latestClientInputs, this.p1);
                }
            } catch (err) {
                console.error('[Fight Control Error]', err);
            }

            try {
                this.p1.update(dt, this.bounds);
                this.p2.update(dt, this.bounds);
            } catch (err) {
                console.error('[Cyborg Update Error]', err);
            }

            try {
                combat.updateProjectiles(dt, this.bounds, this.p1, this.p2);
                combat.resolve(this.p1, this.p2, (intensity, dur) => this.renderer.triggerShake(intensity, dur));
            } catch (err) {
                console.error('[Combat Resolve Error]', err);
            }

            // Decrement match timer
            this.matchTimer -= (dt / 60);

            // Check KO / Time-over
            if (this.p1.hp <= 0 || this.p2.hp <= 0 || this.matchTimer <= 0) {
                if (this.p1.hp <= 0 && !this.p1.isDead) this.p1.triggerDeath(this.p2.x, this.p2.y);
                if (this.p2.hp <= 0 && !this.p2.isDead) this.p2.triggerDeath(this.p1.x, this.p1.y);
                this.triggerRoundEnd();
            }

            if (this.isOnlineHost) {
                this.broadcastStateSnapshot();
            }
        }

        if (this.state === STATE_ROUND_OVER) {
            this.roundOverTimer -= dt;
            // Still update physics & particles during slow-mo
            this.p1.update(dt * 0.4, this.bounds);
            this.p2.update(dt * 0.4, this.bounds);
            combat.updateProjectiles(dt * 0.4, this.bounds, this.p1, this.p2);

            if (this.isOnlineHost) {
                this.broadcastStateSnapshot();
            }

            if (this.roundOverTimer <= 0) {
                this.resolveNextPhase();
            }
        }
    }

    processPlayerInputs(player, index, opponent) {
        if (!player) return;

        // 1. Movement
        const move = input.getMovementVector(index);
        if (move && (move.x !== 0 || move.y !== 0)) {
            player.thrust(move.x, move.y);
        }

        // 2b. Mouse & Touch Aiming for Player 1 (Only in BOT or ONLINE mode, NEVER in LOCAL 2-player mode)
        const isLocal2P = (this.gameMode === 'LOCAL');
        if (!isLocal2P && index === 0 && input && typeof input.isMouseActive === 'function' && input.isMouseActive()) {
            if (input.mouse && typeof input.mouse.x === 'number') {
                const dx = input.mouse.x - player.x;
                const dy = input.mouse.y - player.y;
                if (Math.hypot(dx, dy) > 10) {
                    player.setAimAngle(Math.atan2(dy, dx));
                }
            }
        } else if (index === 0 && opponent && input && input.touchEnabled && (!move || (move.x === 0 && move.y === 0))) {
            // When playing on mobile with touch controls and not actively steering, auto-aim towards opponent
            const dx = opponent.x - player.x;
            const dy = opponent.y - player.y;
            if (Math.hypot(dx, dy) > 10) {
                player.setAimAngle(Math.atan2(dy, dx));
            }
        }

        // 3. Attacks (Mouse Left Click or F for P1, Num1/J for P2, Touch Button for Mobile)
        const attack = input.getActionState(index, 'lightAttack');
        const touchAttackHeld = (index === 0 && input && input.touchEnabled && attack && attack.isDown);
        if (attack && (attack.justDown || touchAttackHeld)) {
            if (player.canAttack()) {
                player.attack();
                player.attackBufferTimer = 0;
            } else {
                player.attackBufferTimer = 12; // Buffer attack for 12 frames (~200ms)
            }
        }

        // 4. Shield / Parry (Mouse Right Click or H for P1, Num3/L for P2)
        const shield = input.getActionState(index, 'shield');
        if (shield && shield.isDown) {
            player.activateShield();
        } else {
            player.releaseShield();
        }

        // 5. Special Skill
        const skill = input.getActionState(index, 'skill');
        if (skill && skill.justDown) {
            player.activateSkill(opponent);
        }

        // 6. Dash (Dedicated Dash action from Mobile button or Shift/C key)
        const dash = input.getActionState(index, 'dash');
        if (dash && dash.justDown) {
            player.dash(move ? move.x : null, move ? move.y : null);
        }

        // 7. Ultimate Overdrive (Dedicated Space / Enter key, only activates with 100% overdrive)
        const ultimate = input.getActionState(index, 'ultimate');
        if (ultimate && ultimate.justDown) {
            player.activateUltimate();
        }
    }

    sendClientInput() {
        const p1Move = input.getMovementVector(0); // WASD / Touch Joystick on client machine
        const p2Move = input.getMovementVector(1); // Arrows on client machine
        const move = (p1Move.x !== 0 || p1Move.y !== 0) ? p1Move : p2Move;

        let aimAngle = null;
        if (input && typeof input.isMouseActive === 'function' && input.isMouseActive()) {
            if (input.mouse && typeof input.mouse.x === 'number' && this.p2) {
                const dx = input.mouse.x - this.p2.x;
                const dy = input.mouse.y - this.p2.y;
                if (Math.hypot(dx, dy) > 10) {
                    aimAngle = Math.atan2(dy, dx);
                }
            }
        } else if (input && input.touchEnabled && this.p1 && this.p2 && (!move || (move.x === 0 && move.y === 0))) {
            // Auto-aim towards opponent on mobile when idle/attacking
            const dx = this.p1.x - this.p2.x;
            const dy = this.p1.y - this.p2.y;
            if (Math.hypot(dx, dy) > 10) {
                aimAngle = Math.atan2(dy, dx);
            }
        }

        const p1Atk = input.getActionState(0, 'lightAttack');
        const p2Atk = input.getActionState(1, 'lightAttack');
        const attackJust = Boolean((p1Atk && p1Atk.justDown) || (p2Atk && p2Atk.justDown));
        const attackHeld = Boolean(input.touchEnabled && ((p1Atk && p1Atk.isDown) || (p2Atk && p2Atk.isDown)));
        const attack = attackJust || attackHeld;

        const p1Shield = input.getActionState(0, 'shield');
        const p2Shield = input.getActionState(1, 'shield');
        const shield = Boolean((p1Shield && p1Shield.isDown) || (p2Shield && p2Shield.isDown));

        const p1Skill = input.getActionState(0, 'skill');
        const p2Skill = input.getActionState(1, 'skill');
        const skill = Boolean((p1Skill && p1Skill.justDown) || (p2Skill && p2Skill.justDown));

        const p1Dash = input.getActionState(0, 'dash');
        const p2Dash = input.getActionState(1, 'dash');
        const dash = Boolean((p1Dash && p1Dash.justDown) || (p2Dash && p2Dash.justDown));

        const p1Ult = input.getActionState(0, 'ultimate');
        const p2Ult = input.getActionState(1, 'ultimate');
        const ultimate = Boolean((p1Ult && p1Ult.justDown) || (p2Ult && p2Ult.justDown));

        network.send({
            type: 'CLIENT_INPUT',
            move: move,
            aimAngle: aimAngle,
            dash: dash,
            ultimate: ultimate,
            attack: attack,
            shield: shield,
            skill: skill
        });
    }

    applyClientInputs(player, inputs, opponent) {
        if (!inputs || !player) return;

        // 1. Continuous Movement
        const mx = inputs.move ? inputs.move.x : 0;
        const my = inputs.move ? inputs.move.y : 0;
        if (mx !== 0 || my !== 0) {
            player.thrust(mx, my);
        }

        // 1b. Aim Angle from client
        if (inputs.aimAngle !== null && inputs.aimAngle !== undefined) {
            player.setAimAngle(inputs.aimAngle);
        }

        // 2. Shield / Parry (continuous state)
        if (inputs.shield) {
            player.activateShield();
        } else {
            player.releaseShield();
        }

        // 3. Attack (one-shot action: consume & reset)
        if (inputs.attack) {
            if (player.canAttack()) {
                player.attack();
                player.attackBufferTimer = 0;
            } else {
                player.attackBufferTimer = 12; // Buffer attack for 12 frames (~200ms)
            }
            inputs.attack = false;
        }

        // 4. Special Skill (one-shot action: consume & reset)
        if (inputs.skill) {
            player.activateSkill(opponent);
            inputs.skill = false;
        }

        // 5. Dash (one-shot action: consume & reset)
        if (inputs.dash) {
            const dmx = inputs.dashMove ? inputs.dashMove.x : mx;
            const dmy = inputs.dashMove ? inputs.dashMove.y : my;
            player.dash(dmx, dmy);
            inputs.dash = false;
            inputs.dashMove = null;
        }

        // 6. Ultimate (one-shot action: strictly ultimate, consume & reset)
        if (inputs.ultimate) {
            player.activateUltimate();
            inputs.ultimate = false;
        }
    }

    broadcastStateSnapshot() {
        network.send({
            type: 'GAME_SNAPSHOT',
            state: this.state,
            round: this.round,
            matchTimer: this.matchTimer,
            countdownTimer: this.countdownTimer,
            roundOverTimer: this.roundOverTimer,
            roundMessage: this.roundMessage,
            p1RoundsWon: this.p1.roundsWon,
            p2RoundsWon: this.p2.roundsWon,
            p1: this.packCyborg(this.p1),
            p2: this.packCyborg(this.p2),
            projectiles: combat.projectiles.map(p => ({
                ownerIndex: p.ownerIndex,
                x: p.x,
                y: p.y,
                vx: p.vx,
                vy: p.vy,
                damage: p.damage,
                color: p.color,
                radius: p.radius,
                isReflected: p.isReflected
            }))
        });
    }

    handleNetworkGameData(data) {
        if (!data) return;
        if (data.type === 'CLIENT_INPUT') {
            if (!this.clientInputBuffer) {
                this.clientInputBuffer = {
                    move: { x: 0, y: 0 },
                    aimAngle: null,
                    shield: false,
                    dash: false,
                    dashMove: null,
                    ultimate: false,
                    attack: false,
                    skill: false
                };
            }
            if (data.move) {
                this.clientInputBuffer.move = data.move;
            }
            if (data.aimAngle !== null && data.aimAngle !== undefined) {
                this.clientInputBuffer.aimAngle = data.aimAngle;
            }
            this.clientInputBuffer.shield = Boolean(data.shield);

            // One-shot edge actions: Latch to true so no intermediate/idle packets overwrite them!
            if (data.dash) {
                this.clientInputBuffer.dash = true;
                this.clientInputBuffer.dashMove = data.move ? { x: data.move.x, y: data.move.y } : null;
            }
            if (data.ultimate) {
                this.clientInputBuffer.ultimate = true;
            }
            if (data.attack) {
                this.clientInputBuffer.attack = true;
            }
            if (data.skill) {
                this.clientInputBuffer.skill = true;
            }
            this.latestClientInputs = this.clientInputBuffer;
        } else if (data.type === 'GAME_SNAPSHOT') {
            this.latestSnapshot = data;
            if (this.isOnlineClient) {
                this.applySnapshot(data);
            }
        }
    }

    packCyborg(c) {
        if (!c) return {};
        return {
            x: c.x,
            y: c.y,
            vx: c.vx,
            vy: c.vy,
            facingAngle: c.facingAngle,
            aimAngle: c.aimAngle,
            hp: c.hp,
            maxHp: c.maxHp,
            energy: c.energy,
            maxEnergy: c.maxEnergy,
            overdrive: c.overdrive,
            roundsWon: c.roundsWon,
            isAttacking: c.isAttacking,
            attackType: c.attackType,
            attackTimer: c.attackTimer,
            attackDuration: c.attackDuration,
            attackReach: c.attackReach,
            currentAttackDamage: c.currentAttackDamage,
            isShielding: c.isShielding,
            shieldTimer: c.shieldTimer,
            isStunned: c.isStunned,
            stunTimer: c.stunTimer,
            isBoosted: c.isBoosted,
            boostTimer: c.boostTimer,
            isUsingSkill: c.isUsingSkill,
            skillActionTimer: c.skillActionTimer,
            isUsingUltimate: c.isUsingUltimate,
            ultimateTimer: c.ultimateTimer,
            isShooting: c.isShooting,
            isDead: c.isDead,
            deathTimer: c.deathTimer,
            deathFallAngle: c.deathFallAngle
        };
    }

    unpackCyborg(c, data) {
        if (!c || !data) return;
        c.x = data.x;
        c.y = data.y;
        c.vx = data.vx;
        c.vy = data.vy;
        c.facingAngle = data.facingAngle;
        c.aimAngle = data.aimAngle;
        c.hp = data.hp;
        c.maxHp = data.maxHp;
        c.energy = data.energy;
        c.maxEnergy = data.maxEnergy;
        c.overdrive = data.overdrive;
        c.roundsWon = data.roundsWon;
        c.isAttacking = data.isAttacking;
        c.attackType = data.attackType;
        c.attackTimer = data.attackTimer;
        c.attackDuration = data.attackDuration;
        c.attackReach = data.attackReach;
        c.currentAttackDamage = data.currentAttackDamage;
        c.isShielding = data.isShielding;
        c.shieldTimer = data.shieldTimer;
        c.isStunned = data.isStunned;
        c.stunTimer = data.stunTimer;
        c.isBoosted = data.isBoosted;
        c.boostTimer = data.boostTimer;
        c.isUsingSkill = data.isUsingSkill;
        c.skillActionTimer = data.skillActionTimer;
        c.isUsingUltimate = data.isUsingUltimate;
        c.ultimateTimer = data.ultimateTimer;
        c.isShooting = data.isShooting;
        c.isDead = Boolean(data.isDead);
        c.deathTimer = data.deathTimer || 0;
        c.deathFallAngle = data.deathFallAngle || 0;
    }

    syncProjectiles(projData) {
        combat.projectiles = (projData || []).map(p => {
            const proj = new Projectile(
                p.ownerIndex,
                p.x,
                p.y,
                p.vx,
                p.vy,
                p.damage,
                p.color,
                p.radius
            );
            proj.isReflected = p.isReflected;
            return proj;
        });
    }

    applySnapshot(snap) {
        if (!snap) return;
        if (this.state === STATE_LOADOUT) {
            // Main menu/loadout active, ignore battle snapshots
            return;
        }

        const wasVictory = (this.state === STATE_VICTORY);
        const prevP1Hp = this.p1 ? this.p1.hp : 0;
        const prevP2Hp = this.p2 ? this.p2.hp : 0;
        const prevP1Ult = this.p1 ? this.p1.isUsingUltimate : false;
        const prevP2Ult = this.p2 ? this.p2.isUsingUltimate : false;
        const prevP1Boost = this.p1 ? this.p1.isBoosted : false;
        const prevP2Boost = this.p2 ? this.p2.isBoosted : false;
        const prevP1Dead = this.p1 ? this.p1.isDead : false;
        const prevP2Dead = this.p2 ? this.p2.isDead : false;

        this.state = snap.state;
        this.round = snap.round;
        this.matchTimer = snap.matchTimer;
        this.countdownTimer = snap.countdownTimer;
        this.roundOverTimer = snap.roundOverTimer;
        this.roundMessage = snap.roundMessage;

        this.unpackCyborg(this.p1, snap.p1);
        this.unpackCyborg(this.p2, snap.p2);
        this.syncProjectiles(snap.projectiles);

        if (this.p1) this.p1.roundsWon = snap.p1RoundsWon;
        if (this.p2) this.p2.roundsWon = snap.p2RoundsWon;

        // Sound & Visual FX synchronization for Online Client:
        if (this.isOnlineClient) {
            // 1. Dash effect sync
            if (this.p2 && this.p2.isBoosted && !prevP2Boost) {
                sound.playWallBounce();
                fx.spawnThrusterFlame(this.p2.x, this.p2.y, this.p2.aimAngle, '#ffffff');
                fx.addText(this.p2.x, this.p2.y - 30, '💨 DASH!', this.p2.color, 20);
            }
            if (this.p1 && this.p1.isBoosted && !prevP1Boost) {
                sound.playWallBounce();
                fx.spawnThrusterFlame(this.p1.x, this.p1.y, this.p1.aimAngle, '#ffffff');
                fx.addText(this.p1.x, this.p1.y - 30, '💨 DASH!', this.p1.color, 20);
            }

            // 2. Ultimate effect sync
            if (this.p2 && this.p2.isUsingUltimate && !prevP2Ult) {
                sound.playUltimate();
                fx.spawnClashShockwave(this.p2.x, this.p2.y);
                const shout = this.getUltimateShout(this.p2.characterId);
                fx.addText(this.p2.x, this.p2.y - 45, shout, this.p2.color, 28, 60);
                this.renderer.triggerShake(15, 25);
            }
            if (this.p1 && this.p1.isUsingUltimate && !prevP1Ult) {
                sound.playUltimate();
                fx.spawnClashShockwave(this.p1.x, this.p1.y);
                const shout = this.getUltimateShout(this.p1.characterId);
                fx.addText(this.p1.x, this.p1.y - 45, shout, this.p1.color, 28, 60);
                this.renderer.triggerShake(15, 25);
            }

            // 3. Damage hit feedback
            if (this.p2 && prevP2Hp > 0 && this.p2.hp < prevP2Hp) {
                sound.playHit(prevP2Hp - this.p2.hp > 15);
                fx.spawnHitSparks(this.p2.x, this.p2.y, '#ffffff', 8);
                this.renderer.triggerShake(5, 8);
            }
            if (this.p1 && prevP1Hp > 0 && this.p1.hp < prevP1Hp) {
                sound.playHit(prevP1Hp - this.p1.hp > 15);
                fx.spawnHitSparks(this.p1.x, this.p1.y, '#ffffff', 8);
                this.renderer.triggerShake(5, 8);
            }

            // 4. Death trigger sync
            if (this.p1 && this.p1.isDead && !prevP1Dead) {
                this.p1.triggerDeath(this.p2 ? this.p2.x : null, this.p2 ? this.p2.y : null);
            }
            if (this.p2 && this.p2.isDead && !prevP2Dead) {
                this.p2.triggerDeath(this.p1 ? this.p1.x : null, this.p1 ? this.p1.y : null);
            }
        }

        // Only trigger victory overlay when transitioning into VICTORY, not every frame
        if (this.state === STATE_VICTORY && !wasVictory) {
            const winner = this.p1.roundsWon >= 2 ? this.p1 : this.p2;
            this.ui.showVictory(winner.name, winner.color);
            this.updateTouchControlsVisibility();
        }
    }

    getUltimateShout(charId) {
        const ultShouts = {
            yanagi: '⚡ LIGHTNING CANNON! ⚡',
            velina: '🌪️ LIFE BLOSSOM STORM! 🌪️',
            nicole: '🕳️ GRAVITATIONAL BLACK HOLE! 🕳️',
            trigger: '🎯 SYNCHRONIZED FIREPOWER! 🎯',
            vivian: '🔮 FEATHER STORM HARBINGER! 🔮',
            jotaro: '⏳ THE WORLD: ORA ORA ORA! ⏳',
            goku: '💥 SUPER KAMEHAMEHA! 💥',
            giorno: '♾️ RETURN TO ZERO! ♾️',
            naoya: '⚡ PROJECTION: MACH 3 BARRAGE! ⚡',
            luffy: '🍖 GOMU GOMU NO BAJRANG GUN! 🍖',
            gojo: '🌌 DOMAIN EXPANSION: UNLIMITED VOID! 🌌',
            sukuna: '⛩️ DOMAIN EXPANSION: MALEVOLENT SHRINE! ⛩️'
        };
        return ultShouts[charId] || '🔥 OVERDRIVE ULTIMATE! 🔥';
    }

    triggerRoundEnd() {
        this.state = STATE_ROUND_OVER;
        this.roundOverTimer = 190; // ~3.2s slow-mo end banner with death animation
        this.renderer.triggerShake(20, 32);
        this.renderer.triggerFlash('#ffffff', 0.9);

        // Trigger death animation on defeated fighter
        if (this.p1.hp <= 0 && !this.p1.isDead) {
            this.p1.triggerDeath(this.p2.x, this.p2.y);
        }
        if (this.p2.hp <= 0 && !this.p2.isDead) {
            this.p2.triggerDeath(this.p1.x, this.p1.y);
        }

        let winner = null;
        if (this.p1.hp > this.p2.hp) {
            winner = this.p1;
            this.p1.roundsWon++;
            this.roundMessage = 'PLAYER 1 WINS ROUND!';
            if (!this.p2.isDead) this.p2.triggerDeath(this.p1.x, this.p1.y);
        } else if (this.p2.hp > this.p1.hp) {
            winner = this.p2;
            this.p2.roundsWon++;
            this.roundMessage = 'PLAYER 2 WINS ROUND!';
            if (!this.p1.isDead) this.p1.triggerDeath(this.p2.x, this.p2.y);
        } else {
            this.roundMessage = 'DRAW ROUND!';
        }
        this.updateTouchControlsVisibility();
    }

    resolveNextPhase() {
        // Check Match Victory (Best of 3 -> first to 2 rounds)
        if (this.p1.roundsWon >= 2) {
            this.state = STATE_VICTORY;
            this.ui.showVictory(this.p1.name, this.p1.color);
            this.updateTouchControlsVisibility();
            if (this.isOnlineHost) {
                this.broadcastStateSnapshot();
            }
        } else if (this.p2.roundsWon >= 2) {
            this.state = STATE_VICTORY;
            this.ui.showVictory(this.p2.name, this.p2.color);
            this.updateTouchControlsVisibility();
            if (this.isOnlineHost) {
                this.broadcastStateSnapshot();
            }
        } else {
            // Next round
            this.round++;
            this.startRound();
        }
    }

    render() {
        this.renderer.drawArena(this.bounds);

        if (this.state !== STATE_LOADOUT) {
            combat.drawProjectiles(this.ctx);

            this.renderer.drawCyborg(this.p1);
            this.renderer.drawCyborg(this.p2);

            fx.draw(this.ctx);

            this.renderer.drawHUD(this.p1, this.p2, this.matchTimer, this.roundMessage);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.game = new CyberClashGame();
});
