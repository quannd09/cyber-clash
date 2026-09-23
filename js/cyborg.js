// Cyborg Fighter Entity Class
import { sound } from './audio.js?v=75';
import { fx } from './particles.js?v=75';
import { physics } from './physics.js?v=75';
import { WEAPONS, SKILLS, Projectile, combat } from './combat.js?v=75';
import { input } from './input.js?v=75';

export class Cyborg {
    constructor(index, startX, startY, color, name = 'CYBORG', characterId = 'yanagi') {
        this.index = index;
        this.color = color;
        this.name = name;
        this.characterId = characterId;
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
        const charStyles = {
            yanagi: 'melee',
            velina: 'ranged',
            nicole: 'ranged',
            trigger: 'ranged',
            vivian: 'ranged',
            jotaro: 'melee',
            goku: 'melee',
            giorno: 'melee',
            naoya: 'melee',
            luffy: 'melee',
            gojo: 'melee',
            sukuna: 'melee',
            saitama: 'melee',
            tst26: 'ranged'
        };
        this.color = charColors[characterId] || color || '#a78bfa';
        this.combatStyle = charStyles[characterId] || 'melee';

        // Transform & Physics
        this.x = startX;
        this.y = startY;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.radius = 26;
        this.facingAngle = index === 0 ? 0 : Math.PI;
        this.aimAngle = this.facingAngle;
        this.isStrafing = false;

        // Boost & Wall bounce
        this.isBoosted = false;
        this.boostTimer = 0;

        // Naoya 24-FPS Projection & Frame Freeze mechanism
        this.naoyaHitCount = 0;
        this.frameFrozenTimer = 0;
        this.afterimages = []; // [{x, y, aimAngle, facingDir, alpha, frame}]

        // Core Vitals (Balanced across archetypes)
        const charHp = {
            saitama: 650,
            tst26: 600,
            jotaro: 525,
            luffy: 520,
            sukuna: 520,
            goku: 520,
            vivian: 520,
            yanagi: 515,
            giorno: 515,
            gojo: 515,
            velina: 510,
            nicole: 510,
            naoya: 510,
            trigger: 505
        };
        this.maxHp = charHp[characterId] || 515;
        this.hp = this.maxHp;
        this.maxEnergy = 100;
        this.energy = 100;
        this.overdrive = 0; // 0 to 100
        // Ultimate recharge cooldown scaling: Gojo & Sukuna take 1.4x longer to charge overdrive
        this.overdriveChargeRate = (characterId === 'gojo' || characterId === 'sukuna') ? (1 / 1.4) : 1.0;
        this.roundsWon = 0;

        // State Flags
        this.isAttacking = false;
        this.attackType = 'light';
        this.attackTimer = 0;
        this.attackDuration = 0;
        this.attackCooldown = 0;
        this.attackHitRegistered = false;
        this.hasClashed = false;
        this.attackReach = 60;
        this.currentAttackDamage = 10;
        this.isShooting = false;

        this.isShielding = false;
        this.shieldTimer = 0;

        this.isStunned = false;
        this.stunTimer = 0;

        this.skillCooldownTimer = 0;
        this.isUsingUltimate = false;
        this.ultimateTimer = 0;

        // Anti-spam Attack Mechanism
        this.recentAttackTimes = [];
        this.spamDelayTimer = 0;
        this.attackBufferTimer = 0;

        // Death / KO Animation
        this.isDead = false;
        this.deathTimer = 0;
        this.deathFallAngle = 0;

        // Loadout selection
        this.loadout = {
            weapon: 'DUAL_BLADES',
            skill: 'PHASE_BLINK'
        };

        this.soundThrusterTick = 0;
    }

    reset(startX, startY, facing) {
        this.x = startX;
        this.y = startY;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.facingAngle = facing;
        this.aimAngle = facing;
        this.isStrafing = false;
        this.hp = this.maxHp;
        this.energy = this.maxEnergy;
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.isShielding = false;
        this.shieldTimer = 0;
        this.isStunned = false;
        this.stunTimer = 0;
        this.isBoosted = false;
        this.boostTimer = 0;
        this.skillCooldownTimer = 0;
        this.isUsingSkill = false;
        this.skillActionTimer = 0;
        this.isUsingUltimate = false;
        this.ultimateTimer = 0;
        this.hasClashed = false;
        this.recentAttackTimes = [];
        this.spamDelayTimer = 0;
        this.signatureHits = 0;
        this.bleedTimer = 0;
        this.sensoryOverloadTimer = 0;
        this.curseTimer = 0;
        this.hasLockOn = false;
        this.naoyaHitCount = 0;
        this.frameFrozenTimer = 0;
        this.afterimages = [];
        this.isDead = false;
        this.deathTimer = 0;
        this.deathFallAngle = 0;
        this.lastNaoyaHitIndex = -1;
    }

    update(dt = 1, arenaBounds) {
        // Death / KO State Physics & Effects
        if (this.isDead) {
            this.deathTimer += dt;

            // Zero-G decaying drift with slow falling gravity
            this.vy += 0.22 * dt;
            this.vx *= Math.pow(0.95, dt);
            this.vy *= Math.pow(0.96, dt);
            this.x += this.vx * dt;
            this.y += this.vy * dt;

            // Boundary clamping & soft collision with floor / arena bounds
            if (arenaBounds) {
                if (this.y > arenaBounds.maxY - 25) {
                    this.y = arenaBounds.maxY - 25;
                    if (Math.abs(this.vy) > 0.5) {
                        this.vy = -this.vy * 0.22;
                        fx.spawnDeathSparks(this.x, this.y, this.color);
                    } else {
                        this.vy = 0;
                    }
                    this.vx *= 0.85;
                }
                if (this.x < arenaBounds.minX + 25) { this.x = arenaBounds.minX + 25; this.vx = -this.vx * 0.3; }
                if (this.x > arenaBounds.maxX - 25) { this.x = arenaBounds.maxX - 25; this.vx = -this.vx * 0.3; }
                if (this.y < arenaBounds.minY + 25) { this.y = arenaBounds.minY + 25; this.vy = 0; }
            }

            // Continuous death effects: electrical overload sparks and smoke
            if (this.deathTimer < 70 && Math.random() < 0.45) {
                fx.spawnDeathSparks(this.x, this.y, this.color);
            }
            if (this.deathTimer > 25 && Math.random() < 0.25) {
                fx.spawnDeathSmoke(this.x, this.y);
            }

            return; // Skip normal combat abilities while dead
        }

        // Regenerate Energy slowly
        if (!this.isShielding && this.energy < this.maxEnergy) {
            this.energy = Math.min(this.maxEnergy, this.energy + 0.35 * dt);
        }

        // Automatically regenerate Overdrive over time (idling, dodging, repositioning)
        let isOpponentUltActive = false;
        if (typeof window !== 'undefined' && window.game) {
            const opp = (this.index === 0) ? window.game.p2 : window.game.p1;
            if (opp && opp.isUsingUltimate) isOpponentUltActive = true;
        }

        if (!this.isUsingUltimate && !isOpponentUltActive && this.overdrive < 100) {
            const passiveGain = 0.08 * this.overdriveChargeRate;
            this.overdrive = Math.min(100, this.overdrive + passiveGain * dt);
        }

        // Energy drain if shielding
        if (this.isShielding) {
            this.energy = Math.max(0, this.energy - 0.5 * dt);
            this.shieldTimer += dt;
            if (this.energy <= 0) {
                this.isShielding = false;
                this.applyStun(30); // Guard break stun!
                fx.addText(this.x, this.y - 30, 'GUARD BROKEN!', '#ff0055', 20);
                sound.playHit(true);
            }
        }

        // Handle Stun
        if (this.isStunned) {
            this.stunTimer -= dt;
            if (this.stunTimer <= 0) {
                this.isStunned = false;
            }
        }

        // Handle 24 FPS Frame Freeze
        if (this.frameFrozenTimer > 0) {
            this.frameFrozenTimer -= dt;
        }

        // Handle Signature Status Effects (Bleed, Sensory Overload, Curse)
        if (this.bleedTimer > 0) {
            this.bleedTimer -= dt;
            this.takeDamage(0.25 * dt, false);
            if (Math.random() < 0.25) {
                fx.spawnHitSparks(this.x, this.y, '#f43f5e', 2);
            }
        }
        if (this.sensoryOverloadTimer > 0) {
            this.sensoryOverloadTimer -= dt;
            this.vx *= Math.pow(0.92, dt);
            this.vy *= Math.pow(0.92, dt);
            if (Math.random() < 0.2) {
                fx.spawnHitSparks(this.x, this.y, '#facc15', 1);
            }
        }
        if (this.curseTimer > 0) {
            this.curseTimer -= dt;
        }

        // Handle Skill Cooldown & Active Skill Pose Duration
        if (this.skillCooldownTimer > 0) {
            this.skillCooldownTimer -= dt;
        }
        if (this.isUsingSkill) {
            this.skillActionTimer -= dt;
            if (this.skillActionTimer <= 0) {
                this.isUsingSkill = false;
            }
        }

        // Handle Attack animation & cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown -= dt;
        }
        if (this.spamDelayTimer > 0) {
            this.spamDelayTimer -= dt;
        }

        // Buffer attack execution for ultra-responsive controls (especially on mobile)
        if (this.attackBufferTimer > 0) {
            this.attackBufferTimer -= dt;
            if (this.canAttack()) {
                this.attack();
                this.attackBufferTimer = 0;
            }
        }

        if (this.isAttacking) {
            this.attackTimer += dt;
            if (this.attackTimer >= this.attackDuration) {
                this.isAttacking = false;
                this.hasClashed = false;
            }
        }

        // Handle Ultimate
        if (this.isUsingUltimate) {
            this.ultimateTimer += dt;
            if (this.ultimateTimer >= 75) {
                this.isUsingUltimate = false;
            }
        }

        // Physics update
        physics.updateBody(this, dt);

        // Update Afterimages (Naoya Projection Afterimages)
        if (this.afterimages && this.afterimages.length > 0) {
            for (let i = this.afterimages.length - 1; i >= 0; i--) {
                this.afterimages[i].life -= dt;
                this.afterimages[i].alpha = Math.max(0, this.afterimages[i].life / this.afterimages[i].maxLife);
                if (this.afterimages[i].life <= 0) {
                    this.afterimages.splice(i, 1);
                }
            }
        }

        // Arena boundary collision + Wall Bounce Trick callback
        physics.resolveArenaBounds(this, arenaBounds, (body, nx, ny) => {
            // TRICK #2: WALL BOUNCE BOOST!
            sound.playWallBounce(this.x < (arenaBounds.minX + arenaBounds.maxX) / 2 ? -0.5 : 0.5);
            fx.spawnWallBounce(this.x, this.y, nx, ny, this.color);
            fx.addText(this.x, this.y - 35, '💨 WALL BOUNCE! 💨', '#00f0ff', 22);
            this.energy = Math.min(this.maxEnergy, this.energy + 8);
        });
    }

    // --- ACTIONS ---

    thrust(dirX, dirY, updateAim = true) {
        if (this.isStunned || this.isUsingUltimate) return;

        const thrustPower = this.isBoosted ? 1.2 : 0.6;
        this.ax += dirX * thrustPower;
        this.ay += dirY * thrustPower;

        // Update facing and aim angle
        if (Math.hypot(dirX, dirY) > 0.1) {
            const moveAngle = Math.atan2(dirY, dirX);
            this.facingAngle = moveAngle;
            if (updateAim) {
                this.aimAngle = moveAngle;
            }
        }

        // Spawn thruster particle flame
        const flameColor = this.isBoosted ? '#ffffff' : this.color;
        const tailAngle = Math.atan2(this.vy || dirY, this.vx || dirX);
        fx.spawnThrusterFlame(
            this.x - Math.cos(tailAngle) * (this.radius * 0.9),
            this.y - Math.sin(tailAngle) * (this.radius * 0.9),
            tailAngle,
            flameColor
        );

        this.soundThrusterTick++;
        if (this.soundThrusterTick % 7 === 0) {
            sound.playThruster(this.x < 500 ? -0.4 : 0.4);
        }
    }

    setAimAngle(angle) {
        this.aimAngle = angle;
        this.facingAngle = angle;
    }

    canAttack() {
        return !this.isStunned && !this.isShielding && !this.isAttacking && this.attackCooldown <= 0 && !this.isUsingUltimate && this.spamDelayTimer <= 0;
    }

    attack() {
        if (!this.canAttack()) return;

        const weapon = WEAPONS[this.characterId.toUpperCase()];
        const now = performance.now();
        const isTouchPlayer = (this.index === 0 && ((typeof input !== 'undefined' && input.touchEnabled) || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)));

        // Attack spam restriction:
        // For melee fighters: 3.75s (3750ms) window for 6 hits to restrict spamming
        // For ranged fighters: 3.0s (3000ms) window
        const spamWindowMs = this.combatStyle === 'melee'
            ? 3750
            : Math.max(3000, (weapon.attackCooldown || 25) * 5.5 * (1000 / 60));

        this.recentAttackTimes = (this.recentAttackTimes || []).filter(t => now - t <= spamWindowMs);
        this.recentAttackTimes.push(now);

        this.isAttacking = true;
        this.attackType = 'basic';
        this.attackTimer = 0;
        this.attackDuration = weapon.attackDuration;
        this.attackReach = weapon.attackRange;
        this.currentAttackDamage = weapon.attackDmg;
        this.attackHitRegistered = false;
        this.hasClashed = false;

        // Reduce attack latency on mobile devices:
        // 20% cooldown reduction on touch devices for fluid responsiveness
        const baseCooldown = isTouchPlayer
            ? Math.max(12, Math.round(weapon.attackCooldown * 0.8))
            : weapon.attackCooldown;

        // Anti-spam buffer: brief breather rather than harsh lockout so attacks never feel stuck
        if (this.recentAttackTimes.length >= 8) {
            this.spamDelayTimer = 16; // Brief 0.25s breather
            this.recentAttackTimes = []; // Reset after trigger
        } else {
            this.attackCooldown = baseCooldown;
        }

        if (this.combatStyle === 'ranged') {
            // FIRE PROJECTILE
            this.isShooting = true;
            const speed = 14.5;
            const spawnX = this.x + Math.cos(this.aimAngle) * (this.radius + 16);
            const spawnY = this.y + Math.sin(this.aimAngle) * (this.radius + 16);
            const proj = new Projectile(
                this.index,
                spawnX,
                spawnY,
                Math.cos(this.aimAngle) * speed,
                Math.sin(this.aimAngle) * speed,
                weapon.attackDmg,
                this.color,
                9
            );
            combat.addProjectile(proj);
            sound.playLaser();
            // Small recoil
            physics.applyKnockback(this, -Math.cos(this.aimAngle), -Math.sin(this.aimAngle), 4.5);
        } else {
            // MELEE SLASH / STRIKE
            this.isShooting = false;
            sound.playSlash(true);
            // Lunging dash momentum
            physics.applyKnockback(this, Math.cos(this.aimAngle), Math.sin(this.aimAngle), 6.5);

            // Emit signature energy blade / wave projectile so melee fighters can shoot moves at distance
            const spawnX = this.x + Math.cos(this.aimAngle) * (this.radius + 18);
            const spawnY = this.y + Math.sin(this.aimAngle) * (this.radius + 18);
            const waveSpeed = 16.5;
            const waveDmg = Math.round(weapon.attackDmg * 0.85);

            let waveType = 'standard';
            let waveColor = this.color;
            let waveRadius = 9;

            if (this.characterId === 'naoya') {
                waveType = 'projection_frame';
                waveColor = '#a3e635';
                waveRadius = 11;
            } else if (this.characterId === 'sukuna') {
                waveType = 'fire_orb';
                waveColor = '#f43f5e';
                waveRadius = 10;
            } else if (this.characterId === 'gojo') {
                waveType = 'hollow_purple';
                waveColor = '#0284c7';
                waveRadius = 9;
            }

            const waveProj = new Projectile(
                this.index,
                spawnX,
                spawnY,
                Math.cos(this.aimAngle) * waveSpeed,
                Math.sin(this.aimAngle) * waveSpeed,
                waveDmg,
                waveColor,
                waveRadius,
                waveType
            );
            combat.addProjectile(waveProj);
        }
    }

    activateShield() {
        if (this.isStunned || this.isAttacking || this.isUsingUltimate) return;
        if (this.energy < 15) return;

        if (!this.isShielding) {
            this.isShielding = true;
            this.shieldTimer = 0;
        }
    }

    releaseShield() {
        this.isShielding = false;
        this.shieldTimer = 0;
    }

    activateSkill(opponent) {
        if (this.isStunned || this.skillCooldownTimer > 0 || this.isUsingUltimate) return;

        const skillMap = {
            yanagi: SKILLS.YANAGI_SKILL,
            velina: SKILLS.VERINA_SKILL,
            nicole: SKILLS.NICOLE_SKILL,
            trigger: SKILLS.TRIGGER_SKILL,
            vivian: SKILLS.VIVIAN_SKILL,
            jotaro: SKILLS.JOTARO_SKILL,
            goku: SKILLS.GOKU_SKILL,
            giorno: SKILLS.GIORNO_SKILL,
            naoya: SKILLS.NAOYA_SKILL,
            luffy: SKILLS.LUFFY_SKILL,
            gojo: SKILLS.GOJO_SKILL,
            sukuna: SKILLS.SUKUNA_SKILL,
            saitama: SKILLS.SAITAMA_SKILL,
            tst26: SKILLS.TST26_SKILL
        };
        const skill = skillMap[this.characterId] || SKILLS.YANAGI_SKILL;
        this.skillCooldownTimer = skill.cooldown;
        this.isUsingSkill = true;
        this.skillActionTimer = 30;

        const weapon = WEAPONS[this.characterId.toUpperCase()];
        const normalDmg = weapon ? weapon.attackDmg : 30;
        // Skill damage equals 2x normal attack damage
        const skillDmg = normalDmg * 2;

        if (skill.id === 'PHASE_BLINK') {
            sound.playBlink();
            fx.spawnParryBurst(this.x, this.y, this.color);
            this.x += Math.cos(this.aimAngle) * 160;
            this.y += Math.sin(this.aimAngle) * 160;
            fx.spawnParryBurst(this.x, this.y, '#ffffff');
            fx.addText(this.x, this.y - 30, '🌀 BLINK!', this.color, 22);
            // Electric shockwave deals 2x damage if opponent is near appear point
            const dist = Math.hypot(opponent.x - this.x, opponent.y - this.y);
            if (dist < 140) {
                opponent.takeDamage(skillDmg);
                opponent.applyStun(16);
                physics.applyKnockback(opponent, Math.cos(this.aimAngle), Math.sin(this.aimAngle), 9);
                fx.spawnHitSparks(opponent.x, opponent.y, this.color, 16);
                fx.addText(opponent.x, opponent.y - 35, `⚡ THUNDER CLAP! -${Math.round(skillDmg)}`, this.color, 22);
                sound.playHit(true);
            }
        } else if (skill.id === 'PHOTOSYNTHESIS' || skill.id === 'EMP_BLAST') {
            sound.playEMP();
            fx.spawnClashShockwave(this.x, this.y);
            // Photosynthesis: Restore 25 HP & trigger protective shockwave
            this.hp = Math.min(this.maxHp, this.hp + 25);
            fx.addText(this.x, this.y - 30, '+25 HP HEAL!', '#34d399', 24);
            const dist = Math.hypot(opponent.x - this.x, opponent.y - this.y);
            if (dist < 250) {
                opponent.takeDamage(skillDmg);
                opponent.releaseShield();
                opponent.applyStun(16);
                physics.applyKnockback(opponent, opponent.x - this.x, opponent.y - this.y, 10);
                fx.addText(opponent.x, opponent.y - 30, `KNOCKBACK! -${Math.round(skillDmg)}`, '#34d399', 20);
            }
        } else if (skill.id === 'SUGAR_SLIDE') {
            sound.playWallBounce();
            physics.applyKnockback(this, Math.cos(this.aimAngle), Math.sin(this.aimAngle), 12);
            fx.addText(this.x, this.y - 30, '💼 SUGAR SLIDE!', '#f472b6', 22);
            // Fire 2 ether bullets, each doing 1x normal damage
            for (let angleOff of [-0.15, 0.15]) {
                const proj = new Projectile(
                    this.index,
                    this.x + Math.cos(this.aimAngle + angleOff) * 30,
                    this.y + Math.sin(this.aimAngle + angleOff) * 30,
                    Math.cos(this.aimAngle + angleOff) * 14,
                    Math.sin(this.aimAngle + angleOff) * 14,
                    skillDmg / 2,
                    '#f472b6',
                    8
                );
                combat.addProjectile(proj);
            }
        } else if (skill.id === 'SNIPER_STANCE') {
            sound.playLaser();
            fx.addText(this.x, this.y - 30, '🎯 SNIPER SHOT!', '#38bdf8', 24);
            // Piercing sniper round deals 2x normal damage
            const proj = new Projectile(
                this.index,
                this.x + Math.cos(this.aimAngle) * 35,
                this.y + Math.sin(this.aimAngle) * 35,
                Math.cos(this.aimAngle) * 22,
                Math.sin(this.aimAngle) * 22,
                skillDmg,
                '#38bdf8',
                11
            );
            combat.addProjectile(proj);
            physics.applyKnockback(this, -Math.cos(this.aimAngle), -Math.sin(this.aimAngle), 8);
        } else if (skill.id === 'ABLOOM_BURST') {
            sound.playSlash(false);
            this.hp = Math.min(this.maxHp, this.hp + 16);
            fx.addText(this.x, this.y - 30, '🔮 ABLOOM BURST!', '#c084fc', 22);

            // Automatically calibrate aim angle towards opponent
            const angleToOpponent = Math.atan2(opponent.y - this.y, opponent.x - this.x);
            const isFacingOpponent = Math.cos(this.aimAngle) * Math.cos(angleToOpponent) > 0;
            const baseAngle = isFacingOpponent ? angleToOpponent : this.aimAngle;

            // 4 ether feather cluster, high speed 16, radius 10px to deal 50 total damage
            const spreadAngles = [-0.12, -0.04, 0.04, 0.12];
            for (let a of spreadAngles) {
                const finalAngle = baseAngle + a;
                const proj = new Projectile(
                    this.index,
                    this.x + Math.cos(finalAngle) * 32,
                    this.y + Math.sin(finalAngle) * 32,
                    Math.cos(finalAngle) * 16,
                    Math.sin(finalAngle) * 16,
                    skillDmg / 4,
                    '#c084fc',
                    10
                );
                combat.addProjectile(proj);
            }
        } else if (skill.id === 'STAR_FINGER') {
            sound.playHit(true);
            fx.spawnParryBurst(this.x, this.y, '#818cf8');
            fx.addText(this.x, this.y - 35, '👊 STAR FINGER!', '#818cf8', 24);
            const reach = 260;
            const fxX = this.x + Math.cos(this.aimAngle) * (reach * 0.7);
            const fxY = this.y + Math.sin(this.aimAngle) * (reach * 0.7);
            const dist = Math.hypot(opponent.x - fxX, opponent.y - fxY);
            if (dist < opponent.radius + reach * 0.5) {
                opponent.takeDamage(skillDmg);
                opponent.applyStun(16);
                physics.applyKnockback(opponent, Math.cos(this.aimAngle), Math.sin(this.aimAngle), 13);
                fx.spawnHitSparks(opponent.x, opponent.y, '#818cf8', 20);
                sound.playHit(true);
            }
        } else if (skill.id === 'INSTANT_TRANSMISSION') {
            sound.playBlink();
            fx.spawnParryBurst(this.x, this.y, '#fbbf24');
            // Teleport behind opponent
            const behindX = opponent.x - Math.cos(opponent.aimAngle) * 75;
            const behindY = opponent.y - Math.sin(opponent.aimAngle) * 75;
            this.x = behindX;
            this.y = behindY;
            this.aimAngle = Math.atan2(opponent.y - this.y, opponent.x - this.x);
            fx.spawnParryBurst(this.x, this.y, '#fbbf24');
            fx.addText(this.x, this.y - 35, '⚡ METEOR SMASH!', '#fbbf24', 24);
            // Meteor strike shockwave
            const gokuSkillDmg = normalDmg * 1.5;
            if (opponent.isShielding && opponent.shieldTimer <= 10) {
                this.applyStun(18);
                sound.playParry();
            } else {
                opponent.takeDamage(gokuSkillDmg);
                opponent.applyStun(16);
                physics.applyKnockback(opponent, Math.cos(this.aimAngle), Math.sin(this.aimAngle), 11);
                sound.playHit(true);
            }
        } else if (skill.id === 'LIFE_TREE') {
            sound.playEMP();
            fx.spawnClashShockwave(opponent.x, opponent.y);
            fx.addText(opponent.x, opponent.y - 45, '🌳 TREE OF LIFE!', '#facc15', 24);
            opponent.takeDamage(skillDmg);
            opponent.applyStun(16);
            opponent.vy = -11; // Launch into air
            physics.applyKnockback(opponent, (Math.random() - 0.5) * 2, -1, 10);
            sound.playHit(true);
        } else if (skill.id === 'PROJECTION_DASH') {
            // NAOYA: PROJECTION SORCERY 24 FPS - LEAVES TRAIL OF PROJECTION AFTERIMAGES
            sound.playWallBounce();
            fx.spawnParryBurst(this.x, this.y, '#a3e635');
            const dashDist = 240;
            const startX = this.x;
            const startY = this.y;
            const facingDir = Math.cos(this.aimAngle) >= 0 ? 1 : -1;

            // Spawn 4 high-fidelity 24 FPS projection frame afterimages along the dash path
            for (let step = 1; step <= 4; step++) {
                const ratio = step / 4;
                const fxX = startX + Math.cos(this.aimAngle) * (dashDist * ratio);
                const fxY = startY + Math.sin(this.aimAngle) * (dashDist * ratio);
                this.afterimages.push({
                    x: fxX,
                    y: fxY,
                    facingDir: facingDir,
                    life: 30 + step * 6,
                    maxLife: 30 + step * 6,
                    alpha: 0.85
                });
            }

            this.x += Math.cos(this.aimAngle) * dashDist;
            this.y += Math.sin(this.aimAngle) * dashDist;
            fx.spawnParryBurst(this.x, this.y, '#a3e635');
            fx.addText(this.x, this.y - 35, '🎞️ PROJECTION STEP!', '#a3e635', 24);

            // Launch 3 supersonic 24-FPS Projection Blades across the arena
            for (const angleOff of [-0.08, 0, 0.08]) {
                const proj = new Projectile(
                    this.index,
                    this.x + Math.cos(this.aimAngle + angleOff) * 35,
                    this.y + Math.sin(this.aimAngle + angleOff) * 35,
                    Math.cos(this.aimAngle + angleOff) * 20,
                    Math.sin(this.aimAngle + angleOff) * 20,
                    skillDmg / 2,
                    '#a3e635',
                    12,
                    'projection_frame'
                );
                combat.addProjectile(proj);
            }

            const dist = Math.hypot(opponent.x - this.x, opponent.y - this.y);
            if (dist < 230) {
                opponent.takeDamage(skillDmg);
                opponent.applyFrameFreeze(20);
                physics.applyKnockback(opponent, Math.cos(this.aimAngle), Math.sin(this.aimAngle), 11);
                sound.playHit(true);
                fx.spawnHitSparks(opponent.x, opponent.y, '#a3e635', 20);
            }
        } else if (skill.id === 'GIGANT_STOMP') {
            // LUFFY: GIGANT STOMP
            sound.playHit(true);
            physics.applyKnockback(this, Math.cos(this.aimAngle), Math.sin(this.aimAngle), 10);
            fx.spawnClashShockwave(this.x, this.y);
            fx.addText(this.x, this.y - 35, '🍖 GIGANT STOMP!', '#ef4444', 24);
            const dist = Math.hypot(opponent.x - this.x, opponent.y - this.y);
            if (dist < 210) {
                opponent.takeDamage(skillDmg);
                opponent.applyStun(16);
                physics.applyKnockback(opponent, Math.cos(this.aimAngle), Math.sin(this.aimAngle), 13);
                fx.spawnHitSparks(opponent.x, opponent.y, '#ef4444', 22);
                sound.playHit(true);
            }
        } else if (skill.id === 'LAPSE_BLUE') {
            // GOJO: CURSED TECHNIQUE LAPSE - BLUE (INFINITY PULL) 🌀
            sound.playEMP();
            const pullX = this.x + Math.cos(this.aimAngle) * 200;
            const pullY = this.y + Math.sin(this.aimAngle) * 200;
            fx.spawnClashShockwave(pullX, pullY);
            fx.addText(this.x, this.y - 35, '🌀 LAPSE: BLUE!', '#0284c7', 24);

            // Gravitational suction vortex pulling opponent into the center
            const dx = pullX - opponent.x;
            const dy = pullY - opponent.y;
            const distToVortex = Math.hypot(dx, dy) || 1;
            opponent.vx += (dx / distToVortex) * 15;
            opponent.vy += (dy / distToVortex) * 15;
            opponent.takeDamage(skillDmg);
            opponent.applyStun(16);
            sound.playHit(true);
            fx.spawnHitSparks(opponent.x, opponent.y, '#0284c7', 18);
        } else if (skill.id === 'KAMINO_FIRE_ARROW') {
            // SUKUNA: KAMINO FUGA (OPEN / FLAME ARROW) 🔥
            sound.playLaser();
            fx.addText(this.x, this.y - 35, '🔥 KAMINO: FUGA!', '#ef4444', 24);
            const proj = new Projectile(
                this.index,
                this.x + Math.cos(this.aimAngle) * 35,
                this.y + Math.sin(this.aimAngle) * 35,
                Math.cos(this.aimAngle) * 18,
                Math.sin(this.aimAngle) * 18,
                skillDmg,
                '#dc2626',
                18,
                'fire_orb'
            );
            combat.addProjectile(proj);
            physics.applyKnockback(this, -Math.cos(this.aimAngle), -Math.sin(this.aimAngle), 7);
        } else if (skill.id === 'CONSECUTIVE_PUNCHES') {
            // SAITAMA: CONSECUTIVE NORMAL PUNCHES
            sound.playHit(true);
            fx.spawnClashShockwave(this.x, this.y);
            this.x += Math.cos(this.aimAngle) * 140;
            this.y += Math.sin(this.aimAngle) * 140;
            fx.addText(this.x, this.y - 35, '🥊 CONSECUTIVE NORMAL PUNCHES!', '#eab308', 24);
            const dist = Math.hypot(opponent.x - this.x, opponent.y - this.y);
            if (dist < 200) {
                opponent.takeDamage(skillDmg * 1.3);
                opponent.applyStun(22);
                physics.applyKnockback(opponent, Math.cos(this.aimAngle), Math.sin(this.aimAngle), 16);
                fx.spawnHitSparks(opponent.x, opponent.y, '#eab308', 28);
            }
        } else if (skill.id === 'MAID_PURGE') {
            // TST-26: ABSOLUTE SANITIZATION SWEEP
            sound.playEMP();
            fx.spawnClashShockwave(this.x, this.y);
            this.hp = Math.min(this.maxHp, this.hp + 35);
            fx.addText(this.x, this.y - 35, '✨ MAID CLEANSE! +35 HP', '#ec4899', 24);
            const dist = Math.hypot(opponent.x - this.x, opponent.y - this.y);
            if (dist < 280) {
                opponent.takeDamage(skillDmg * 1.15);
                opponent.releaseShield();
                opponent.applyStun(18);
                const angle = Math.atan2(opponent.y - this.y, opponent.x - this.x);
                physics.applyKnockback(opponent, Math.cos(angle), Math.sin(angle), 13);
                fx.spawnHitSparks(opponent.x, opponent.y, '#ec4899', 22);
            }
        }
    }

    dash(dirX = null, dirY = null) {
        if (this.isStunned || this.isUsingUltimate) return;

        if (this.energy >= 15) {
            this.energy -= 15;
            this.isBoosted = true;
            this.boostTimer = 26;
            let dashAngle = this.aimAngle;
            if (dirX !== null && dirY !== null && Math.hypot(dirX, dirY) > 0.1) {
                dashAngle = Math.atan2(dirY, dirX);
            }
            physics.applyKnockback(this, Math.cos(dashAngle), Math.sin(dashAngle), 14.5);
            sound.playWallBounce();
            fx.spawnThrusterFlame(this.x, this.y, dashAngle, '#ffffff');
            fx.addText(this.x, this.y - 30, '💨 DASH!', this.color, 20);
        } else {
            fx.addText(this.x, this.y - 30, 'NEED ENERGY!', '#ff0055', 18);
        }
    }

    activateUltimate() {
        if (this.isStunned || this.isUsingUltimate) return;

        if (this.overdrive < 100) {
            fx.addText(this.x, this.y - 30, 'NEED 100% OVERDRIVE!', '#ff0055', 18);
            return;
        }

        this.overdrive = 0;
        this.isUsingUltimate = true;
        this.ultimateTimer = 0;
        this.isAttacking = false;
        this.isShielding = false;
        this.isUsingSkill = false;
        this.skillActionTimer = 0;
        this.lastNaoyaHitIndex = -1;

        sound.playUltimate();
        fx.spawnClashShockwave(this.x, this.y);
        
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
            sukuna: '⛩️ DOMAIN EXPANSION: MALEVOLENT SHRINE! ⛩️',
            saitama: '💥 SERIOUS PUNCH: DEATH IMPACT! 💥',
            tst26: '✨ MAID ORDER: MAXIMUM SANITIZATION! ✨'
        };
        const shout = ultShouts[this.characterId] || '🔥 OVERDRIVE ULTIMATE! 🔥';
        fx.addText(this.x, this.y - 45, shout, this.color, 28, 60);
    }

    takeDamage(amount, isFromUltimate = false, sourceX = null, sourceY = null) {
        if (this.isDead) return;
        this.hp = Math.max(0, this.hp - amount);

        // Failsafe: Check whether opponent is currently executing ultimate
        let isAnyOpponentUltActive = false;
        if (typeof window !== 'undefined' && window.game) {
            const opp = (this.index === 0) ? window.game.p2 : window.game.p1;
            if (opp && opp.isUsingUltimate) isAnyOpponentUltActive = true;
        }

        // Only grant Overdrive charge from normal attacks/skills, NOT from enemy ultimate
        if (!isFromUltimate && !this.isUsingUltimate && !isAnyOpponentUltActive && this.overdrive < 100) {
            const damageOdGain = (amount * 0.48 + 3.0) * this.overdriveChargeRate;
            this.overdrive = Math.min(100, this.overdrive + damageOdGain);
        }
        if (this.hp <= 0) {
            this.triggerDeath(sourceX, sourceY);
        }
    }

    triggerDeath(killerX = null, killerY = null) {
        if (this.isDead) return;
        this.isDead = true;
        this.deathTimer = 0;
        this.hp = 0;
        this.isAttacking = false;
        this.isShielding = false;
        this.isUsingSkill = false;
        this.isUsingUltimate = false;
        this.isBoosted = false;
        this.attackBufferTimer = 0;

        // Determine knockback blow vector
        let dx = (killerX !== null && killerX !== undefined) ? (this.x - killerX) : (this.index === 0 ? -1 : 1);
        let dy = (killerY !== null && killerY !== undefined) ? (this.y - killerY) : -0.5;
        const dist = Math.hypot(dx, dy) || 1;
        const dirX = dx / dist;
        const dirY = dy / dist;

        this.vx = dirX * 11;
        this.vy = Math.min(-5.5, dirY * 10 - 4); // Blast upward and back
        this.deathFallAngle = dirX >= 0 ? -Math.PI / 2 : Math.PI / 2;

        fx.spawnDeathBurst(this.x, this.y, this.color);
        sound.playDeath(this.x > 640 ? 0.3 : -0.3);
    }

    applyStun(frames) {
        this.isStunned = true;
        this.stunTimer = frames;
        this.isAttacking = false;
        this.isShielding = false;
    }

    applyFrameFreeze(frames = 45) {
        this.applyStun(frames);
        this.frameFrozenTimer = frames;
        fx.addText(this.x, this.y - 45, '🎞️ 10 FPS FRAME FREEZE! 🎞️', '#a3e635', 24, 45);
        sound.playHit(true);
    }
}
