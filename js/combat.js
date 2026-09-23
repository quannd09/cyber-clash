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
    VERINA: {
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
        name: 'Serious Combat Fist',
        attackDmg: 45,
        attackRange: 105,
        attackDuration: 16,
        attackCooldown: 18,
        isRanged: false,
        icon: '🥊'
    },
    TST26: {
        id: 'TST26',
        name: 'Maid Precision Protocol',
        attackDmg: 38,
        attackRange: 560,
        attackDuration: 17,
        attackCooldown: 19,
        isRanged: true,
        icon: '🎀'
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
    SAITAMA_SKILL: { id: 'CONSECUTIVE_PUNCHES', name: 'Consecutive Normal Punches', cooldown: 170, icon: '🥊' },
    TST26_SKILL: { id: 'MAID_PURGE', name: 'Absolute Sanitization Sweep', cooldown: 175, icon: '🎀' }
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
        this.life = 160;
        this.isReflected = false;
        this.type = type; // 'standard', 'hollow_purple', 'fire_orb'
        this.animTimer = 0;
    }

    update(dt = 1) {
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
        } else if (this.type === 'projection_frame') {
            // Lime green 24 FPS film shutter sparks
            if (Math.random() < 0.7) {
                const sparkColor = Math.random() < 0.5 ? '#a3e635' : '#bef264';
                fx.spawnHitSparks(this.x, this.y, sparkColor, 1);
            }
        } else if (this.type === 'photonic_flora') {
            // Emerald & mint floral glowing petal sparks
            if (Math.random() < 0.75) {
                const sparkColor = Math.random() < 0.6 ? '#34d399' : '#a7f3d0';
                fx.spawnHitSparks(this.x, this.y, sparkColor, 1);
            }
        } else {
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
            // SUKUNA: CRIMSON FIRE ORB / FIREBALL (Swirling crimson flame sphere)
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

        } else if (this.type === 'projection_frame') {
            // NAOYA: 24 FPS PROJECTION FRAME BLADE / SORCERY FILM WAVE
            const r = this.radius;
            const angle = Math.atan2(this.vy, this.vx);

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(angle);

            ctx.shadowColor = '#a3e635';
            ctx.shadowBlur = 24;

            // Translucent glowing projection glass frame
            ctx.fillStyle = 'rgba(163, 230, 53, 0.32)';
            ctx.strokeStyle = '#a3e635';
            ctx.lineWidth = 3;
            ctx.strokeRect(-r * 1.5, -r, r * 3, r * 2);
            ctx.fillRect(-r * 1.5, -r, r * 3, r * 2);

            // Cinema film sprocket holes along the top and bottom edge
            ctx.fillStyle = '#ffffff';
            for (let i = -1; i <= 1; i++) {
                ctx.fillRect(i * (r * 0.8) - 2, -r + 1, 4, 3);
                ctx.fillRect(i * (r * 0.8) - 2, r - 4, 4, 3);
            }

            // High-speed center motion blade
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(-r * 1.8, 0);
            ctx.lineTo(r * 1.8, 0);
            ctx.stroke();

            ctx.restore();

        } else if (this.type === 'photonic_flora') {
            // VERINA: PHOTONIC FLORA BLOSSOM (Glowing emerald-mint flower petal energy sphere)
            const r = this.radius;
            const pulse = Math.sin(this.animTimer * 0.3) * 2;

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.animTimer * 0.12);

            ctx.shadowColor = '#34d399';
            ctx.shadowBlur = 24;

            // 5 Orbiting Floral Petals
            ctx.fillStyle = 'rgba(52, 211, 153, 0.75)';
            ctx.strokeStyle = '#a7f3d0';
            ctx.lineWidth = 1.8;
            for (let i = 0; i < 5; i++) {
                const angle = i * (Math.PI * 2 / 5);
                const px = Math.cos(angle) * (r + 4 + pulse);
                const py = Math.sin(angle) * (r + 4 + pulse);
                ctx.beginPath();
                ctx.arc(px, py, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }

            // Central radiant flora core
            const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, r + 2);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.35, '#a7f3d0');
            grad.addColorStop(0.75, '#34d399');
            grad.addColorStop(1, '#059669');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();

            // Beam tail
            const angle = Math.atan2(this.vy, this.vx);
            ctx.strokeStyle = '#34d399';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - Math.cos(angle) * 28, this.y - Math.sin(angle) * 28);
            ctx.stroke();

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

    updateProjectiles(dt = 1, arenaBounds, p1 = null, p2 = null) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];

            // Satoru Gojo: Infinity Barrier - Slows opponent projectiles within 150px
            if (p1 && p2) {
                const target = (p.ownerIndex === 0) ? p2 : p1;
                if (target && target.characterId === 'gojo' && !target.isStunned && !target.isDead) {
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

            p.update(dt);

            // Bounds check
            if (p.x < arenaBounds.minX || p.x > arenaBounds.maxX ||
                p.y < arenaBounds.minY || p.y > arenaBounds.maxY || p.life <= 0) {
                fx.spawnHitSparks(p.x, p.y, p.color, 8);
                this.projectiles.splice(i, 1);
            }
        }
    }

    drawProjectiles(ctx) {
        this.projectiles.forEach(p => p.draw(ctx));
    }

    // --- RESOLVE COMBAT TRICKS & INTERACTIONS ---

    resolve(p1, p2, triggerScreenShake) {
        // 1. Check Blade Clash (Both attacking with melee active)
        if (p1.isAttacking && p2.isAttacking && !p1.hasClashed && !p2.hasClashed) {
            const p1Weapon = WEAPONS[p1.characterId.toUpperCase()];
            const p2Weapon = WEAPONS[p2.characterId.toUpperCase()];

            // If neither is in projectile mode
            if (!p1Weapon.isRanged && !p2Weapon.isRanged) {

                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const dist = Math.hypot(dx, dy);
                const clashReach = (p1.attackReach + p2.attackReach) * 0.75;

                if (dist < clashReach) {
                    // TRICK #4: BLADE CLASH TRIGGERED!
                    p1.hasClashed = true;
                    p2.hasClashed = true;
                    p1.isAttacking = false;
                    p2.isAttacking = false;

                    const midX = (p1.x + p2.x) / 2;
                    const midY = (p1.y + p2.y) / 2;

                    // Push both players backwards with massive recoil
                    physics.applyKnockback(p1, -dx, -dy, 14);
                    physics.applyKnockback(p2, dx, dy, 14);

                    sound.playClash();
                    fx.spawnClashShockwave(midX, midY);
                    fx.addText(midX, midY - 30, '⚡ BLADE CLASH! ⚡', '#ffff00', 26);
                    triggerScreenShake(12, 16);
                    return;
                }
            }
        }

        // 2. Check P1 Melee Attack hitting P2
        this.resolveMeleeAttack(p1, p2, triggerScreenShake);

        // 3. Check P2 Melee Attack hitting P1
        this.resolveMeleeAttack(p2, p1, triggerScreenShake);

        // 4. Check Projectiles hitting Players
        this.resolveProjectilesAgainstPlayers(p1, p2, triggerScreenShake);

        // 5. Check Ultimate Overdrive Beams
        this.resolveUltimates(p1, p2, triggerScreenShake);
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

            // Direct unshielded hit!
            defender.takeDamage(baseDmg, false, attacker.x, attacker.y);
            attacker.overdrive = Math.min(100, attacker.overdrive + 14 * (attacker.overdriveChargeRate || 1.0));
            defender.applyStun(16);
            physics.applyKnockback(defender, Math.cos(aimAngle), Math.sin(aimAngle), 9);

            // Signature 3-hit / Stacking Passives for Melee Fighters
            attacker.signatureHits = (attacker.signatureHits || 0) + 1;
            const hitCount = attacker.signatureHits;

            if (attacker.characterId === 'naoya') {
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
            } else if (attacker.characterId === 'saitama') {
                if (hitCount >= 3) {
                    defender.takeDamage(28);
                    defender.applyStun(22);
                    physics.applyKnockback(defender, Math.cos(aimAngle), Math.sin(aimAngle), 22);
                    fx.addText(defender.x, defender.y - 45, '💥 CONSECUTIVE NORMAL PUNCHES! -28', '#eab308', 26);
                    fx.spawnHitSparks(defender.x, defender.y, '#eab308', 28);
                    attacker.signatureHits = 0;
                } else {
                    fx.addText(attacker.x, attacker.y - 25, `🥊 SERIOUS [${hitCount}/3]`, '#eab308', 18);
                }
            } else if (attacker.characterId === 'tst26') {
                if (hitCount >= 3) {
                    defender.takeDamage(24);
                    defender.applyStun(18);
                    attacker.hp = Math.min(attacker.maxHp, attacker.hp + 20);
                    physics.applyKnockback(defender, Math.cos(aimAngle), Math.sin(aimAngle), 18);
                    fx.addText(defender.x, defender.y - 45, '🎀 MAID ORDER EXECUTE! -24', '#ec4899', 24);
                    fx.spawnHitSparks(defender.x, defender.y, '#ec4899', 24);
                    attacker.signatureHits = 0;
                } else {
                    fx.addText(attacker.x, attacker.y - 25, `🎀 ORDER [${hitCount}/3]`, '#ec4899', 18);
                }
            }

            sound.playHit(true);
            fx.spawnHitSparks(defender.x, defender.y, attacker.color, 18);
            triggerScreenShake(8, 12);
        }
    }

    resolveProjectilesAgainstPlayers(p1, p2, triggerScreenShake) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            const defender = proj.ownerIndex === 0 ? p2 : p1;
            const attacker = proj.ownerIndex === 0 ? p1 : p2;

            // Capsule hitbox covering entire character body from head to feet
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
                        triggerScreenShake(6, 10);
                        continue;
                    } else {
                        // Absorbed by shield
                        defender.takeDamage(proj.damage * 0.15);
                        fx.spawnHitSparks(proj.x, proj.y, '#ffffff', 8);
                        sound.playHit(false);
                        this.projectiles.splice(i, 1);
                        continue;
                    }
                }

                // Direct hit!
                let dmg = proj.damage;
                if (attacker.hasLockOn) {
                    dmg *= 1.4;
                    attacker.hasLockOn = false;
                    fx.addText(defender.x, targetY - 45, '🎯 LOCK-ON CRIT!', '#38bdf8', 22);
                }
                defender.takeDamage(dmg, false, proj.x, proj.y);
                attacker.overdrive = Math.min(100, attacker.overdrive + 12 * (attacker.overdriveChargeRate || 1.0));
                defender.applyStun(14);
                physics.applyKnockback(defender, proj.vx * 0.25, proj.vy * 0.25, 5);

                if (proj.type === 'projection_frame') {
                    defender.applyFrameFreeze(20);
                    fx.spawnHitSparks(proj.x, proj.y, '#a3e635', 18);
                    fx.addText(defender.x, targetY - 45, '🎞️ FRAME FREEZE!', '#a3e635', 20);
                }

                // Ranged Signature 3-hit passives
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

                sound.playHit(true);
                fx.spawnHitSparks(proj.x, proj.y, proj.color, 18);
                fx.addText(defender.x, targetY - 20, `-${Math.round(dmg)}`, attacker.color, 20);
                triggerScreenShake(7, 10);
                this.projectiles.splice(i, 1);
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
                    const halfThickness = 28; // Matches visual lightning beam width

                    // Damage applies only when opponent is inside forward beam trajectory:
                    // 1. Must be in front of barrel (>= 40px forward)
                    // 2. Within beam length (<= 1500px)
                    // 3. Perpendicular distance within beam radius + target radius
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
                    // Singularity gravitational pull radius (120px accretion disk)
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
                    const halfThickness = 18; // Precise piercing railgun radius

                    if (forwardDist >= 35 && forwardDist <= beamLen + target.radius && verticalDist <= target.radius + halfThickness) {
                        target.takeDamage(ultDmgPerFrame, true, user.x, user.y);
                        target.applyStun(12);
                        physics.applyKnockback(target, facingDir, 0, 2.5);
                        fx.spawnHitSparks(target.x, target.y, '#38bdf8', 5);
                        triggerScreenShake(3, 6);
                    }
                } else if (user.characterId === 'vivian') {
                    // VIVIAN: BANSHEE BLOOM (ETHER FEATHER STORM) - 500px effect range
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
                    const halfThickness = 38; // Radius of golden Kamehameha beam (76px width)

                    // Damage only when opponent is inside forward Kamehameha wave
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
                    // NAOYA: MACH 3 CONSECUTIVE STRIKES (PROJECTION SORCERY 10 FPS)
                    // 1. 1.25x damage multiplier: total damage = (normalDmg * 3.5) * 1.25
                    // 2. 10 FPS cadence: 1 hit every 5 frames = 10 full hits across 50 frames
                    const barrageRadius = 350;
                    const dist = Math.hypot(target.x - user.x, target.y - user.y);
                    const hitIndex = Math.floor((user.ultimateTimer - 15) / 5); // 0 to 9 corresponds to 10 hits
                    if (hitIndex >= 0 && hitIndex < 10 && hitIndex > (user.lastNaoyaHitIndex ?? -1)) {
                        user.lastNaoyaHitIndex = hitIndex;
                        if (dist < target.radius + barrageRadius) {
                            // Distribute 1.25x damage equally across 10 hits
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
                    // SAITAMA: SERIOUS PUNCH - DEATH IMPACT
                    const facingDir = Math.cos(user.aimAngle) >= 0 ? 1 : -1;
                    const forwardDist = (target.x - user.x) * facingDir;
                    const verticalDist = Math.abs(target.y - user.y);
                    const beamLen = 1600;
                    const halfThickness = 55;
                    if (forwardDist >= 30 && forwardDist <= beamLen + target.radius && verticalDist <= target.radius + halfThickness) {
                        target.takeDamage(ultDmgPerFrame * 1.45, true, user.x, user.y);
                        target.applyStun(18);
                        physics.applyKnockback(target, facingDir * 1.8, -0.6, 4.5);
                        fx.spawnHitSparks(target.x, target.y, '#eab308', 8);
                        triggerScreenShake(7, 12);
                    }
                } else if (user.characterId === 'tst26') {
                    // TST-26: MAXIMUM MAID SANITIZATION VORTEX
                    const purgeRadius = 480;
                    const dist = Math.hypot(target.x - user.x, target.y - user.y);
                    if (dist < target.radius + purgeRadius) {
                        target.takeDamage(ultDmgPerFrame * 1.3, true, user.x, user.y);
                        target.applyStun(14);
                        const angle = Math.atan2(target.y - user.y, target.x - user.x);
                        physics.applyKnockback(target, Math.cos(angle), Math.sin(angle), 2.5);
                        fx.spawnHitSparks(target.x, target.y, '#ec4899', 7);
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
