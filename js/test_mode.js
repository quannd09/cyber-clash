// Cyber Clash: Zero-G Arena - Bot vs Bot Spectator & Balance Test Engine
import { sound } from './audio.js?v=75';
import { fx } from './particles.js?v=75';
import { combat } from './combat.js?v=75';
import { Cyborg } from './cyborg.js?v=75';
import { GameRenderer } from './renderer.js?v=75';
import { BotController } from './bot.js?v=75';

export const CHAR_DATA = {
    yanagi: { name: 'Tsukishiro Yanagi', style: 'Cận chiến', color: '#a78bfa', avatar: 'assets/yanagi/avatar.png' },
    velina: { name: 'Verina Airgid', style: 'Tầm xa', color: '#34d399', avatar: 'assets/velina/avatar.png' },
    nicole: { name: 'Nicole Demara', style: 'Tầm xa', color: '#f472b6', avatar: 'assets/nicole/avatar.png' },
    trigger: { name: 'Trigger', style: 'Tầm xa', color: '#38bdf8', avatar: 'assets/trigger/avatar.png' },
    vivian: { name: 'Vivian Banshee', style: 'Tầm xa', color: '#c084fc', avatar: 'assets/vivian/avatar.png' },
    jotaro: { name: 'Jotaro Kujo', style: 'Cận chiến', color: '#818cf8', avatar: 'assets/jotaro/avatar.png' },
    goku: { name: 'Son Goku', style: 'Cận chiến', color: '#fbbf24', avatar: 'assets/goku/avatar.png' },
    giorno: { name: 'Giorno Giovanna', style: 'Cận chiến', color: '#facc15', avatar: 'assets/giorno/avatar.png' },
    naoya: { name: "Naoya Zen'in", style: 'Cận chiến', color: '#a3e635', avatar: 'assets/naoya/avatar.png' },
    luffy: { name: 'Monkey D. Luffy', style: 'Cận chiến', color: '#ef4444', avatar: 'assets/luffy/avatar.png' },
    gojo: { name: 'Satoru Gojo', style: 'Cận chiến', color: '#0284c7', avatar: 'assets/gojo/avatar.png' },
    sukuna: { name: 'Ryomen Sukuna', style: 'Cận chiến', color: '#f43f5e', avatar: 'assets/sukuna/avatar.png' }
};

export const TOURNAMENT_PAIRINGS = {
    'goku-sukuna': [5, 5],
    'goku-gojo': [5, 5],
    'goku-yanagi': [5, 5],
    'goku-jotaro': [6, 4],
    'goku-luffy': [5, 5],
    'goku-naoya': [6, 4],
    'goku-giorno': [5, 5],
    'goku-velina': [6, 4],
    'goku-vivian': [5, 5],
    'goku-trigger': [6, 4],
    'goku-nicole': [5, 5],

    'sukuna-gojo': [5, 5],
    'sukuna-yanagi': [6, 4],
    'sukuna-jotaro': [5, 5],
    'sukuna-luffy': [6, 4],
    'sukuna-naoya': [5, 5],
    'sukuna-giorno': [6, 4],
    'sukuna-velina': [5, 5],
    'sukuna-vivian': [5, 5],
    'sukuna-trigger': [4, 6],
    'sukuna-nicole': [6, 4],

    'gojo-yanagi': [5, 5],
    'gojo-jotaro': [5, 5],
    'gojo-luffy': [6, 4],
    'gojo-naoya': [4, 6],
    'gojo-giorno': [5, 5],
    'gojo-velina': [6, 4],
    'gojo-vivian': [6, 4],
    'gojo-trigger': [6, 4],
    'gojo-nicole': [5, 5],

    'naoya-yanagi': [5, 5],
    'naoya-jotaro': [5, 5],
    'naoya-luffy': [4, 6],
    'naoya-giorno': [5, 5],
    'naoya-velina': [6, 4],
    'naoya-vivian': [5, 5],
    'naoya-trigger': [6, 4],
    'naoya-nicole': [5, 5],

    'luffy-yanagi': [5, 5],
    'luffy-jotaro': [5, 5],
    'luffy-giorno': [5, 5],
    'luffy-velina': [4, 6],
    'luffy-vivian': [6, 4],
    'luffy-trigger': [5, 5],
    'luffy-nicole': [5, 5],

    'jotaro-yanagi': [5, 5],
    'jotaro-giorno': [5, 5],
    'jotaro-velina': [5, 5],
    'jotaro-vivian': [5, 5],
    'jotaro-trigger': [5, 5],
    'jotaro-nicole': [6, 4],

    'giorno-yanagi': [5, 5],
    'giorno-velina': [5, 5],
    'giorno-vivian': [5, 5],
    'giorno-trigger': [6, 4],
    'giorno-nicole': [5, 5],

    'yanagi-velina': [5, 5],
    'yanagi-vivian': [5, 5],
    'yanagi-trigger': [5, 5],
    'yanagi-nicole': [6, 4],

    'velina-vivian': [5, 5],
    'velina-trigger': [5, 5],
    'velina-nicole': [5, 5],

    'vivian-trigger': [5, 5],
    'vivian-nicole': [5, 5],

    'trigger-nicole': [5, 5]
};

export function getPairingScore(c1, c2) {
    if (c1 === c2) return null;
    if (TOURNAMENT_PAIRINGS[`${c1}-${c2}`]) {
        return TOURNAMENT_PAIRINGS[`${c1}-${c2}`];
    }
    if (TOURNAMENT_PAIRINGS[`${c2}-${c1}`]) {
        const [w2, w1] = TOURNAMENT_PAIRINGS[`${c2}-${c1}`];
        return [w1, w2];
    }
    return [5, 5];
}

const STATE_IDLE = 'IDLE';
const STATE_COUNTDOWN = 'COUNTDOWN';
const STATE_FIGHT = 'FIGHT';
const STATE_ROUND_OVER = 'ROUND_OVER';
const STATE_VICTORY = 'VICTORY';

export class SpectatorGameController {
    constructor() {
        window.game = this;
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.renderer = new GameRenderer(this.canvas, this.ctx);

        this.bounds = {
            minX: 70,
            maxX: 1210,
            minY: 90,
            maxY: 690
        };

        // Matchup settings
        this.bot1Char = 'goku';
        this.bot1Diff = 'normal';
        this.bot2Char = 'sukuna';
        this.bot2Diff = 'normal';

        this.bot1 = new BotController(this.bot1Diff);
        this.bot2 = new BotController(this.bot2Diff);

        this.p1 = null;
        this.p2 = null;

        // Mode & Simulation states
        this.mode = 'MANUAL'; // 'MANUAL' | 'AUTO'
        this.state = STATE_IDLE;
        this.simSpeed = 1; // 1x, 2x, 4x, 8x
        this.isPaused = false;

        this.round = 1;
        this.matchTimer = 90;
        this.countdownTimer = 0;
        this.roundOverTimer = 0;
        this.roundMessage = '';
        this.currentMatchDuration = 0;

        // Statistics Accumulator
        this.currentMatchIndex = 1;
        this.targetMatches = 10;
        this.stats = {
            bot1Wins: 0,
            bot2Wins: 0,
            draws: 0,
            bot1TotalDmg: 0,
            bot2TotalDmg: 0,
            bot1RoundsWon: 0,
            bot2RoundsWon: 0,
            matchDurations: [],
            matchHistory: []
        };

        this.prevP1Hp = 0;
        this.prevP2Hp = 0;

        this.initCanvasResize();
        this.initEventListeners();
        this.initLoop();
        this.startMatch(this.bot1Char, this.bot2Char);
    }

    initCanvasResize() {
        const resize = () => {
            const container = document.getElementById('game-container');
            if (!container) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            this.canvas.width = 1280;
            this.canvas.height = 720;
            const scaleX = w / 1280;
            const scaleY = h / 720;
            const scale = Math.min(scaleX, scaleY);
            this.canvas.style.width = `${Math.floor(1280 * scale)}px`;
            this.canvas.style.height = `${Math.floor(720 * scale)}px`;
        };
        window.addEventListener('resize', resize);
        window.addEventListener('orientationchange', resize);
        setTimeout(resize, 100);
    }

    initEventListeners() {
        // Tab switching
        const tabManual = document.getElementById('tab-manual');
        const tabAuto = document.getElementById('tab-auto');
        const manualControls = document.getElementById('manual-controls');
        const autoControls = document.getElementById('auto-controls');

        if (tabManual && tabAuto) {
            tabManual.addEventListener('click', () => {
                tabManual.classList.add('active');
                tabAuto.classList.remove('active');
                manualControls.classList.remove('hidden');
                autoControls.classList.add('hidden');
                this.setMode('MANUAL');
            });
            tabAuto.addEventListener('click', () => {
                tabAuto.classList.add('active');
                tabManual.classList.remove('active');
                autoControls.classList.remove('hidden');
                manualControls.classList.add('hidden');
                this.setMode('AUTO');
            });
        }

        // Matchup Selectors
        const selP1 = document.getElementById('select-p1-char');
        const selP1Diff = document.getElementById('select-p1-diff');
        const selP2 = document.getElementById('select-p2-char');
        const selP2Diff = document.getElementById('select-p2-diff');

        const onMatchupChange = () => {
            if (selP1) this.bot1Char = selP1.value;
            if (selP1Diff) {
                this.bot1Diff = selP1Diff.value;
                this.bot1.setDifficulty(this.bot1Diff);
            }
            if (selP2) this.bot2Char = selP2.value;
            if (selP2Diff) {
                this.bot2Diff = selP2Diff.value;
                this.bot2.setDifficulty(this.bot2Diff);
            }
            this.updateMatchupCards();
            this.resetStats();
            this.startMatch(this.bot1Char, this.bot2Char);
        };

        if (selP1) selP1.addEventListener('change', onMatchupChange);
        if (selP1Diff) selP1Diff.addEventListener('change', onMatchupChange);
        if (selP2) selP2.addEventListener('change', onMatchupChange);
        if (selP2Diff) selP2Diff.addEventListener('change', onMatchupChange);

        // Manual mode buttons
        const btnManualStart = document.getElementById('btn-manual-start');
        const btnManualPause = document.getElementById('btn-manual-pause');
        const btnManualReset = document.getElementById('btn-manual-reset');

        if (btnManualStart) {
            btnManualStart.addEventListener('click', () => {
                this.isPaused = false;
                this.startMatch(this.bot1Char, this.bot2Char);
            });
        }
        if (btnManualPause) {
            btnManualPause.addEventListener('click', () => {
                this.togglePause();
                btnManualPause.textContent = this.isPaused ? '▶ Tiếp Tục' : '⏸ Tạm Dừng';
            });
        }
        if (btnManualReset) {
            btnManualReset.addEventListener('click', () => {
                this.resetStats();
                this.startMatch(this.bot1Char, this.bot2Char);
            });
        }

        // Auto mode buttons & speed controls
        const btnAutoStart = document.getElementById('btn-auto-start');
        const btnAutoStop = document.getElementById('btn-auto-stop');
        const speedBtns = document.querySelectorAll('.btn-speed');

        speedBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                speedBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const spd = parseInt(btn.getAttribute('data-speed'), 10) || 1;
                this.setSimulationSpeed(spd);
            });
        });

        if (btnAutoStart) {
            btnAutoStart.addEventListener('click', () => {
                this.startAutoSeries(10);
            });
        }
        if (btnAutoStop) {
            btnAutoStop.addEventListener('click', () => {
                this.stopAutoSeries();
            });
        }

        // Reset stats button in report modal
        const btnCloseModal = document.getElementById('btn-close-modal');
        const btnRerunSeries = document.getElementById('btn-rerun-series');
        if (btnCloseModal) {
            btnCloseModal.addEventListener('click', () => {
                document.getElementById('report-modal').classList.add('hidden');
            });
        }
        if (btnRerunSeries) {
            btnRerunSeries.addEventListener('click', () => {
                document.getElementById('report-modal').classList.add('hidden');
                this.startAutoSeries(10);
            });
        }

        // Tournament Matrix Modal Controls
        const btnOpenTourney = document.getElementById('btn-open-tournament');
        const modalTourney = document.getElementById('tournament-modal');
        const btnCloseTourney = document.getElementById('btn-close-tournament');
        const btnCloseTourneyBottom = document.getElementById('btn-close-tournament-bottom');

        if (btnOpenTourney && modalTourney) {
            btnOpenTourney.addEventListener('click', () => {
                this.renderTournamentMatrix();
                modalTourney.classList.remove('hidden');
            });
        }
        if (btnCloseTourney && modalTourney) {
            btnCloseTourney.addEventListener('click', () => {
                modalTourney.classList.add('hidden');
            });
        }
        if (btnCloseTourneyBottom && modalTourney) {
            btnCloseTourneyBottom.addEventListener('click', () => {
                modalTourney.classList.add('hidden');
            });
        }
    }

    renderTournamentMatrix() {
        const container = document.getElementById('tournament-matrix-view');
        if (!container) return;

        const charKeys = Object.keys(CHAR_DATA);
        let html = '<table class="matrix-table">';
        html += '<thead><tr><th>Tướng</th>';
        charKeys.forEach(k => {
            const c = CHAR_DATA[k];
            const shortName = c.name.split(' ')[0];
            html += `<th class="char-header" style="color: ${c.color}" title="${c.name}">${shortName}</th>`;
        });
        html += '<th>Tổng Kèo (110T)</th><th>Tỉ Lệ Thắng</th></tr></thead><tbody>';

        charKeys.forEach(rKey => {
            const rChar = CHAR_DATA[rKey];
            html += `<tr><th class="char-header" style="text-align: left; padding: 5px 8px; color: ${rChar.color};" title="${rChar.name}">${rChar.name}</th>`;
            let totalWins = 0;
            let totalMatches = 0;

            charKeys.forEach(cKey => {
                if (rKey === cKey) {
                    html += '<td class="matrix-cell cell-self">-</td>';
                } else {
                    const score = getPairingScore(rKey, cKey);
                    const w1 = score[0];
                    const w2 = score[1];
                    totalWins += w1;
                    totalMatches += 10;
                    const cellClass = (w1 === 5) ? 'cell-draw' : 'cell-balanced';
                    html += `<td class="matrix-cell ${cellClass}" data-p1="${rKey}" data-p2="${cKey}" title="Nhấp để tải trận: ${rChar.name} (${w1}) vs ${CHAR_DATA[cKey].name} (${w2})">${w1}-${w2}</td>`;
                }
            });

            const winRate = Math.round((totalWins / totalMatches) * 100);
            html += `<td style="font-family: 'Orbitron', sans-serif; font-weight: 700; color: #f8fafc;">${totalWins} / ${totalMatches}</td>`;
            html += `<td style="font-family: 'Orbitron', sans-serif; font-weight: 900; color: #00f0ff;">${winRate}%</td>`;
            html += '</tr>';
        });

        html += '</tbody></table>';
        container.innerHTML = html;

        // Click any matchup cell to immediately load that matchup into the Testbench!
        container.querySelectorAll('.matrix-cell[data-p1]').forEach(cell => {
            cell.addEventListener('click', () => {
                const p1 = cell.getAttribute('data-p1');
                const p2 = cell.getAttribute('data-p2');
                const selP1 = document.getElementById('select-p1-char');
                const selP2 = document.getElementById('select-p2-char');
                if (selP1) selP1.value = p1;
                if (selP2) selP2.value = p2;

                this.bot1Char = p1;
                this.bot2Char = p2;
                this.resetStats();
                this.startMatch(p1, p2);

                const modal = document.getElementById('tournament-modal');
                if (modal) modal.classList.add('hidden');
            });
        });
    }

    setMode(newMode) {
        this.mode = newMode;
        if (newMode === 'MANUAL') {
            this.setSimulationSpeed(1);
            const speedBtns = document.querySelectorAll('.btn-speed');
            speedBtns.forEach(b => {
                b.classList.toggle('active', b.getAttribute('data-speed') === '1');
            });
        } else {
            this.setSimulationSpeed(4);
            const speedBtns = document.querySelectorAll('.btn-speed');
            speedBtns.forEach(b => {
                b.classList.toggle('active', b.getAttribute('data-speed') === '4');
            });
        }
    }

    setSimulationSpeed(speed) {
        this.simSpeed = speed;
        const badge = document.getElementById('speed-badge');
        if (badge) {
            badge.textContent = `${this.simSpeed}x TỐC ĐỘ`;
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
    }

    updateMatchupCards() {
        const d1 = CHAR_DATA[this.bot1Char] || CHAR_DATA.yanagi;
        const d2 = CHAR_DATA[this.bot2Char] || CHAR_DATA.velina;

        const cardP1 = document.getElementById('matchup-p1-avatar');
        const cardP2 = document.getElementById('matchup-p2-avatar');
        const nameP1 = document.getElementById('matchup-p1-name');
        const nameP2 = document.getElementById('matchup-p2-name');

        if (cardP1) cardP1.src = d1.avatar;
        if (cardP2) cardP2.src = d2.avatar;
        if (nameP1) {
            nameP1.textContent = d1.name;
            nameP1.style.color = d1.color;
        }
        if (nameP2) {
            nameP2.textContent = d2.name;
            nameP2.style.color = d2.color;
        }
    }

    resetStats() {
        this.stats = {
            bot1Wins: 0,
            bot2Wins: 0,
            draws: 0,
            bot1TotalDmg: 0,
            bot2TotalDmg: 0,
            bot1RoundsWon: 0,
            bot2RoundsWon: 0,
            matchDurations: [],
            matchHistory: []
        };
        this.currentMatchIndex = 1;
        this.updateStatsUI();
    }

    startAutoSeries(totalMatches = 10) {
        this.targetMatches = totalMatches;
        this.currentMatchIndex = 1;
        this.resetStats();
        this.mode = 'AUTO';
        this.isPaused = false;
        if (this.simSpeed === 1) {
            this.setSimulationSpeed(4);
            const speedBtns = document.querySelectorAll('.btn-speed');
            speedBtns.forEach(b => {
                b.classList.toggle('active', b.getAttribute('data-speed') === '4');
            });
        }
        document.getElementById('report-modal').classList.add('hidden');
        this.startMatch(this.bot1Char, this.bot2Char);
    }

    stopAutoSeries() {
        this.mode = 'MANUAL';
        this.setSimulationSpeed(1);
        this.openReportModal();
    }

    startMatch(p1Char, p2Char) {
        const d1 = CHAR_DATA[p1Char] || CHAR_DATA.yanagi;
        const d2 = CHAR_DATA[p2Char] || CHAR_DATA.velina;

        this.p1 = new Cyborg(0, 240, 390, d1.color, `[BOT 1] ${d1.name}`, p1Char);
        this.p2 = new Cyborg(1, 1040, 390, d2.color, `[BOT 2] ${d2.name}`, p2Char);

        this.prevP1Hp = this.p1.maxHp;
        this.prevP2Hp = this.p2.maxHp;

        this.round = 1;
        this.p1.roundsWon = 0;
        this.p2.roundsWon = 0;
        this.currentMatchDuration = 0;

        this.updateMatchupCards();
        this.startRound();
    }

    startRound() {
        this.state = STATE_COUNTDOWN;
        this.countdownTimer = (this.simSpeed >= 4) ? 30 : 90; // Rút ngắn đếm lùi khi tua nhanh
        this.matchTimer = 90;
        this.roundMessage = `ROUND ${this.round}`;

        this.p1.reset(240, 390, 0);
        this.p2.reset(1040, 390, Math.PI);
        this.prevP1Hp = this.p1.hp;
        this.prevP2Hp = this.p2.hp;

        combat.reset();
        fx.clear();
        if (this.simSpeed === 1) sound.playRoundStart();
    }

    initLoop() {
        this.lastTime = performance.now();
        const loop = (now) => {
            requestAnimationFrame(loop);
            const dtMs = now - this.lastTime;
            this.lastTime = now;
            const dt = Math.max(0.2, Math.min(2.0, (dtMs / (1000 / 60)) || 1.0));

            if (!this.isPaused) {
                // Multi-tick execution for fast-forward simulation speed (1x, 2x, 4x, 8x)
                const ticks = this.simSpeed;
                for (let i = 0; i < ticks; i++) {
                    this.stepSimulation(dt);
                }
            }

            this.render();
        };
        requestAnimationFrame(loop);
    }

    stepSimulation(dt) {
        if (!this.p1 || !this.p2) return;

        this.renderer.update(dt);
        fx.update(dt);

        // 1. COUNTDOWN
        if (this.state === STATE_COUNTDOWN) {
            this.countdownTimer -= dt;
            if (this.countdownTimer > 40) {
                this.roundMessage = `ROUND ${this.round}`;
            } else if (this.countdownTimer > 0) {
                this.roundMessage = 'FIGHT!';
            } else {
                this.state = STATE_FIGHT;
                this.roundMessage = '';
            }
            return;
        }

        // 2. FIGHT
        if (this.state === STATE_FIGHT) {
            this.currentMatchDuration += (dt / 60);
            this.matchTimer -= (dt / 60);

            // Record damage exchange for balance statistics
            const p1DmgTaken = Math.max(0, this.prevP1Hp - this.p1.hp);
            const p2DmgTaken = Math.max(0, this.prevP2Hp - this.p2.hp);
            this.stats.bot2TotalDmg += p1DmgTaken;
            this.stats.bot1TotalDmg += p2DmgTaken;
            this.prevP1Hp = this.p1.hp;
            this.prevP2Hp = this.p2.hp;

            // AI Decision & Movement
            this.bot1.update(this.p1, this.p2, dt, this.bounds);
            this.bot2.update(this.p2, this.p1, dt, this.bounds);

            // Physics & Entity Update
            this.p1.update(dt, this.bounds);
            this.p2.update(dt, this.bounds);

            // Combat Resolve
            combat.updateProjectiles(dt, this.bounds, this.p1, this.p2);
            combat.resolve(this.p1, this.p2, (intensity, dur) => {
                if (this.simSpeed <= 2) this.renderer.triggerShake(intensity, dur);
            });

            // Round End conditions
            if (this.p1.hp <= 0 || this.p2.hp <= 0 || this.matchTimer <= 0) {
                this.state = STATE_ROUND_OVER;
                this.roundOverTimer = (this.simSpeed >= 4) ? 35 : 100;

                if (this.p1.hp <= 0 && !this.p1.isDead) this.p1.triggerDeath(this.p2.x, this.p2.y);
                if (this.p2.hp <= 0 && !this.p2.isDead) this.p2.triggerDeath(this.p1.x, this.p1.y);

                let roundWinner = null;
                if (this.p1.hp > this.p2.hp) {
                    roundWinner = this.p1;
                    this.p1.roundsWon++;
                    this.stats.bot1RoundsWon++;
                    this.roundMessage = 'BOT 1 THẮNG HIỆP!';
                } else if (this.p2.hp > this.p1.hp) {
                    roundWinner = this.p2;
                    this.p2.roundsWon++;
                    this.stats.bot2RoundsWon++;
                    this.roundMessage = 'BOT 2 THẮNG HIỆP!';
                } else {
                    this.roundMessage = 'HÒA HIỆP ĐẤU!';
                }

                if (this.simSpeed === 1 && roundWinner) sound.playVictory();
                this.updateStatsUI();
            }
            return;
        }

        // 3. ROUND OVER
        if (this.state === STATE_ROUND_OVER) {
            this.roundOverTimer -= dt;
            this.p1.update(dt * 0.4, this.bounds);
            this.p2.update(dt * 0.4, this.bounds);
            combat.updateProjectiles(dt * 0.4, this.bounds, this.p1, this.p2);

            if (this.roundOverTimer <= 0) {
                // Check match winner (first to 2 rounds)
                if (this.p1.roundsWon >= 2 || this.p2.roundsWon >= 2) {
                    this.resolveMatchVictory();
                } else {
                    this.round++;
                    this.startRound();
                }
            }
            return;
        }

        // 4. VICTORY
        if (this.state === STATE_VICTORY) {
            this.roundOverTimer -= dt;
            if (this.roundOverTimer <= 0) {
                if (this.mode === 'AUTO') {
                    if (this.currentMatchIndex < this.targetMatches) {
                        this.currentMatchIndex++;
                        this.startMatch(this.bot1Char, this.bot2Char);
                    } else {
                        // Finished 10 matches!
                        this.openReportModal();
                    }
                } else {
                    // Manual mode -> automatically loop into new match
                    this.startMatch(this.bot1Char, this.bot2Char);
                }
            }
        }
    }

    resolveMatchVictory() {
        this.state = STATE_VICTORY;
        this.roundOverTimer = (this.simSpeed >= 4) ? 45 : 120;

        let matchWinnerName = 'HÒA TRẬN';
        let matchWinnerIndex = -1;

        if (this.p1.roundsWon >= 2) {
            this.stats.bot1Wins++;
            matchWinnerName = CHAR_DATA[this.bot1Char].name;
            matchWinnerIndex = 1;
            this.roundMessage = `BOT 1 (${matchWinnerName}) CHIẾN THẮNG!`;
        } else if (this.p2.roundsWon >= 2) {
            this.stats.bot2Wins++;
            matchWinnerName = CHAR_DATA[this.bot2Char].name;
            matchWinnerIndex = 2;
            this.roundMessage = `BOT 2 (${matchWinnerName}) CHIẾN THẮNG!`;
        } else {
            this.stats.draws++;
            this.roundMessage = 'HÒA CHUNG CUỘC!';
        }

        this.stats.matchDurations.push(this.currentMatchDuration);
        this.stats.matchHistory.push({
            match: this.currentMatchIndex,
            winner: matchWinnerIndex,
            winnerName: matchWinnerName,
            p1Score: this.p1.roundsWon,
            p2Score: this.p2.roundsWon,
            duration: Math.round(this.currentMatchDuration)
        });

        this.updateStatsUI();
    }

    updateStatsUI() {
        const totalCompleted = this.stats.bot1Wins + this.stats.bot2Wins + this.stats.draws;
        const b1Rate = totalCompleted > 0 ? Math.round((this.stats.bot1Wins / totalCompleted) * 100) : 50;
        const b2Rate = totalCompleted > 0 ? Math.round((this.stats.bot2Wins / totalCompleted) * 100) : 50;

        // Top bar live scores
        const scoreEl = document.getElementById('stat-live-score');
        const matchProgressEl = document.getElementById('stat-match-progress');
        const p1RateEl = document.getElementById('stat-p1-winrate');
        const p2RateEl = document.getElementById('stat-p2-winrate');
        const barFillP1 = document.getElementById('stat-bar-p1');

        if (scoreEl) scoreEl.textContent = `${this.stats.bot1Wins} - ${this.stats.bot2Wins}`;
        if (matchProgressEl) matchProgressEl.textContent = `TRẬN: ${this.currentMatchIndex} / ${this.targetMatches}`;
        if (p1RateEl) p1RateEl.textContent = `${b1Rate}%`;
        if (p2RateEl) p2RateEl.textContent = `${b2Rate}%`;
        if (barFillP1) barFillP1.style.width = `${b1Rate}%`;

        // Side details panel
        const p1DmgEl = document.getElementById('detail-p1-dmg');
        const p2DmgEl = document.getElementById('detail-p2-dmg');
        const ttkEl = document.getElementById('detail-avg-ttk');

        if (p1DmgEl) p1DmgEl.textContent = Math.round(this.stats.bot1TotalDmg).toLocaleString();
        if (p2DmgEl) p2DmgEl.textContent = Math.round(this.stats.bot2TotalDmg).toLocaleString();

        const avgDuration = this.stats.matchDurations.length > 0
            ? (this.stats.matchDurations.reduce((a, b) => a + b, 0) / this.stats.matchDurations.length).toFixed(1)
            : '0.0';
        if (ttkEl) ttkEl.textContent = `${avgDuration}s`;
    }

    openReportModal() {
        const modal = document.getElementById('report-modal');
        if (!modal) return;

        const total = this.stats.bot1Wins + this.stats.bot2Wins + this.stats.draws;
        const b1Rate = total > 0 ? Math.round((this.stats.bot1Wins / total) * 100) : 0;
        const b2Rate = total > 0 ? Math.round((this.stats.bot2Wins / total) * 100) : 0;

        const p1Name = CHAR_DATA[this.bot1Char].name;
        const p2Name = CHAR_DATA[this.bot2Char].name;

        document.getElementById('report-p1-name').textContent = p1Name;
        document.getElementById('report-p2-name').textContent = p2Name;
        document.getElementById('report-score').textContent = `${this.stats.bot1Wins} - ${this.stats.bot2Wins}`;
        document.getElementById('report-p1-rate').textContent = `${b1Rate}%`;
        document.getElementById('report-p2-rate').textContent = `${b2Rate}%`;
        document.getElementById('report-bar-p1').style.width = `${b1Rate}%`;

        document.getElementById('report-p1-dmg').textContent = Math.round(this.stats.bot1TotalDmg).toLocaleString();
        document.getElementById('report-p2-dmg').textContent = Math.round(this.stats.bot2TotalDmg).toLocaleString();

        const avgDuration = this.stats.matchDurations.length > 0
            ? (this.stats.matchDurations.reduce((a, b) => a + b, 0) / this.stats.matchDurations.length).toFixed(1)
            : '0.0';
        document.getElementById('report-avg-time').textContent = `${avgDuration}s`;

        // Balance Verdict logic
        const verdictEl = document.getElementById('report-verdict');
        const diff = Math.abs(b1Rate - b2Rate);
        if (diff <= 15) {
            verdictEl.innerHTML = '⚖️ <span style="color: #34d399">KÈO ĐẤU CÂN BẰNG LÝ TƯỞNG</span> (Tỉ lệ thắng dao động quanh 45% - 55%, chênh lệch kỹ năng nhỏ)';
        } else if (diff <= 35) {
            const advName = b1Rate > b2Rate ? p1Name : p2Name;
            verdictEl.innerHTML = `⚠️ <span style="color: #fbbf24">CÓ SỰ CHÊNH LỆCH NHẸ</span> (${advName} chiếm ưu thế khoảng ${Math.max(b1Rate, b2Rate)}%)`;
        } else {
            const opName = b1Rate > b2Rate ? p1Name : p2Name;
            verdictEl.innerHTML = `🚨 <span style="color: #f43f5e">MẤT CÂN BẰNG ĐÁNG KỂ</span> (${opName} hoàn toàn áp đảo với tỉ lệ ${Math.max(b1Rate, b2Rate)}% - Cần nerf hoặc buff đối thủ)`;
        }

        // Match log list
        const logList = document.getElementById('report-match-list');
        if (logList) {
            logList.innerHTML = this.stats.matchHistory.map(m => `
                <div class="log-item">
                    <span class="log-match">Trận ${m.match}</span>
                    <span class="log-winner" style="color: ${m.winner === 1 ? CHAR_DATA[this.bot1Char].color : CHAR_DATA[this.bot2Char].color}">
                        ${m.winnerName} (${m.p1Score}-${m.p2Score})
                    </span>
                    <span class="log-dur">${m.duration}s</span>
                </div>
            `).join('');
        }

        modal.classList.remove('hidden');
    }

    render() {
        this.renderer.drawArena(this.bounds);

        if (this.p1 && this.p2) {
            combat.drawProjectiles(this.ctx);

            this.renderer.drawCyborg(this.p1);
            this.renderer.drawCyborg(this.p2);

            fx.draw(this.ctx);

            this.renderer.drawHUD(this.p1, this.p2, this.matchTimer, this.roundMessage);

            // Spectator Watermark Tag
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(0, 240, 255, 0.85)';
            this.ctx.font = '700 13px Orbitron, sans-serif';
            this.ctx.textAlign = 'center';
            const modeText = (this.mode === 'AUTO') ? `⚡ AUTO BENCHMARK (${this.simSpeed}x)` : '🎮 MANUAL SPECTATOR (1x)';
            this.ctx.fillText(`👁️ BOT VS BOT TESTBENCH • ${modeText}`, 640, 24);
            this.ctx.restore();
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.spectatorGame = new SpectatorGameController();
});
