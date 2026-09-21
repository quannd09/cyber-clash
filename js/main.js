// Main Game Controller & 60 FPS RequestAnimationFrame Loop
import { sound } from './audio.js?v=53';
import { input } from './input.js?v=53';
import { fx } from './particles.js?v=53';
import { combat, Projectile } from './combat.js?v=53';
import { Cyborg } from './cyborg.js?v=53';
import { GameRenderer } from './renderer.js?v=53';
import { UIManager } from './ui.js?v=53';
import { network } from './network.js?v=53';
import { BotController } from './bot.js?v=53';

const STATE_LOADOUT = 'LOADOUT';
const STATE_COUNTDOWN = 'COUNTDOWN';
const STATE_FIGHT = 'FIGHT';
const STATE_ROUND_OVER = 'ROUND_OVER';
const STATE_VICTORY = 'VICTORY';

class CyberClashGame {
    constructor() {
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

    startMatch(p1Char, p2Char) {
        const charNames = {
            yanagi: 'TSUKISHIRO YANAGI',
            velina: 'VERINA AIRGID',
            nicole: 'NICOLE DEMARA',
            trigger: 'TRIGGER',
            vivian: 'VIVIAN BANSHEE',
            jotaro: 'JOTARO KUJO',
            goku: 'SON GOKU',
            giorno: 'GIORNO GIOVANNA'
        };
        const charColors = {
            yanagi: '#a78bfa',
            velina: '#34d399',
            nicole: '#f472b6',
            trigger: '#38bdf8',
            vivian: '#c084fc',
            jotaro: '#818cf8',
            goku: '#fbbf24',
            giorno: '#facc15'
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
        this.latestSnapshot = null;
        this.ui.showLoadout();
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
            if (this.latestSnapshot) {
                this.applySnapshot(this.latestSnapshot);
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
                    this.applyClientInputs(this.p2, this.latestClientInputs, this.p1);
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
                combat.updateProjectiles(dt, this.bounds);
                combat.resolve(this.p1, this.p2, (intensity, dur) => this.renderer.triggerShake(intensity, dur));
            } catch (err) {
                console.error('[Combat Resolve Error]', err);
            }

            // Decrement match timer
            this.matchTimer -= (dt / 60);

            // Check KO / Time-over
            if (this.p1.hp <= 0 || this.p2.hp <= 0 || this.matchTimer <= 0) {
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
            combat.updateProjectiles(dt * 0.4, this.bounds);

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

        // 2. Strafe Lock
        const strafe = input.getActionState(index, 'strafe');
        player.setStrafing(strafe ? strafe.isDown : false);

        // 2b. Mouse Aiming for Player 1 (Only in BOT or ONLINE mode, NEVER in LOCAL 2-player mode)
        const isLocal2P = (this.gameMode === 'LOCAL');
        if (!isLocal2P && index === 0 && input && typeof input.isMouseActive === 'function' && input.isMouseActive()) {
            if (input.mouse && typeof input.mouse.x === 'number') {
                const dx = input.mouse.x - player.x;
                const dy = input.mouse.y - player.y;
                if (Math.hypot(dx, dy) > 10) {
                    player.setAimAngle(Math.atan2(dy, dx));
                }
            }
        }

        // 3. Attacks (Mouse Left Click or F for P1, Num1/J for P2)
        const attack = input.getActionState(index, 'lightAttack');
        if (attack && attack.justDown) {
            player.attack();
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

        // 6. Ultimate or Boost Dash
        const ultimate = input.getActionState(index, 'ultimate');
        if (ultimate && ultimate.justDown) {
            player.activateUltimateOrDash();
        }
    }

    sendClientInput() {
        const p2Move = input.getMovementVector(0); // WASD on client machine
        const p2AltMove = input.getMovementVector(1); // Arrows on client machine
        const move = (p2Move.x !== 0 || p2Move.y !== 0) ? p2Move : p2AltMove;

        let aimAngle = null;
        if (input && typeof input.isMouseActive === 'function' && input.isMouseActive()) {
            if (input.mouse && typeof input.mouse.x === 'number' && this.p2) {
                const dx = input.mouse.x - this.p2.x;
                const dy = input.mouse.y - this.p2.y;
                if (Math.hypot(dx, dy) > 10) {
                    aimAngle = Math.atan2(dy, dx);
                }
            }
        }

        network.send({
            type: 'CLIENT_INPUT',
            move: move,
            aimAngle: aimAngle,
            strafe: input.getActionState(0, 'strafe').isDown || input.getActionState(1, 'strafe').isDown,
            attack: input.getActionState(0, 'lightAttack').justDown || input.getActionState(1, 'lightAttack').justDown,
            shield: input.getActionState(0, 'shield').isDown || input.getActionState(1, 'shield').isDown,
            skill: input.getActionState(0, 'skill').justDown || input.getActionState(1, 'skill').justDown,
            ultimate: input.getActionState(0, 'ultimate').justDown || input.getActionState(1, 'ultimate').justDown
        });
    }

    applyClientInputs(player, inputs, opponent) {
        if (!inputs) return;

        // 1. Movement
        const mx = inputs.move ? inputs.move.x : 0;
        const my = inputs.move ? inputs.move.y : 0;
        if (mx !== 0 || my !== 0) {
            player.thrust(mx, my);
        }

        // 1b. Mouse Aim Angle from client
        if (inputs.aimAngle !== null && inputs.aimAngle !== undefined) {
            player.setAimAngle(inputs.aimAngle);
        }

        // 2. Strafe Lock
        if (inputs.strafe !== undefined) {
            player.setStrafing(inputs.strafe);
        }

        // 3. Attack (one-shot action)
        if (inputs.attack) {
            player.attack();
            inputs.attack = false;
        }

        // 4. Shield
        if (inputs.shield) {
            player.activateShield();
        } else {
            player.releaseShield();
        }

        // 5. Special Skill (one-shot action)
        if (inputs.skill) {
            player.activateSkill(opponent);
            inputs.skill = false;
        }

        // 6. Ultimate (one-shot action)
        if (inputs.ultimate) {
            player.activateUltimateOrDash();
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
            this.latestClientInputs = data;
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
            isStrafing: c.isStrafing
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
        c.isStrafing = data.isStrafing;
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

        if (this.state === STATE_VICTORY) {
            const winner = this.p1.roundsWon >= 2 ? this.p1 : this.p2;
            this.ui.showVictory(winner.name, winner.color);
        }
    }

    triggerRoundEnd() {
        this.state = STATE_ROUND_OVER;
        this.roundOverTimer = 160; // ~2.7s slow-mo end banner
        this.renderer.triggerShake(18, 28);
        this.renderer.triggerFlash('#ffffff', 0.85);
        sound.playKO();

        let winner = null;
        if (this.p1.hp > this.p2.hp) {
            winner = this.p1;
            this.p1.roundsWon++;
            this.roundMessage = 'PLAYER 1 WINS ROUND!';
        } else if (this.p2.hp > this.p1.hp) {
            winner = this.p2;
            this.p2.roundsWon++;
            this.roundMessage = 'PLAYER 2 WINS ROUND!';
        } else {
            this.roundMessage = 'DRAW ROUND!';
        }
    }

    resolveNextPhase() {
                // Check Match Victory (Best of 3 -> first to 2 rounds)
        if (this.p1.roundsWon >= 2) {
            this.state = STATE_VICTORY;
            this.ui.showVictory(this.p1.name, this.p1.color);
        } else if (this.p2.roundsWon >= 2) {
            this.state = STATE_VICTORY;
            this.ui.showVictory(this.p2.name, this.p2.color);
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
