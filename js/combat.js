import { sound } from './audio.js?v=75';
import { fx } from './particles.js?v=75';
import { physics } from './physics.js?v=75';

export const WEAPONS = {
    YANAGI: {
        id: 'YANAGI',
        name: 'Electric Naginata',
        attackDmg: 32, 
        attackRange: 85,
        attackDuration: 18,
        attackCooldown: 21,
        isRanged: false,
        icon: '⚔️'
    },
    VELINA: {
        id: 'VELINA',
        name: 'Photonic Flora',
        attackDmg: 25,
        attackRange: 540,
        attackDuration: 20,
        attackCooldown: 22,
        isRanged: true,
        icon: '🌸'
    },
    NICOLE: {
        id: 'NICOLE',
        name: 'Briefcase Cannon',
        attackDmg: 26,
        attackRange: 520,
        attackDuration: 20,
        attackCooldown: 22,
        isRanged: true,
        icon: '💼'
    },
    TRIGGER: {
        id: 'TRIGGER',
        name: 'Electromagnetic Sniper',
        attackDmg: 32,
        attackRange: 600,
        attackDuration: 22,
        attackCooldown: 25,
        isRanged: true,
        icon: '🎯'
    },
    VIVIAN: {
        id: 'VIVIAN',
        name: 'Ether Feathers',
        attackDmg: 24,
        attackRange: 500,
        attackDuration: 19,
        attackCooldown: 21,
        isRanged: true,
        icon: '🔮'
    },
    JOTARO: {
        id: 'JOTARO',
        name: 'Star Platinum ORA',
        attackDmg: 32,
        attackRange: 85,
        attackDuration: 18,
        attackCooldown: 21,
        isRanged: false,
        icon: '👊'
    },
    GOKU: {
        id: 'GOKU',
        name: 'Dragon Fist Ki',
        attackDmg: 31,
        attackRange: 82,
        attackDuration: 17,
        attackCooldown: 20,
        isRanged: false,
        icon: '🥋'
    },
    GIORNO: {
        id: 'GIORNO',
        name: 'Gold Experience MUDA',
        attackDmg: 31,
        attackRange: 82,
        attackDuration: 18,
        attackCooldown: 20,
        isRanged: false,
        icon: '🐞'
    },
    NAOYA: {
        id: 'NAOYA',
        name: '24 FPS Projection Fists',
        attackDmg: 31,
        attackRange: 82,
        attackDuration: 17,
        attackCooldown: 20,
        isRanged: false,
        icon: '🎞️'
    },
    LUFFY: {
        id: 'LUFFY',
        name: 'Gomu Gomu no Pistol',
        attackDmg: 31,
        attackRange: 105,
        attackDuration: 19,
        attackCooldown: 21,
        isRanged: false,
        icon: '🍖'
    },
    GOJO: {
        id: 'GOJO',
        name: 'Black Flash Infinity',
        attackDmg: 31,
        attackRange: 85,
        attackDuration: 18,
        attackCooldown: 21,
        isRanged: false,
        icon: '♾️'
    },
    SUKUNA: {
        id: 'SUKUNA',
        name: 'Dismantle Slashes',
        attackDmg: 32,
        attackRange: 90,
        attackDuration: 18,
        attackCooldown: 21,
        isRanged: false,
        icon: '⛩️'
    },
    SAITAMA: {
        id: 'SAITAMA',
        name: 'Consecutive Punches',
        attackDmg: 33,
        attackRange: 85,
        attackDuration: 17,
        attackCooldown: 20,
        isRanged: false,
        icon: '🥊'
    },
    MEGUMI: {
        id: 'MEGUMI',
        name: 'Shadow Blade',
        attackDmg: 31,
        attackRange: 86,
        attackDuration: 18,
        attackCooldown: 20,
        isRanged: false,
        icon: '🐺'
    },
    MIRAI: {
        id: 'MIRAI',
        name: 'Blood Sword',
        attackDmg: 32,
        attackRange: 88,
        attackDuration: 18,
        attackCooldown: 20,
        isRanged: false,
        icon: '🩸'
    }
};

export const SKILLS = {
    YANAGI_SKILL: { id: 'PHASE_BLINK', name: 'Phase Blink', cooldown: 190, icon: '⚡' },
    VERINA_SKILL: { id: 'PHOTOSYNTHESIS', name: 'Photosynthesis', cooldown: 200, icon: '🌸' },
    NICOLE_SKILL: { id: 'SUGAR_SLIDE', name: 'Sugar Slide', cooldown: 195, icon: '💼' },
    TRIGGER_SKILL: { id: 'SNIPER_STANCE', name: 'Sniper Stance', cooldown: 210, icon: '🎯' },
    VIVIAN_SKILL: { id: 'ABLOOM_BURST', name: 'Abloom Burst', cooldown: 210, icon: '🔮' },
    JOTARO_SKILL: { id: 'STAR_FINGER', name: 'Star Finger', cooldown: 200, icon: '👊' },
    GOKU_SKILL: { id: 'INSTANT_TRANSMISSION', name: 'Instant Transmission', cooldown: 210, icon: '🥋' },
    GIORNO_SKILL: { id: 'LIFE_TREE', name: 'Tree of Life', cooldown: 200, icon: '🐞' },
    NAOYA_SKILL: { id: 'PROJECTION_DASH', name: 'Projection Step', cooldown: 200, icon: '🎞️' },
    LUFFY_SKILL: { id: 'GIGANT_STOMP', name: 'Gigant Stomp', cooldown: 210, icon: '🍖' },
    GOJO_SKILL: { id: 'LAPSE_BLUE', name: 'Lapse Blue', cooldown: 210, icon: '🌀' },
    SUKUNA_SKILL: { id: 'KAMINO_FIRE_ARROW', name: 'Kamino: Fuga', cooldown: 210, icon: '🔥' },
    SAITAMA_SKILL: { id: 'CONSECUTIVE_PUNCHES', name: 'Consecutive Normal Punches', cooldown: 210, icon: '🥊' },
    MEGUMI_SKILL: { id: 'DIVINE_DOG', name: 'Divine Dog: Totality', cooldown: 220, icon: '🐺' },
    MIRAI_SKILL: { id: 'BLOOD_CRESCENT', name: 'Blood Crescent Wave', cooldown: 200, icon: '🩸' }
};

export class Projectile {
    constructor(ownerIndex, x, y, vx, vy, damage, color, radius = 8, type = 'standard') {
        this.ownerIndex = ownerIndex;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.damage = damage;
        this.color = color;
        this.radius = radius;
        this.life = type === 'shadow_dog' ? 220 : 160;
        this.isReflected = false;
        this.type = type; // 'standard', 'hollow_purple', 'fire_orb', 'shadow_dog', 'blood_crescent'
        this.animTimer = 0;
    }

    update(dt = 1, players = []) {
        // Divine Dog: Totality - Active homing & pursuit steering
        if (this.type === 'shadow_dog') {
            const owner = players.find(pl => pl && pl.index === this.ownerIndex);

            // Find closest living enemy target
            let bestTarget = null;
            let bestDist = Infinity;
            for (const pl of players) {
                if (!pl || pl.isDead) continue;
                if (pl.index === this.ownerIndex) continue;
                // In 2v2: do not target teammates
                if (owner && owner.teamId !== undefined && pl.teamId !== undefined && owner.teamId === pl.teamId) continue;
                const d = Math.hypot(pl.x - this.x, (pl.y - 15) - this.y);
                if (d < bestDist) {
                    bestDist = d;
                    bestTarget = pl;
                }
            }

            if (bestTarget) {
                const targetY = bestTarget.y - 15;
                const dx = bestTarget.x - this.x;
                const dy = targetY - this.y;
                const desiredAngle = Math.atan2(dy, dx);
                let currentAngle = Math.atan2(this.vy, this.vx);
                if (isNaN(currentAngle)) currentAngle = desiredAngle;

                let diffAngle = desiredAngle - currentAngle;
                while (diffAngle < -Math.PI) diffAngle += Math.PI * 2;
                while (diffAngle > Math.PI) diffAngle -= Math.PI * 2;

                // Agile tracking: rapid turn rate so the wolf actively chases and curves
                const turnRate = 0.16 * dt;
                const step = Math.sign(diffAngle) * Math.min(Math.abs(diffAngle), turnRate);
                const newAngle = currentAngle + step;

                // Aggressive chase speed, surge during pounce range
                const speed = bestDist < 140 ? 21 : 18;
                this.vx = Math.cos(newAngle) * speed;
                this.vy = Math.sin(newAngle) * speed;
            }

            // Shadow aura and dark smoke particles
            if (Math.random() < 0.6) {
                fx.spawnHitSparks(this.x, this.y, '#38bdf8', 1);
            }
            if (Math.random() < 0.3) {
                fx.spawnDash(this.x, this.y, '#0284c7');
            }
        }

        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.life -= dt;
        this.animTimer += dt;

        // Specialized particles per projectile type
        if (this.type === 'hollow_purple') {
            // Purple & blue/red unstable energy sparks
            if (Math.random() < 0.8) {
                const sparkColor = Math.random() < 0.5 ? '#a855f7' : (Math.random() < 0.5 ? '#3b82f6' : '#ef4444');
                fx.spawnHitSparks(this.x, this.y, sparkColor, 2);
            }
        } else if (this.type === 'fire_orb') {
            // Intense red/orange fireball flames
            if (Math.random() < 0.8) {
                const flameColor = Math.random() < 0.6 ? '#dc2626' : '#f97316';
                fx.spawnHitSparks(this.x, this.y, flameColor, 2);
            }
        } else if (this.type !== 'shadow_dog') {
            // Standard Spark tail
            if (Math.random() < 0.4) {
                fx.spawnHitSparks(this.x, this.y, this.color, 1);
            }
        }
    }

    draw(ctx) {
        ctx.save();

        if (this.type === 'hollow_purple') {
            // GOJO: HOLLOW PURPLE ORB (Vivid purple sphere with swirling red/blue cosmic aura)
            const r = this.radius;
            const pulse = Math.sin(this.animTimer * 0.25) * 3;

            // Outer purple aura glow
            ctx.shadowColor = '#c084fc';
            ctx.shadowBlur = 30;

            // Outer Red & Blue orbiting energy rings (Convergence of Reversal Red & Lapse Blue)
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.animTimer * 0.15);
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)'; // Red
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, r + 7 + pulse, 0, Math.PI);
            ctx.stroke();

            ctx.strokeStyle = 'rgba(59, 130, 246, 0.7)'; // Blue
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, r + 7 + pulse, Math.PI, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            // Main Hollow Purple core
            const purpleGrad = ctx.createRadialGradient(this.x, this.y, 2, this.x, this.y, r + 4);
            purpleGrad.addColorStop(0, '#ffffff');
            purpleGrad.addColorStop(0.35, '#c084fc');
            purpleGrad.addColorStop(0.7, '#7e22ce');
            purpleGrad.addColorStop(1, '#3b0764');

            ctx.fillStyle = purpleGrad;
            ctx.beginPath();
            ctx.arc(this.x, this.y, r + 2, 0, Math.PI * 2);
            ctx.fill();

            // Energy trailing particles
            const angle = Math.atan2(this.vy, this.vx);
            ctx.strokeStyle = '#a855f7';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - Math.cos(angle) * 32, this.y - Math.sin(angle) * 32);
            ctx.stroke();

        } else if (this.type === 'fire_orb') {
            // SUKUNA: CRIMSON FIRE ORB / FIREBALL (Surging red-orange flame)
            const r = this.radius;
            const pulse = Math.sin(this.animTimer * 0.3) * 3;

            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 35;

            // Outer flame spikes
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.animTimer * 0.2);
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
                const fa = i * (Math.PI / 4);
                const fr = r + (i % 2 === 0 ? 8 : 3) + pulse;
                const fx = Math.cos(fa) * fr;
                const fy = Math.sin(fa) * fr;
                if (i === 0) ctx.moveTo(fx, fy);
                else ctx.lineTo(fx, fy);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.restore();

            // Dense Crimson Flame Gradient Core
            const fireGrad = ctx.createRadialGradient(this.x, this.y, 2, this.x, this.y, r + 4);
            fireGrad.addColorStop(0, '#ffffff');
            fireGrad.addColorStop(0.3, '#fef08a');
            fireGrad.addColorStop(0.6, '#f97316');
            fireGrad.addColorStop(0.85, '#dc2626');
            fireGrad.addColorStop(1, '#7f1d1d');

            ctx.fillStyle = fireGrad;
            ctx.beginPath();
            ctx.arc(this.x, this.y, r + 2, 0, Math.PI * 2);
            ctx.fill();

            // Blazing flame tail
            const angle = Math.atan2(this.vy, this.vx);
            ctx.strokeStyle = '#ea580c';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - Math.cos(angle) * 36, this.y - Math.sin(angle) * 36);
            ctx.stroke();

        } else if (this.type === 'shadow_dog') {
            // MEGUMI: SHADOW DIVINE DOG TOTALITY (玉犬・渾) 🐺
            const angle = Math.atan2(this.vy, this.vx);
            const pulse = Math.sin(this.animTimer * 0.3) * 2;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(angle);
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 24;

            // 1. Dark Shadow Fur & Smoke Billowing Behind
            ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
            ctx.beginPath();
            ctx.moveTo(-12, -12);
            ctx.quadraticCurveTo(-28, -16 + pulse, -44, -6);
            ctx.quadraticCurveTo(-34, 0, -44, 6);
            ctx.quadraticCurveTo(-28, 16 - pulse, -12, 12);
            ctx.closePath();
            ctx.fill();

            // 2. Trailing Cursed Energy Wisps
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(-10, -6);
            ctx.quadraticCurveTo(-26, -10, -40, -4);
            ctx.moveTo(-10, 6);
            ctx.quadraticCurveTo(-26, 10, -40, 4);
            ctx.stroke();

            // 3. Main Muscular Wolf Head & Body (Dark Obsidian Shadow)
            ctx.fillStyle = '#090d16';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(26, -2);       // Upper snout
            ctx.lineTo(16, -9);       // Upper brow
            ctx.lineTo(2, -16);       // Left ear base
            ctx.lineTo(-4, -26);      // Left ear tip (spiked)
            ctx.lineTo(-10, -14);     // Back of left ear
            ctx.lineTo(-24, -6);      // Neck top
            ctx.lineTo(-24, 6);       // Neck bottom
            ctx.lineTo(-10, 14);      // Back of right ear
            ctx.lineTo(-4, 26);       // Right ear tip (spiked)
            ctx.lineTo(2, 16);        // Right ear base
            ctx.lineTo(16, 9);        // Lower brow
            ctx.lineTo(24, 4);        // Lower jaw
            ctx.lineTo(14, 0);        // Snarl mouth interior
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // 4. White Crest Marking on Forehead (Divine Dog Totality iconic symbol)
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(12, 0);
            ctx.lineTo(2, -4);
            ctx.lineTo(5, 0);
            ctx.lineTo(2, 4);
            ctx.closePath();
            ctx.fill();

            // 5. Razor Fangs (Snarl)
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.moveTo(23, -2);
            ctx.lineTo(21, 2);
            ctx.lineTo(19, -1);
            ctx.closePath();
            ctx.fill();

            // 6. Glowing Predatory Cyan Eyes
            ctx.fillStyle = '#38bdf8';
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(8, -6, 2.8, 0, Math.PI * 2);
            ctx.arc(8, 6, 2.8, 0, Math.PI * 2);
            ctx.fill();

            // Eye specular highlight
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(9, -6, 1.2, 0, Math.PI * 2);
            ctx.arc(9, 6, 1.2, 0, Math.PI * 2);
            ctx.fill();

            // 7. Pouncing Shadow Claws Extending Forward
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;
            // Left claw swipe
            ctx.beginPath();
            ctx.moveTo(4, -18);
            ctx.lineTo(18, -20);
            ctx.lineTo(24, -18);
            ctx.stroke();
            // Right claw swipe
            ctx.beginPath();
            ctx.moveTo(4, 18);
            ctx.lineTo(18, 20);
            ctx.lineTo(24, 18);
            ctx.stroke();

            ctx.restore();

        } else if (this.type === 'blood_crescent') {
            // MIRAI: BLOOD CRESCENT WAVE 🩸
            const angle = Math.atan2(this.vy, this.vx);
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(angle + Math.PI / 2);
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 30;

            // Crimson blade arc
            const r = this.radius + 6;
            ctx.fillStyle = '#dc2626';
            ctx.strokeStyle = '#fca5a5';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(0, 0, r, Math.PI * 0.15, Math.PI * 0.85, false);
            ctx.quadraticCurveTo(0, -r * 0.4, Math.cos(Math.PI * 0.15) * r, Math.sin(Math.PI * 0.15) * r);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Bloody particle glow core
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 4, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

        } else {
            // Standard Projectile
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 15;
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 3;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Projectile direction beam tail
            const angle = Math.atan2(this.vy, this.vx);
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - Math.cos(angle) * 22, this.y - Math.sin(angle) * 22);
            ctx.stroke();
        }

        ctx.restore();
    }
}

export class CombatResolver {
    constructor() {
        this.projectiles = [];
    }

    reset() {
        this.projectiles = [];
    }

    addProjectile(p) {
        this.projectiles.push(p);
    }

    updateProjectiles(dt = 1, arenaBounds, ...playerArgs) {
        let players = [];
        if (playerArgs.length === 1 && Array.isArray(playerArgs[0])) {
            players = playerArgs[0];
        } else {
            players = playerArgs.flat().filter(Boolean);
        }

        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];

            // Satoru Gojo: Infinity Barrier - Slow down enemy projectiles within 150px
            for (const target of players) {
                if (target && target.characterId === 'gojo' && target.index !== p.ownerIndex && !target.isStunned && !target.isDead) {
                    if (target.teamId !== undefined) {
                        const owner = players.find(pl => pl && pl.index === p.ownerIndex);
                        if (owner && owner.teamId === target.teamId) continue; // Same team
                    }
                    const distToGo = Math.hypot(target.x - p.x, target.y - p.y);
                    if (distToGo < 150) {
                        p.vx *= 0.70;
                        p.vy *= 0.70;
                        if (Math.random() < 0.25) {
                            fx.spawnHitSparks(p.x, p.y, '#0284c7', 1);
                        }
                    }
                }
            }

            p.update(dt, players);

            // Bounds check
            if (p.type === 'shadow_dog' && arenaBounds) {
                // Shadow wolf ricochets off boundary walls to stay hunting in the arena
                if (p.x < arenaBounds.minX + 25) { p.x = arenaBounds.minX + 25; p.vx = Math.abs(p.vx); }
                if (p.x > arenaBounds.maxX - 25) { p.x = arenaBounds.maxX - 25; p.vx = -Math.abs(p.vx); }
                if (p.y < arenaBounds.minY + 25) { p.y = arenaBounds.minY + 25; p.vy = Math.abs(p.vy); }
                if (p.y > arenaBounds.maxY - 25) { p.y = arenaBounds.maxY - 25; p.vy = -Math.abs(p.vy); }
                if (p.life <= 0) {
                    fx.spawnHitSparks(p.x, p.y, p.color, 8);
                    this.projectiles.splice(i, 1);
                }
            } else {
                if (p.x < arenaBounds.minX || p.x > arenaBounds.maxX ||
                    p.y < arenaBounds.minY || p.y > arenaBounds.maxY || p.life <= 0) {
                    fx.spawnHitSparks(p.x, p.y, p.color, 8);
                    this.projectiles.splice(i, 1);
                }
            }
        }
    }

    drawProjectiles(ctx) {
        this.projectiles.forEach(p => p.draw(ctx));
    }

    // --- RESOLVE COMBAT TRICKS & INTERACTIONS ---

    resolve(p1, p2, triggerScreenShake) {
        let players = [];
        let shake = triggerScreenShake;
        if (Array.isArray(p1)) {
            players = p1;
            shake = p2;
        } else {
            players = [p1, p2];
        }

        // Check combat between all enemy pairs (Friendly Fire OFF)
        for (let i = 0; i < players.length; i++) {
            for (let j = i + 1; j < players.length; j++) {
                const pA = players[i];
                const pB = players[j];
                if (!pA || !pB || pA.isDead || pB.isDead) continue;
                if (pA.teamId === pB.teamId) continue; // Teammates cannot harm each other!

                // 1. Blade Clash
                this.resolveBladeClash(pA, pB, shake);

                // 2. Melee Attacks
                this.resolveMeleeAttack(pA, pB, shake);
                this.resolveMeleeAttack(pB, pA, shake);

                // 3. Ultimates
                this.resolveUltimates(pA, pB, shake);
            }
        }

        // 4. Projectiles against all valid targets
        this.resolveProjectilesAgainstPlayers(players, shake);
    }

    resolveBladeClash(p1, p2, triggerScreenShake) {
        if (p1.isAttacking && p2.isAttacking && !p1.hasClashed && !p2.hasClashed) {
            const p1Weapon = WEAPONS[p1.characterId.toUpperCase()];
            const p2Weapon = WEAPONS[p2.characterId.toUpperCase()];

            if (p1Weapon && p2Weapon && !p1Weapon.isRanged && !p2Weapon.isRanged) {
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const dist = Math.hypot(dx, dy);
                const clashReach = (p1.attackReach + p2.attackReach) * 0.75;

                if (dist < clashReach) {
                    p1.hasClashed = true;
                    p2.hasClashed = true;
                    p1.isAttacking = false;
                    p2.isAttacking = false;

                    const midX = (p1.x + p2.x) / 2;
                    const midY = (p1.y + p2.y) / 2;

                    physics.applyKnockback(p1, -dx, -dy, 14);
                    physics.applyKnockback(p2, dx, dy, 14);

                    sound.playClash();
                    fx.spawnClashShockwave(midX, midY);
                    fx.addText(midX, midY - 30, '⚡ BLADE CLASH! ⚡', '#ffff00', 26);
                    if (triggerScreenShake) triggerScreenShake(12, 16);
                }
            }
        }
    }

    resolveMeleeAttack(attacker, defender, triggerScreenShake) {
        if (!attacker.isAttacking || attacker.attackHitRegistered) return;
        if (attacker.isShooting) return; // Projectiles handled separately

        const reach = attacker.attackReach;
        // Calculate attack point in facing / aim direction
        const aimAngle = attacker.aimAngle;
        const attackX = attacker.x + Math.cos(aimAngle) * (reach * 0.7);
        const attackY = attacker.y + Math.sin(aimAngle) * (reach * 0.7);

        const dist = Math.hypot(defender.x - attackX, defender.y - attackY);

        if (dist < defender.radius + reach * 0.5) {
            attacker.attackHitRegistered = true;
            const baseDmg = attacker.currentAttackDamage;

            // Check Defender Shield / Parry
            if (defender.isShielding) {
                // TRICK #1: PERFECT PARRY WINDOW (first 10 frames = ~0.16s of shield activation)
                if (defender.shieldTimer <= 10) {
                    // PERFECT PARRY SUCCESS!
                    defender.overdrive = Math.min(100, defender.overdrive + 25 * (defender.overdriveChargeRate || 1.0));
                    attacker.applyStun(45); // 0.75s Stun on attacker!
                    physics.applyKnockback(attacker, -Math.cos(aimAngle), -Math.sin(aimAngle), 11);

                    sound.playParry();
                    fx.spawnParryBurst(defender.x, defender.y, defender.color);
                    fx.addText(defender.x, defender.y - 40, '✨ PERFECT PARRY! ✨', '#00ffcc', 28);
                    triggerScreenShake(8, 14);
                    return;
                } else {
                    // Regular block (Chip damage only, no stun)
                    defender.takeDamage(baseDmg * 0.18);
                    physics.applyKnockback(defender, Math.cos(aimAngle), Math.sin(aimAngle), 4);
                    sound.playHit(false);
                    fx.spawnHitSparks(defender.x, defender.y, '#ffffff', 6);
                    fx.addText(defender.x, defender.y - 25, 'BLOCKED', '#00ffff', 18);
                    return;
                }
            }

            // Mirai Passive: Blood Lifesteal on all melee hits
            if (attacker.characterId === 'mirai') {
                const healRatio = (attacker.hp < attacker.maxHp * 0.35) ? 0.35 : 0.20;
                const healAmount = baseDmg * healRatio;
                attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
                fx.addText(attacker.x, attacker.y - 25, `+${Math.round(healAmount)} HP`, '#ef4444', 18);
            }

            // Direct unshielded hit!
            defender.takeDamage(baseDmg, false, attacker.x, attacker.y);
            attacker.overdrive = Math.min(100, attacker.overdrive + 14 * (attacker.overdriveChargeRate || 1.0));
            defender.applyStun(16);
            physics.applyKnockback(defender, Math.cos(aimAngle), Math.sin(aimAngle), 9);

            // Signature 3-hit / Stacking Passives for Melee Fighters
            attacker.signatureHits = (attacker.signatureHits || 0) + 1;
            const hitCount = attacker.signatureHits;

            if (attacker.characterId === 'saitama') {
                if (hitCount >= 3) {
                    defender.takeDamage(18);
                    defender.applyStun(20);
                    physics.applyKnockback(defender, Math.cos(aimAngle), Math.sin(aimAngle), 18);
                    fx.addText(defender.x, defender.y - 45, '👊 HEAVY PUNCH! -18', '#f59e0b', 26);
                    fx.spawnHitSparks(defender.x, defender.y, '#f59e0b', 24);
                    attacker.signatureHits = 0;
                } else {
                    fx.addText(attacker.x, attacker.y - 25, `👊 PUNCH [${hitCount}/3]`, '#f59e0b', 18);
                }
            } else if (attacker.characterId === 'megumi') {
                if (hitCount >= 3) {
                    defender.takeDamage(15);
                    defender.applyStun(22);
                    fx.addText(defender.x, defender.y - 45, '🐺 SHADOW MAUL! -15', '#38bdf8', 24);
                    fx.spawnHitSparks(defender.x, defender.y, '#38bdf8', 20);
                    attacker.signatureHits = 0;
                } else {
                    fx.addText(attacker.x, attacker.y - 25, `🐺 SHADOW [${hitCount}/3]`, '#38bdf8', 18);
                }
            } else if (attacker.characterId === 'mirai') {
                if (hitCount >= 3) {
                    defender.takeDamage(16);
                    defender.bleedTimer = 60;
                    fx.addText(defender.x, defender.y - 45, '🩸 BLOOD CURSE! -16', '#dc2626', 24);
                    fx.spawnHitSparks(defender.x, defender.y, '#ef4444', 22);
                    attacker.signatureHits = 0;
                } else {
                    fx.addText(attacker.x, attacker.y - 25, `🩸 BLOOD [${hitCount}/3]`, '#ef4444', 18);
                }
            } else if (attacker.characterId === 'naoya') {
                if (hitCount >= 3) {
                    defender.takeDamage(14);
                    defender.applyFrameFreeze(20);
                    fx.addText(defender.x, defender.y - 45, '🎞️ 24 FPS FREEZE! -14', '#a3e635', 24);
                    attacker.signatureHits = 0;
                } else {
                    fx.addText(attacker.x, attacker.y - 25, `🎞️ FRAME [${hitCount}/3]`, '#a3e635', 18);
                }
            } else if (attacker.characterId === 'goku') {
                if (hitCount >= 3) {
                    defender.takeDamage(14);
                    attacker.energy = Math.min(attacker.maxEnergy, attacker.energy + 25);
                    attacker.isBoosted = true;
                    attacker.boostTimer = 75;
                    physics.applyKnockback(defender, Math.cos(aimAngle), Math.sin(aimAngle), 14);
                    fx.addText(attacker.x, attacker.y - 45, '🥋 KAIOKEN BURST! -14', '#fbbf24', 24);
                    sound.playWallBounce();
                    attacker.signatureHits = 0;
                } else {
                    fx.addText(attacker.x, attacker.y - 25, `🥋 KI STACK [${hitCount}/3]`, '#fbbf24', 18);
                }
            } else if (attacker.characterId === 'yanagi') {
                if (hitCount >= 3) {
                    defender.takeDamage(14);
                    defender.applyStun(16);
                    defender.overdrive = Math.max(0, defender.overdrive - 10);
                    fx.addText(defender.x, defender.y - 45, '⚡ POLARITY DISCHARGE! -14', '#a78bfa', 24);
                    fx.spawnHitSparks(defender.x, defender.y, '#a78bfa', 16);
                    attacker.signatureHits = 0;
                } else {
                    fx.addText(attacker.x, attacker.y - 25, `⚡ POLARITY [${hitCount}/3]`, '#a78bfa', 18);
                }
            } else if (attacker.characterId === 'sukuna') {
                if (hitCount >= 3) {
                    defender.takeDamage(16);
                    defender.bleedTimer = 45;
                    defender.applyStun(16);
                    fx.addText(defender.x, defender.y - 45, '🩸 CLEAVE! -16', '#f43f5e', 24);
                    fx.spawnHitSparks(defender.x, defender.y, '#f43f5e', 20);
                    attacker.signatureHits = 0;
                } else {
                    fx.addText(attacker.x, attacker.y - 25, `🩸 DISMANTLE [${hitCount}/3]`, '#f43f5e', 18);
                }
            } else if (attacker.characterId === 'gojo') {
                if (hitCount >= 3) {
                    defender.takeDamage(15);
                    attacker.overdrive = Math.min(100, attacker.overdrive + 12 * (attacker.overdriveChargeRate || 1.0));
                    defender.applyStun(16);
                    fx.addText(defender.x, defender.y - 45, '⚡ BLACK FLASH! -15', '#0284c7', 24);
                    fx.spawnHitSparks(defender.x, defender.y, '#ef4444', 22);
                    attacker.signatureHits = 0;
                } else {
                    fx.addText(attacker.x, attacker.y - 25, `♾️ INFINITY [${hitCount}/3]`, '#0284c7', 18);
                }
            } else if (attacker.characterId === 'jotaro') {
                if (hitCount >= 3) {
                    defender.takeDamage(15);
                    defender.applyStun(16);
                    physics.applyKnockback(defender, Math.cos(aimAngle), Math.sin(aimAngle), 12);
                    fx.addText(defender.x, defender.y - 45, '👊 ORA ORA RUSH! -15', '#818cf8', 24);
                    fx.spawnHitSparks(defender.x, defender.y, '#818cf8', 18);
                    attacker.signatureHits = 0;
                } else {
                    fx.addText(attacker.x, attacker.y - 25, `👊 ORA [${hitCount}/3]`, '#818cf8', 18);
                }
            } else if (attacker.characterId === 'luffy') {
                if (hitCount >= 3) {
                    defender.takeDamage(15);
                    defender.applyStun(16);
                    physics.applyKnockback(defender, Math.cos(aimAngle), Math.sin(aimAngle), 15);
                    fx.addText(defender.x, defender.y - 45, '🍖 GOMU GOMU BAZOOKA! -15', '#ef4444', 24);
                    fx.spawnHitSparks(defender.x, defender.y, '#ef4444', 18);
                    attacker.signatureHits = 0;
                } else {
                    fx.addText(attacker.x, attacker.y - 25, `🍖 GOMU [${hitCount}/3]`, '#ef4444', 18);
                }
            } else if (attacker.characterId === 'giorno') {
                if (hitCount >= 3) {
                    defender.takeDamage(14);
                    defender.sensoryOverloadTimer = 90;
                    fx.addText(defender.x, defender.y - 45, '🐞 SENSORY OVERLOAD! -14', '#facc15', 24);
                    fx.spawnHitSparks(defender.x, defender.y, '#facc15', 18);
                    attacker.signatureHits = 0;
                } else {
                    fx.addText(attacker.x, attacker.y - 25, `🐞 MUDA [${hitCount}/3]`, '#facc15', 18);
                }
            }

            sound.playHit(true);
            fx.spawnHitSparks(defender.x, defender.y, attacker.color, 18);
            triggerScreenShake(8, 12);
        }
    }

    resolveProjectilesAgainstPlayers(p1, p2, triggerScreenShake) {
        let players = [];
        let shake = triggerScreenShake;
        if (Array.isArray(p1)) {
            players = p1;
            shake = p2;
        } else {
            players = [p1, p2];
        }

        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            const attacker = players.find(p => p && p.index === proj.ownerIndex) || players[proj.ownerIndex] || null;

            for (const defender of players) {
                if (!defender || defender.isDead) continue;
                // Friendly Fire OFF
                if (attacker && defender.teamId === attacker.teamId) continue;
                if (defender.index === proj.ownerIndex) continue;

                // Capsule hitbox covering entire character body from head to toe
                const targetY = Math.max(defender.y - 55, Math.min(defender.y + 30, proj.y));
                const dist = Math.hypot(defender.x - proj.x, targetY - proj.y);

                if (dist < defender.radius + proj.radius) {
                    // Check if defender parries projectile!
                    if (defender.isShielding) {
                        if (defender.shieldTimer <= 10 && !proj.isReflected) {
                            // TRICK #1: REFLECTED VIA PERFECT PARRY!
                            proj.isReflected = true;
                            proj.ownerIndex = defender.index;
                            proj.color = defender.color;
                            proj.vx = -proj.vx * 1.35;
                            proj.vy = -proj.vy * 1.35;
                            proj.damage *= 1.3;
                            defender.overdrive = Math.min(100, defender.overdrive + 20 * (defender.overdriveChargeRate || 1.0));

                            sound.playParry();
                            fx.spawnParryBurst(proj.x, proj.y, defender.color);
                            fx.addText(defender.x, defender.y - 35, '⚡ REFLECTED! ⚡', '#00ffcc', 24);
                            if (shake) shake(6, 10);
                            break;
                        } else {
                            // Absorbed by shield
                            defender.takeDamage(proj.damage * 0.15);
                            fx.spawnHitSparks(proj.x, proj.y, '#ffffff', 8);
                            sound.playHit(false);
                            this.projectiles.splice(i, 1);
                            break;
                        }
                    }

                    // Direct hit!
                    let dmg = proj.damage;
                    if (attacker && attacker.hasLockOn) {
                        dmg *= 1.4;
                        attacker.hasLockOn = false;
                        fx.addText(defender.x, targetY - 45, '🎯 LOCK-ON CRIT!', '#38bdf8', 22);
                    }
                    defender.takeDamage(dmg, false, proj.x, proj.y);
                    if (attacker) {
                        attacker.overdrive = Math.min(100, attacker.overdrive + 12 * (attacker.overdriveChargeRate || 1.0));
                    }
                    defender.applyStun(14);
                    physics.applyKnockback(defender, proj.vx * 0.25, proj.vy * 0.25, 5);

                    // Special projectile effects
                    if (proj.type === 'blood_crescent') {
                        defender.bleedTimer = 60;
                        fx.addText(defender.x, targetY - 45, '🩸 HEMORRHAGE!', '#ef4444', 22);
                        if (attacker && attacker.characterId === 'mirai') {
                            const healAmount = dmg * 0.45;
                            attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
                            fx.addText(attacker.x, attacker.y - 25, `+${Math.round(healAmount)} HP`, '#ef4444', 20);
                        }
                    } else if (proj.type === 'shadow_dog') {
                        defender.applyStun(55); // 0.95s Stun lock
                        fx.addText(defender.x, targetY - 45, '🐺 SHADOW POUNCE & PIN!', '#38bdf8', 26);
                        fx.spawnHitSparks(defender.x, targetY, '#38bdf8', 28);
                        fx.spawnHitSparks(defender.x, targetY, '#ffffff', 12);
                        if (sound.playWolfBite) sound.playWolfBite();
                        else sound.playHit(true);
                        if (typeof triggerScreenShake === 'function') triggerScreenShake(9);
                    }

                    // Ranged Signature 3-hit passives
                    if (attacker) {
                        attacker.signatureHits = (attacker.signatureHits || 0) + 1;
                        const rHitCount = attacker.signatureHits;

                        if (attacker.characterId === 'velina') {
                            if (rHitCount >= 3) {
                                attacker.hp = Math.min(attacker.maxHp, attacker.hp + 18);
                                defender.applyStun(16);
                                fx.addText(attacker.x, attacker.y - 45, '🌸 BLOOM HEAL +18!', '#34d399', 24);
                                attacker.signatureHits = 0;
                            } else {
                                fx.addText(attacker.x, attacker.y - 25, `🌸 FLORA [${rHitCount}/3]`, '#34d399', 18);
                            }
                        } else if (attacker.characterId === 'nicole') {
                            if (rHitCount >= 3) {
                                defender.takeDamage(14);
                                physics.applyKnockback(defender, proj.vx * 0.4, proj.vy * 0.4, 8);
                                fx.addText(defender.x, defender.y - 45, '💼 SUGAR BOMB! -14', '#f472b6', 24);
                                attacker.signatureHits = 0;
                            } else {
                                fx.addText(attacker.x, attacker.y - 25, `💼 SUGAR [${rHitCount}/3]`, '#f472b6', 18);
                            }
                        } else if (attacker.characterId === 'trigger') {
                            if (rHitCount >= 3) {
                                attacker.hasLockOn = true;
                                fx.addText(attacker.x, attacker.y - 45, '🎯 LOCK-ON CRIT READY!', '#38bdf8', 24);
                                attacker.signatureHits = 0;
                            } else {
                                fx.addText(attacker.x, attacker.y - 25, `🎯 LOCK-ON [${rHitCount}/3]`, '#38bdf8', 18);
                            }
                        } else if (attacker.characterId === 'vivian') {
                            if (rHitCount >= 3) {
                                defender.takeDamage(14);
                                defender.curseTimer = 90;
                                fx.addText(defender.x, defender.y - 45, '🔮 BANSHEE CURSE! -14', '#c084fc', 24);
                                attacker.signatureHits = 0;
                            } else {
                                fx.addText(attacker.x, attacker.y - 25, `🔮 FEATHER [${rHitCount}/3]`, '#c084fc', 18);
                            }
                        }
                    }

                    sound.playHit(true);
                    fx.spawnHitSparks(proj.x, proj.y, proj.color, 18);
                    const atkColor = attacker ? attacker.color : proj.color;
                    fx.addText(defender.x, targetY - 20, `-${Math.round(dmg)}`, atkColor, 20);
                    if (shake) shake(7, 10);
                    this.projectiles.splice(i, 1);
                    break;
                }
            }
        }
    }

    resolveUltimates(p1, p2, triggerScreenShake) {
        [ { user: p1, target: p2 }, { user: p2, target: p1 } ].forEach(({ user, target }) => {
            if (user.isUsingUltimate && user.ultimateTimer > 15 && user.ultimateTimer < 65) {
                const userWeapon = WEAPONS[user.characterId.toUpperCase()];
                const normalDmg = userWeapon ? userWeapon.attackDmg : 30;
                // Ultimate damage = 3.5x normal attack damage (distributed over 50 active frames)
                const ultDmgPerFrame = (normalDmg * 3.5) / 50;

                if (user.characterId === 'yanagi') {
                    // YANAGI: LIGHTNING CANNON BEAM
                    const facingDir = Math.cos(user.aimAngle) >= 0 ? 1 : -1;
                    const forwardDist = (target.x - user.x) * facingDir;
                    const verticalDist = Math.abs(target.y - user.y);
                    const beamLen = 1500;
                    const halfThickness = 28; // Matches exact visual lightning beam width

                    // Damage applied only when target is inside beam path:
                    // 1. Must be ahead of cannon muzzle (>= 40px forward)
                    // 2. Within beam reach (<= 1500px)
                    // 3. Distance to beam axis <= target radius + beam half-thickness
                    if (forwardDist >= 40 && forwardDist <= beamLen + target.radius && verticalDist <= target.radius + halfThickness) {
                        target.takeDamage(ultDmgPerFrame, true, user.x, user.y);
                        target.applyStun(8);
                        physics.applyKnockback(target, facingDir, 0, 1.5);
                        fx.spawnHitSparks(target.x, target.y, user.color, 4);
                        triggerScreenShake(2, 4);
                    }
                } else if (user.characterId === 'velina') {
                    // VELINA: TORNADO / RADIAL BLAST
                    const stormRadius = 80 + user.ultimateTimer * 5;
                    const dist = Math.hypot(target.x - user.x, target.y - user.y);
                    if (dist < target.radius + stormRadius) {
                        target.takeDamage(ultDmgPerFrame, true, user.x, user.y);
                        target.applyStun(8);
                        const angleToTarget = Math.atan2(target.y - user.y, target.x - user.x);
                        physics.applyKnockback(target, Math.cos(angleToTarget), Math.sin(angleToTarget), 1.5);
                        fx.spawnHitSparks(target.x, target.y, user.color, 4);
                        triggerScreenShake(3, 5);
                    }
                } else if (user.characterId === 'nicole') {
                    // NICOLE: GRAVITATIONAL SINGULARITY (BLACK HOLE)
                    const facingDir = Math.cos(user.aimAngle) >= 0 ? 1 : -1;
                    const hX = user.x + facingDir * 320;
                    const hY = user.y;
                    const dist = Math.hypot(target.x - hX, target.y - hY);
                    // Gravitational pull radius aligned with accretion disk (120px)
                    if (dist < target.radius + 95) {
                        // Sucking pull force towards black hole
                        const pullAngle = Math.atan2(hY - target.y, hX - target.x);
                        physics.applyKnockback(target, Math.cos(pullAngle), Math.sin(pullAngle), 2.2);
                        target.takeDamage(ultDmgPerFrame, true, user.x, user.y);
                        target.applyStun(10);
                        fx.spawnHitSparks(target.x, target.y, '#ec4899', 3);
                        triggerScreenShake(2, 4);
                    }
                } else if (user.characterId === 'trigger') {
                    // TRIGGER: PIERCING SNIPER RAILGUN
                    const facingDir = Math.cos(user.aimAngle) >= 0 ? 1 : -1;
                    const forwardDist = (target.x - user.x) * facingDir;
                    const verticalDist = Math.abs(target.y - user.y);
                    const beamLen = 1600;
                    const halfThickness = 18; // Precise armor-piercing projectile radius

                    if (forwardDist >= 35 && forwardDist <= beamLen + target.radius && verticalDist <= target.radius + halfThickness) {
                        target.takeDamage(ultDmgPerFrame, true, user.x, user.y);
                        target.applyStun(12);
                        physics.applyKnockback(target, facingDir, 0, 2.5);
                        fx.spawnHitSparks(target.x, target.y, '#38bdf8', 5);
                        triggerScreenShake(3, 6);
                    }
                } else if (user.characterId === 'vivian') {
                    // VIVIAN: BANSHEE BLOOM (ETHER FEATHER STORM) - Extended range to 500px
                    const stormRadius = 460;
                    const dist = Math.hypot(target.x - user.x, target.y - user.y);
                    if (dist < target.radius + stormRadius) {
                        target.takeDamage(ultDmgPerFrame, true, user.x, user.y);
                        target.applyStun(8);
                        target.vx *= 0.7; // Ether slow
                        target.vy *= 0.7;
                        fx.spawnHitSparks(target.x, target.y, '#c084fc', 4);
                        triggerScreenShake(2, 4);
                    }
                } else if (user.characterId === 'jotaro') {
                    // JOTARO: THE WORLD TIME STOP + ORA ORA RUSH!
                    target.applyStun(20);
                    target.vx = 0;
                    target.vy = 0;
                    // Rush close to target if within range
                    const dist = Math.hypot(target.x - user.x, target.y - user.y);
                    if (dist < 220) {
                        target.takeDamage(ultDmgPerFrame, true, user.x, user.y);
                        physics.applyKnockback(target, Math.cos(user.aimAngle), Math.sin(user.aimAngle), 1.8);
                        fx.spawnHitSparks(target.x, target.y, '#6366f1', 6);
                        triggerScreenShake(4, 7);
                    }
                } else if (user.characterId === 'goku') {
                    // GOKU: SUPER SAIYAN KAMEHAMEHA!
                    const facingDir = Math.cos(user.aimAngle) >= 0 ? 1 : -1;
                    const forwardDist = (target.x - user.x) * facingDir;
                    const verticalDist = Math.abs(target.y - user.y);
                    const beamLen = 1500;
                    const halfThickness = 38; // Golden Kamehameha beam half-thickness (76px width)

                    // Damage applied only when target is inside Kamehameha beam ahead
                    if (forwardDist >= 40 && forwardDist <= beamLen + target.radius && verticalDist <= target.radius + halfThickness) {
                        target.takeDamage(ultDmgPerFrame, true, user.x, user.y);
                        target.applyStun(10);
                        physics.applyKnockback(target, facingDir, 0, 2.0);
                        fx.spawnHitSparks(target.x, target.y, '#fbbf24', 6);
                        triggerScreenShake(3, 6);
                    }
                } else if (user.characterId === 'giorno') {
                    // GIORNO: RETURN TO ZERO (GER) + 7-PAGE MUDA!
                    target.applyStun(25);
                    target.vx *= 0.2;
                    target.vy *= 0.2;
                    const dist = Math.hypot(target.x - user.x, target.y - user.y);
                    if (dist < 240) {
                        target.takeDamage(ultDmgPerFrame, true, user.x, user.y);
                        const angle = Math.atan2(target.y - user.y, target.x - user.x);
                        physics.applyKnockback(target, Math.cos(angle), Math.sin(angle), 1.6);
                        fx.spawnHitSparks(target.x, target.y, '#eab308', 5);
                        triggerScreenShake(3, 6);
                    }
                } else if (user.characterId === 'naoya') {
                    // NAOYA: MACH 3 RAPID SLASHES (PROJECTION SORCERY 10 FPS)
                    // 1. Damage boosted 1.25x: total dmg = (normalDmg * 3.5) * 1.25
                    // 2. 10 FPS cadence: 1 hit every 5 frames = 10 full hits across 50 ult frames
                    const barrageRadius = 350;
                    const dist = Math.hypot(target.x - user.x, target.y - user.y);
                    const hitIndex = Math.floor((user.ultimateTimer - 15) / 5); // 0 to 9 corresponds to 10 hits
                    if (hitIndex >= 0 && hitIndex < 10 && hitIndex > (user.lastNaoyaHitIndex ?? -1)) {
                        user.lastNaoyaHitIndex = hitIndex;
                        if (dist < target.radius + barrageRadius) {
                            // Evenly split total dmg x1.25 across 10 hits -> receives full 100% dmg x1.25
                            const totalNaoyaUltDmg = (normalDmg * 3.5) * 1.25;
                            const perHitDmg = totalNaoyaUltDmg / 10;
                            target.takeDamage(perHitDmg, true, user.x, user.y);
                            target.applyStun(10);
                            target.frameFrozenTimer = 10;
                            const dashAngle = user.ultimateTimer * 0.8;
                            physics.applyKnockback(target, Math.cos(dashAngle), Math.sin(dashAngle), 2.0);
                            fx.spawnHitSparks(target.x, target.y, '#a3e635', 6);
                            sound.playSlash(true);
                            triggerScreenShake(2, 3);
                            if (hitIndex === 1) {
                                fx.addText(target.x, target.y - 45, '🎞️ 10 FPS FRAME FREEZE! 🎞️', '#a3e635', 24, 45);
                            }
                        }
                    }
                } else if (user.characterId === 'luffy') {
                    // LUFFY: GOMU GOMU NO BAJRANG GUN (GIANT NIKA HAKI FIST)
                    const facingDir = Math.cos(user.aimAngle) >= 0 ? 1 : -1;
                    const strikeX = user.x + facingDir * 180;
                    const strikeY = user.y;
                    const dist = Math.hypot(target.x - strikeX, target.y - strikeY);
                    if (dist < target.radius + 320) {
                        target.takeDamage(ultDmgPerFrame * 1.1, true, user.x, user.y);
                        target.applyStun(12);
                        physics.applyKnockback(target, facingDir * 0.8, 1.2, 3.2); // Downward & forward slam
                        fx.spawnHitSparks(target.x, target.y, '#ef4444', 6);
                        triggerScreenShake(5, 8);
                    }
                } else if (user.characterId === 'gojo') {
                    // GOJO: DOMAIN EXPANSION - UNLIMITED VOID
                    const domainRadius = 450;
                    const dist = Math.hypot(target.x - user.x, target.y - user.y);
                    if (dist < target.radius + domainRadius) {
                        target.takeDamage(ultDmgPerFrame, true, user.x, user.y);
                        target.applyStun(12);
                        target.vx *= 0.1;
                        target.vy *= 0.1;
                        fx.spawnHitSparks(target.x, target.y, '#0284c7', 5);
                        triggerScreenShake(3, 6);
                    }
                } else if (user.characterId === 'sukuna') {
                    // SUKUNA: DOMAIN EXPANSION - MALEVOLENT SHRINE
                    const shrineRadius = 420;
                    const dist = Math.hypot(target.x - user.x, target.y - user.y);
                    if (dist < target.radius + shrineRadius) {
                        target.takeDamage(ultDmgPerFrame, true, user.x, user.y);
                        target.applyStun(10);
                        const sliceAngle = (user.ultimateTimer * 0.7) % (Math.PI * 2);
                        physics.applyKnockback(target, Math.cos(sliceAngle), Math.sin(sliceAngle), 1.8);
                        fx.spawnHitSparks(target.x, target.y, '#f43f5e', 6);
                        triggerScreenShake(4, 7);
                    }
                } else if (user.characterId === 'saitama') {
                    // SAITAMA: SERIOUS SERIES - SERIOUS PUNCH! 👊
                    // 1. Instant Blink / Teleport in front of target
                    if (!user.saitamaTeleported) {
                        const facingTargetDir = (target.x >= user.x) ? 1 : -1;
                        const blinkDist = 58;
                        const destX = target.x - (facingTargetDir * blinkDist);
                        const destY = target.y;

                        // Departure shockwave & dash trail
                        fx.spawnDash(user.x, user.y, '#f59e0b');
                        fx.spawnClashShockwave(user.x, user.y);
                        if (user.afterimages) {
                            user.afterimages.push({ x: user.x, y: user.y, radius: user.radius, color: '#f59e0b', alpha: 1, life: 30, maxLife: 30 });
                        }

                        // Teleport directly in front of target facing them
                        user.x = destX;
                        user.y = destY;
                        user.vx = 0;
                        user.vy = 0;
                        user.aimAngle = (facingTargetDir === 1) ? 0 : Math.PI;

                        // Clamp within arena bounds
                        if (typeof window !== 'undefined' && window.game && window.game.bounds) {
                            const b = window.game.bounds;
                            user.x = Math.max(b.minX + 45, Math.min(b.maxX - 45, user.x));
                            user.y = Math.max(b.minY + 45, Math.min(b.maxY - 45, user.y));
                        }

                        // Arrival shockwave, sparks, and sound
                        fx.spawnClashShockwave(user.x, user.y);
                        fx.spawnHitSparks(user.x, user.y, '#f59e0b', 16);
                        fx.addText(user.x, user.y - 45, '⚡ INSTANT BLINK! ⚡', '#f59e0b', 24, 25);
                        if (sound && sound.playPhaseBlink) sound.playPhaseBlink();

                        user.saitamaTeleported = true;
                        user.saitamaTarget = target;
                    }

                    // Pre-punch: Keep target pinned/frozen while Saitama winds up
                    if (user.ultimateTimer < 22) {
                        target.applyStun(15);
                        target.vx *= 0.1;
                        target.vy *= 0.1;
                    }

                    // 2. Deliver the ONE massive Serious Punch at frame 22
                    if (user.ultimateTimer >= 22 && !user.saitamaPunchDelivered) {
                        user.saitamaPunchDelivered = true;
                        const punchDir = Math.cos(user.aimAngle) >= 0 ? 1 : -1;
                        const punchDmg = 125; // Massive single strike

                        // Direct hit to primary target
                        target.takeDamage(punchDmg, true, user.x, user.y);
                        target.applyStun(60); // 1.0 second stun! (60 frames at 60fps)
                        physics.applyKnockback(target, punchDir * 5.2, -1.2, 5.5);

                        // Explosive kinetic effects
                        fx.spawnDeathBurst(target.x, target.y, '#f59e0b');
                        fx.spawnClashShockwave(target.x, target.y);
                        fx.spawnHitSparks(target.x, target.y, '#ffffff', 28);
                        fx.addText(target.x, target.y - 50, '👊 DEATH! 👊', '#f59e0b', 34, 60);

                        sound.playHit(true);
                        if (sound.playExplosion) sound.playExplosion();
                        triggerScreenShake(10, 22);

                        // Splash collateral shockwave to any nearby enemies in 2v2
                        if (typeof window !== 'undefined' && window.game && window.game.players) {
                            window.game.players.forEach(other => {
                                if (other && other !== user && other !== target && !other.isDead && other.teamId !== user.teamId) {
                                    const distToPunch = Math.hypot(other.x - user.x, other.y - user.y);
                                    if (distToPunch < 180) {
                                        other.takeDamage(65, true, user.x, user.y);
                                        other.applyStun(35);
                                        physics.applyKnockback(other, punchDir * 3.5, -1.0, 4.0);
                                        fx.spawnHitSparks(other.x, other.y, '#f59e0b', 12);
                                    }
                                }
                            });
                        }
                    }
                } else if (user.characterId === 'megumi') {
                    // MEGUMI: EIGHT-HANDLED SWORD DIVERGENT SILA MAHORAGA CLEAVE! ⚔️
                    const facingDir = Math.cos(user.aimAngle) >= 0 ? 1 : -1;
                    const strikeX = user.x + facingDir * 160;
                    const dist = Math.hypot(target.x - strikeX, target.y - user.y);
                    if (dist < target.radius + 360) {
                        target.takeDamage(ultDmgPerFrame * 1.15, true, user.x, user.y);
                        target.applyStun(14);
                        physics.applyKnockback(target, facingDir * 1.5, -1.0, 3.2);
                        fx.spawnHitSparks(target.x, target.y, '#38bdf8', 7);
                        triggerScreenShake(4, 7);
                    }
                } else if (user.characterId === 'mirai') {
                    // MIRAI: BLOOD CATACLYSM STRIKE (COLOSSAL BLOOD BLADE) 🩸
                    const dist = Math.hypot(target.x - user.x, target.y - user.y);
                    if (dist < target.radius + 350) {
                        target.takeDamage(ultDmgPerFrame * 1.15, true, user.x, user.y);
                        target.applyStun(12);
                        physics.applyKnockback(target, 0, 1.2, 3.2);
                        fx.spawnHitSparks(target.x, target.y, '#ef4444', 8);
                        // Lifesteal on ultimate
                        user.hp = Math.min(user.maxHp, user.hp + (ultDmgPerFrame * 0.25));
                        triggerScreenShake(4, 8);
                    }
                }
            }
        });
    }

    distToSegment(px, py, x1, y1, x2, y2) {
        const l2 = Math.hypot(x2 - x1, y2 - y1) ** 2;
        if (l2 === 0) return Math.hypot(px - x1, py - y1);
        let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
        t = Math.max(0, Math.min(1, t));
        return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
    }
}

export const combat = new CombatResolver();
