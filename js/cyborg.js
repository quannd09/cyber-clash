// Cyborg Fighter Entity Class
import { sound } from './audio.js?v=54';
import { fx } from './particles.js?v=54';
import { physics } from './physics.js?v=54';
import { WEAPONS, SKILLS, Projectile, combat } from './combat.js?v=54';

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
            giorno: '#facc15'
        };
        const charStyles = {
            yanagi: 'melee',
            velina: 'ranged',
            nicole: 'ranged',
            trigger: 'ranged',
            vivian: 'ranged',
            jotaro: 'melee',
            goku: 'melee',
            giorno: 'melee'
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

        // Core Vitals (Balanced across archetypes)
        const charHp = {
            vivian: 650,
            jotaro: 550,
            goku: 520,
            giorno: 510,
            nicole: 500,
            velina: 480,
            yanagi: 475,
            trigger: 460
        };
        this.maxHp = charHp[characterId] || 500;
        this.hp = this.maxHp;
        this.maxEnergy = 100;
        this.energy = 100;
        this.overdrive = 0; // 0 to 100
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

        // Anti-spam Attack Mechanism (Chỉ tính nếu spam 6 đòn trong ~2s)
        this.recentAttackTimes = [];
        this.spamDelayTimer = 0;

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
    }

    update(dt = 1, arenaBounds) {
        // Regenerate Energy slowly
        if (!this.isShielding && this.energy < this.maxEnergy) {
            this.energy = Math.min(this.maxEnergy, this.energy + 0.35 * dt);
        }

        // Tự động hồi nộ chiêu cuối (Overdrive) theo thời gian (Vivian hồi nộ nhanh hơn)
        if (!this.isUsingUltimate && this.overdrive < 100) {
            const passiveGain = this.characterId === 'vivian' ? 0.13 : 0.08;
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

    thrust(dirX, dirY) {
        if (this.isStunned || this.isUsingUltimate) return;

        const thrustPower = this.isBoosted ? 1.2 : 0.6;
        this.ax += dirX * thrustPower;
        this.ay += dirY * thrustPower;

        // Update facing and aim angle if NOT strafing
        if (Math.hypot(dirX, dirY) > 0.1) {
            const moveAngle = Math.atan2(dirY, dirX);
            this.facingAngle = moveAngle;
            if (!this.isStrafing) {
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

    setStrafing(isStrafing) {
        this.isStrafing = isStrafing;
    }

    setAimAngle(angle) {
        this.aimAngle = angle;
        this.facingAngle = angle;
    }

    attack() {
        if (this.isStunned || this.isShielding || this.isAttacking || this.attackCooldown > 0 || this.isUsingUltimate || this.spamDelayTimer > 0) return;

        const weapon = WEAPONS[this.characterId.toUpperCase()];
        const now = performance.now();

        // Lọc các đòn đánh trong khoảng thời gian 3 giây gần nhất (3000ms)
        const spamWindowMs = Math.max(3000, (weapon.attackCooldown || 25) * 5.5 * (1000 / 60));
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

        // Chỉ phạt delay nếu spam 6 đòn liên tiếp trong 3 giây
        if (this.recentAttackTimes.length >= 6) {
            this.spamDelayTimer = weapon.attackDuration + 60; // Khóa đánh trọn vẹn 1s (60 frames) sau khi đòn thứ 6 kết thúc
            this.attackCooldown = weapon.attackDuration + 60; // Thêm delay 1s sau đòn thứ 6
            this.recentAttackTimes = []; // Reset sau khi kích hoạt phạt
        } else {
            this.attackCooldown = weapon.attackCooldown;
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
            // MELEE SLASH
            this.isShooting = false;
            sound.playSlash(true);
            // Lunging dash momentum
            physics.applyKnockback(this, Math.cos(this.aimAngle), Math.sin(this.aimAngle), 6.5);
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
            giorno: SKILLS.GIORNO_SKILL
        };
        const skill = skillMap[this.characterId] || SKILLS.YANAGI_SKILL;
        this.skillCooldownTimer = skill.cooldown;
        this.isUsingSkill = true;
        this.skillActionTimer = 30;

        const weapon = WEAPONS[this.characterId.toUpperCase()];
        const normalDmg = weapon ? weapon.attackDmg : 30;
        // Dame đòn skill bằng 2x dame 1 đòn đánh thường
        const skillDmg = normalDmg * 2;

        if (skill.id === 'PHASE_BLINK') {
            sound.playBlink();
            fx.spawnParryBurst(this.x, this.y, this.color);
            this.x += Math.cos(this.aimAngle) * 160;
            this.y += Math.sin(this.aimAngle) * 160;
            fx.spawnParryBurst(this.x, this.y, '#ffffff');
            fx.addText(this.x, this.y - 30, '🌀 BLINK!', this.color, 22);
            // Sóng điện gây 2x sát thương nếu đối thủ ở gần điểm xuất hiện
            const dist = Math.hypot(opponent.x - this.x, opponent.y - this.y);
            if (dist < 140) {
                opponent.takeDamage(skillDmg);
                opponent.applyStun(25);
                physics.applyKnockback(opponent, Math.cos(this.aimAngle), Math.sin(this.aimAngle), 9);
                fx.spawnHitSparks(opponent.x, opponent.y, this.color, 16);
                fx.addText(opponent.x, opponent.y - 35, `⚡ LÔI CHẤN! -${Math.round(skillDmg)}`, this.color, 22);
                sound.playHit(true);
            }
        } else if (skill.id === 'EMP_BLAST') {
            sound.playEMP();
            fx.spawnClashShockwave(this.x, this.y);
            this.hp = Math.min(this.maxHp, this.hp + 50);
            fx.addText(this.x, this.y - 30, '+50 HP HEAL!', '#34d399', 24);
            const dist = Math.hypot(opponent.x - this.x, opponent.y - this.y);
            if (dist < 250) {
                opponent.takeDamage(skillDmg);
                opponent.releaseShield();
                opponent.applyStun(30);
                physics.applyKnockback(opponent, opponent.x - this.x, opponent.y - this.y, 10);
                fx.addText(opponent.x, opponent.y - 30, `ĐẨY LÙI! -${Math.round(skillDmg)}`, '#34d399', 20);
            }
        } else if (skill.id === 'SUGAR_SLIDE') {
            sound.playWallBounce();
            physics.applyKnockback(this, Math.cos(this.aimAngle), Math.sin(this.aimAngle), 12);
            fx.addText(this.x, this.y - 30, '💼 SUGAR SLIDE!', '#f472b6', 22);
            // Bắn 2 viên ether, mỗi viên bằng 1x thường (tổng 2x đòn thường)
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
            // Đạn bắn tỉa xuyên giáp gây 2x sát thương đòn thường
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
            this.hp = Math.min(this.maxHp, this.hp + 25);
            fx.addText(this.x, this.y - 30, '🔮 ABLOOM BURST!', '#c084fc', 22);

            // Tự động căn góc bắn chuẩn về phía đối thủ
            const angleToOpponent = Math.atan2(opponent.y - this.y, opponent.x - this.x);
            const isFacingOpponent = Math.cos(this.aimAngle) * Math.cos(angleToOpponent) > 0;
            const baseAngle = isFacingOpponent ? angleToOpponent : this.aimAngle;

            // 4 chùm lông vũ ether chụm góc, tốc độ cao 16, bán kính 10px để gây đủ 50 dmg
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
                opponent.applyStun(35);
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
            fx.addText(this.x, this.y - 35, '⚡ DỊCH CHUYỂN!', '#fbbf24', 24);
            // Gut punch gây 2x sát thương đòn thường
            opponent.takeDamage(skillDmg);
            opponent.applyStun(30);
            physics.applyKnockback(opponent, Math.cos(this.aimAngle), Math.sin(this.aimAngle), 12);
            sound.playHit(true);
        } else if (skill.id === 'LIFE_TREE') {
            sound.playEMP();
            fx.spawnClashShockwave(opponent.x, opponent.y);
            fx.addText(opponent.x, opponent.y - 45, '🌳 CÂY SINH MỆNH!', '#facc15', 24);
            opponent.takeDamage(skillDmg);
            opponent.applyStun(32);
            opponent.vy = -12; // Launch into air
            physics.applyKnockback(opponent, (Math.random() - 0.5) * 2, -1, 10);
            sound.playHit(true);
        }
    }

    activateUltimateOrDash() {
        if (this.isStunned || this.isUsingUltimate) return;

        if (this.overdrive >= 100) {
            this.activateUltimate();
        } else {
            // Quick Thruster Boost Dash when not at 100% overdrive
            if (this.energy >= 15) {
                this.energy -= 15;
                this.isBoosted = true;
                this.boostTimer = 26;
                physics.applyKnockback(this, Math.cos(this.aimAngle), Math.sin(this.aimAngle), 14.5);
                sound.playWallBounce();
                fx.spawnThrusterFlame(this.x, this.y, this.aimAngle, '#ffffff');
                fx.addText(this.x, this.y - 30, `💨 DASH! (Nộ: ${Math.floor(this.overdrive)}%)`, this.color, 20);
            } else {
                fx.addText(this.x, this.y - 30, 'CẦN NĂNG LƯỢNG!', '#ff0055', 18);
            }
        }
    }

    activateUltimate() {
        if (this.overdrive < 100 || this.isStunned || this.isUsingUltimate) return;

        this.overdrive = 0;
        this.isUsingUltimate = true;
        this.ultimateTimer = 0;
        this.isAttacking = false;
        this.isShielding = false;

        sound.playUltimate();
        fx.spawnClashShockwave(this.x, this.y);
        
        const ultShouts = {
            yanagi: '⚡ PHÁO LÔI QUANG! ⚡',
            velina: '🌪️ BÃO SINH MỆNH! 🌪️',
            nicole: '🕳️ HỐ ĐEN TRỌNG LỰC! 🕳️',
            trigger: '🎯 HỎA LỰC ĐỒNG BỘ! 🎯',
            vivian: '🔮 ĐIỀM BÁO VĨNH CỬU! 🔮',
            jotaro: '⏳ THE WORLD: ORA ORA ORA! ⏳',
            goku: '💥 SIÊU KAMEHAMEHA! 💥',
            giorno: '♾️ RETURN TO ZERO! ♾️'
        };
        const shout = ultShouts[this.characterId] || '🔥 OVERDRIVE ULTIMATE! 🔥';
        fx.addText(this.x, this.y - 45, shout, this.color, 28, 60);
    }

    takeDamage(amount) {
        this.hp = Math.max(0, this.hp - amount);
        // Hồi nộ chiêu cuối (Overdrive) khi bị đánh
        if (!this.isUsingUltimate && this.overdrive < 100) {
            this.overdrive = Math.min(100, this.overdrive + amount * 0.22);
        }
    }

    applyStun(frames) {
        this.isStunned = true;
        this.stunTimer = frames;
        this.isAttacking = false;
        this.isShielding = false;
    }
}
