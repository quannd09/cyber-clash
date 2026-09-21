import { sound } from './audio.js?v=54';
import { fx } from './particles.js?v=54';
import { physics } from './physics.js?v=54';

export const WEAPONS = {
    YANAGI: {
        id: 'YANAGI',
        name: 'Electric Naginata',
        attackDmg: 32, 
        attackRange: 85,
        attackDuration: 18,
        attackCooldown: 22,
        isRanged: false,
        icon: '⚔️'
    },
    VELINA: {
        id: 'VELINA',
        name: 'Photonic Flora',
        attackDmg: 23,
        attackRange: 580,
        attackDuration: 24,
        attackCooldown: 28,
        isRanged: true,
        icon: '🌸'
    },
    NICOLE: {
        id: 'NICOLE',
        name: 'Briefcase Cannon',
        attackDmg: 26,
        attackRange: 520,
        attackDuration: 22,
        attackCooldown: 27,
        isRanged: true,
        icon: '💼'
    },
    TRIGGER: {
        id: 'TRIGGER',
        name: 'Electromagnetic Sniper',
        attackDmg: 38,
        attackRange: 720,
        attackDuration: 26,
        attackCooldown: 38,
        isRanged: true,
        icon: '🎯'
    },
    VIVIAN: {
        id: 'VIVIAN',
        name: 'Ether Feathers',
        attackDmg: 21,
        attackRange: 500,
        attackDuration: 20,
        attackCooldown: 24,
        isRanged: true,
        icon: '🔮'
    },
    JOTARO: {
        id: 'JOTARO',
        name: 'Star Platinum ORA',
        attackDmg: 34,
        attackRange: 85,
        attackDuration: 19,
        attackCooldown: 22,
        isRanged: false,
        icon: '👊'
    },
    GOKU: {
        id: 'GOKU',
        name: 'Dragon Fist Ki',
        attackDmg: 29,
        attackRange: 80,
        attackDuration: 18,
        attackCooldown: 20,
        isRanged: false,
        icon: '🥋'
    },
    GIORNO: {
        id: 'GIORNO',
        name: 'Gold Experience MUDA',
        attackDmg: 31,
        attackRange: 80,
        attackDuration: 19,
        attackCooldown: 21,
        isRanged: false,
        icon: '🐞'
    },
    NAOYA: {
        id: 'NAOYA',
        name: '24 FPS Projection Fists',
        attackDmg: 28,
        attackRange: 82,
        attackDuration: 16,
        attackCooldown: 18,
        isRanged: false,
        icon: '🎞️'
    },
    LUFFY: {
        id: 'LUFFY',
        name: 'Gomu Gomu no Pistol',
        attackDmg: 30,
        attackRange: 110,
        attackDuration: 20,
        attackCooldown: 22,
        isRanged: false,
        icon: '🍖'
    },
    GOJO: {
        id: 'GOJO',
        name: 'Black Flash Infinity',
        attackDmg: 33,
        attackRange: 85,
        attackDuration: 18,
        attackCooldown: 21,
        isRanged: false,
        icon: '♾️'
    },
    SUKUNA: {
        id: 'SUKUNA',
        name: 'Dismantle Slashes',
        attackDmg: 34,
        attackRange: 92,
        attackDuration: 18,
        attackCooldown: 21,
        isRanged: false,
        icon: '⛩️'
    }
};

export const SKILLS = {
    YANAGI_SKILL: { id: 'PHASE_BLINK', name: 'Phase Blink', cooldown: 180, icon: '⚡' },
    VERINA_SKILL: { id: 'EMP_BLAST', name: 'EMP Blast', cooldown: 210, icon: '🌸' },
    NICOLE_SKILL: { id: 'SUGAR_SLIDE', name: 'Sugar Slide', cooldown: 190, icon: '💼' },
    TRIGGER_SKILL: { id: 'SNIPER_STANCE', name: 'Sniper Stance', cooldown: 230, icon: '🎯' },
    VIVIAN_SKILL: { id: 'ABLOOM_BURST', name: 'Abloom Burst', cooldown: 150, icon: '🔮' },
    JOTARO_SKILL: { id: 'STAR_FINGER', name: 'Star Finger', cooldown: 200, icon: '👊' },
    GOKU_SKILL: { id: 'INSTANT_TRANSMISSION', name: 'Instant Transmission', cooldown: 210, icon: '🥋' },
    GIORNO_SKILL: { id: 'LIFE_TREE', name: 'Tree of Life', cooldown: 200, icon: '🐞' },
    NAOYA_SKILL: { id: 'PROJECTION_DASH', name: 'Projection Dash', cooldown: 200, icon: '🎞️' },
    LUFFY_SKILL: { id: 'GIGANT_STOMP', name: 'Gigant Stomp', cooldown: 210, icon: '🍖' },
    GOJO_SKILL: { id: 'HOLLOW_PURPLE', name: 'Hollow Purple', cooldown: 220, icon: '🟣' },
    SUKUNA_SKILL: { id: 'KAMINO_FIRE_ARROW', name: 'Kamino Fire Arrow', cooldown: 210, icon: '🔥' }
};

export class Projectile {
    constructor(ownerIndex, x, y, vx, vy, damage, color, radius = 8) {
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
    }

    update(dt = 1) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.life -= dt;

        // Spark tail
        if (Math.random() < 0.4) {
            fx.spawnHitSparks(this.x, this.y, this.color, 1);
        }
    }

    draw(ctx) {
        ctx.save();
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

    updateProjectiles(dt = 1, arenaBounds) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
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
                    defender.overdrive = Math.min(100, defender.overdrive + 25);
                    attacker.applyStun(55); // 0.9s Stun on attacker!
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
            defender.takeDamage(baseDmg);
            attacker.overdrive = Math.min(100, attacker.overdrive + 14);
            defender.applyStun(20);
            physics.applyKnockback(defender, Math.cos(aimAngle), Math.sin(aimAngle), 10);

            // Check Naoya 3-hit frame freeze passive
            if (attacker.characterId === 'naoya') {
                attacker.naoyaHitCount = (attacker.naoyaHitCount || 0) + 1;
                if (attacker.naoyaHitCount >= 3) {
                    defender.applyFrameFreeze(50);
                    attacker.naoyaHitCount = 0;
                } else {
                    fx.addText(attacker.x, attacker.y - 25, `🎞️ FRAME [${attacker.naoyaHitCount}/3]`, '#a3e635', 18);
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

            // Hitbox dạng hình con nhộng (Capsule) bao phủ toàn bộ cơ thể nhân vật từ đầu tới chân
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
                        defender.overdrive = Math.min(100, defender.overdrive + 20);

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
                defender.takeDamage(proj.damage);
                attacker.overdrive = Math.min(100, attacker.overdrive + 12);
                defender.applyStun(16);
                physics.applyKnockback(defender, proj.vx * 0.3, proj.vy * 0.3, 6);

                sound.playHit(true);
                fx.spawnHitSparks(proj.x, proj.y, proj.color, 18);
                fx.addText(defender.x, targetY - 20, `-${Math.round(proj.damage)}`, attacker.color, 20);
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
                // Dame ulti = 3.5x dame 1 đòn đánh thường (chia đều qua 50 frame hoạt động)
                const ultDmgPerFrame = (normalDmg * 3.5) / 50;

                if (user.characterId === 'yanagi') {
                    // YANAGI: PHÁO LÔI QUANG (LIGHTNING CANNON BEAM)
                    const facingDir = Math.cos(user.aimAngle) >= 0 ? 1 : -1;
                    const forwardDist = (target.x - user.x) * facingDir;
                    const verticalDist = Math.abs(target.y - user.y);
                    const beamLen = 1500;
                    const halfThickness = 28; // Khớp chính xác với bề rộng tia lôi quang hiển thị

                    // Chỉ dính dame khi đối thủ thực sự nằm trong luồng tia lôi quang phía trước:
                    // 1. Phải ở phía trước nòng pháo (từ 40px phía trước trở đi, không dính dame khi đứng sau lưng)
                    // 2. Nằm trong chiều dài tia (<= 1500px)
                    // 3. Khoảng cách vuông góc tới tia phải nhỏ hơn bán kính tia + bán kính nhân vật
                    if (forwardDist >= 40 && forwardDist <= beamLen + target.radius && verticalDist <= target.radius + halfThickness) {
                        target.takeDamage(ultDmgPerFrame);
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
                        target.takeDamage(ultDmgPerFrame);
                        target.applyStun(8);
                        const angleToTarget = Math.atan2(target.y - user.y, target.x - user.x);
                        physics.applyKnockback(target, Math.cos(angleToTarget), Math.sin(angleToTarget), 1.5);
                        fx.spawnHitSparks(target.x, target.y, user.color, 4);
                        triggerScreenShake(3, 5);
                    }
                } else if (user.characterId === 'nicole') {
                    // NICOLE: GRAVITATIONAL SINGULARITY (HỐ ĐEN TRỌNG LỰC)
                    const facingDir = Math.cos(user.aimAngle) >= 0 ? 1 : -1;
                    const hX = user.x + facingDir * 320;
                    const hY = user.y;
                    const dist = Math.hypot(target.x - hX, target.y - hY);
                    // Bán kính hút hố đen chuẩn xác theo vòng xoáy đĩa bồi tụ (120px)
                    if (dist < target.radius + 95) {
                        // Sucking pull force towards black hole
                        const pullAngle = Math.atan2(hY - target.y, hX - target.x);
                        physics.applyKnockback(target, Math.cos(pullAngle), Math.sin(pullAngle), 2.2);
                        target.takeDamage(ultDmgPerFrame);
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
                    const halfThickness = 18; // Bán kính đường đạn xuyên phá chuẩn xác

                    if (forwardDist >= 35 && forwardDist <= beamLen + target.radius && verticalDist <= target.radius + halfThickness) {
                        target.takeDamage(ultDmgPerFrame);
                        target.applyStun(12);
                        physics.applyKnockback(target, facingDir, 0, 2.5);
                        fx.spawnHitSparks(target.x, target.y, '#38bdf8', 5);
                        triggerScreenShake(3, 6);
                    }
                } else if (user.characterId === 'vivian') {
                    // VIVIAN: BANSHEE BLOOM (BÃO LÔNG VŨ ETHER) - Tăng phạm vi tác dụng lên 500px
                    const stormRadius = 460;
                    const dist = Math.hypot(target.x - user.x, target.y - user.y);
                    if (dist < target.radius + stormRadius) {
                        target.takeDamage(ultDmgPerFrame);
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
                        target.takeDamage(ultDmgPerFrame);
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
                    const halfThickness = 38; // Bán kính chuẩn cột sóng Kamehameha hoàng kim (bề rộng 76px)

                    // Chỉ dính dame khi đối thủ thực sự nằm trong luồng sóng Kamehameha phía trước
                    if (forwardDist >= 40 && forwardDist <= beamLen + target.radius && verticalDist <= target.radius + halfThickness) {
                        target.takeDamage(ultDmgPerFrame);
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
                        target.takeDamage(ultDmgPerFrame);
                        const angle = Math.atan2(target.y - user.y, target.x - user.x);
                        physics.applyKnockback(target, Math.cos(angle), Math.sin(angle), 1.6);
                        fx.spawnHitSparks(target.x, target.y, '#eab308', 5);
                        triggerScreenShake(3, 6);
                    }
                } else if (user.characterId === 'naoya') {
                    // NAOYA: TỐC ĐỘ MACH 3 LIÊN HOÀN TRẢM (PROJECTION SORCERY 24 FPS)
                    const barrageRadius = 340;
                    const dist = Math.hypot(target.x - user.x, target.y - user.y);
                    if (dist < target.radius + barrageRadius) {
                        target.takeDamage(ultDmgPerFrame);
                        target.applyFrameFreeze(12);
                        const dashAngle = user.ultimateTimer * 0.8;
                        physics.applyKnockback(target, Math.cos(dashAngle), Math.sin(dashAngle), 2.2);
                        fx.spawnHitSparks(target.x, target.y, '#a3e635', 5);
                        triggerScreenShake(3, 5);
                    }
                } else if (user.characterId === 'luffy') {
                    // LUFFY: GOMU GOMU NO BAJRANG GUN (NẮM ĐẤM HAKI HÓA THẦN NIKA KHỔNG LỒ)
                    const facingDir = Math.cos(user.aimAngle) >= 0 ? 1 : -1;
                    const strikeX = user.x + facingDir * 180;
                    const strikeY = user.y;
                    const dist = Math.hypot(target.x - strikeX, target.y - strikeY);
                    if (dist < target.radius + 320) {
                        target.takeDamage(ultDmgPerFrame);
                        target.applyStun(14);
                        physics.applyKnockback(target, facingDir * 0.8, 1.2, 3.0); // Downward & forward slam
                        fx.spawnHitSparks(target.x, target.y, '#ef4444', 6);
                        triggerScreenShake(5, 8);
                    }
                } else if (user.characterId === 'gojo') {
                    // GOJO: BÀNH TRƯỚNG LÃNH ĐỊA - VÔ LƯỢNG KHÔNG XỨ (UNLIMITED VOID)
                    const domainRadius = 450;
                    const dist = Math.hypot(target.x - user.x, target.y - user.y);
                    if (dist < target.radius + domainRadius) {
                        target.takeDamage(ultDmgPerFrame);
                        target.applyStun(22);
                        target.vx *= 0.1;
                        target.vy *= 0.1;
                        fx.spawnHitSparks(target.x, target.y, '#0284c7', 5);
                        triggerScreenShake(3, 6);
                    }
                } else if (user.characterId === 'sukuna') {
                    // SUKUNA: BÀNH TRƯỚNG LÃNH ĐỊA - PHỤC MA NGỰ KHẢM TỬ (MALEVOLENT SHRINE)
                    const shrineRadius = 420;
                    const dist = Math.hypot(target.x - user.x, target.y - user.y);
                    if (dist < target.radius + shrineRadius) {
                        target.takeDamage(ultDmgPerFrame);
                        target.applyStun(10);
                        const sliceAngle = (user.ultimateTimer * 0.7) % (Math.PI * 2);
                        physics.applyKnockback(target, Math.cos(sliceAngle), Math.sin(sliceAngle), 1.8);
                        fx.spawnHitSparks(target.x, target.y, '#f43f5e', 6);
                        triggerScreenShake(4, 7);
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
