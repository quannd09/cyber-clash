import { sound } from './audio.js';
import { fx } from './particles.js';
import { physics } from './physics.js';

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
<<<<<<< HEAD
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
=======
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
>>>>>>> a5abf9f205de21426fb630f4942a94f1ec1219e0
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
<<<<<<< HEAD
    SAITAMA_SKILL: { id: 'CONSECUTIVE_PUNCHES', name: 'Consecutive Normal Punches', cooldown: 210, icon: '🥊' },
    MEGUMI_SKILL: { id: 'DIVINE_DOG', name: 'Divine Dog Lunge', cooldown: 220, icon: '🐺' },
    MIRAI_SKILL: { id: 'BLOOD_CRESCENT', name: 'Blood Crescent Wave', cooldown: 200, icon: '🩸' }
=======
    SAITAMA_SKILL: { id: 'CONSECUTIVE_PUNCHES', name: 'Consecutive Normal Punches', cooldown: 170, icon: '🥊' },
    TST26_SKILL: { id: 'MAID_PURGE', name: 'Absolute Sanitization Sweep', cooldown: 175, icon: '🎀' }
>>>>>>> a5abf9f205de21426fb630f4942a94f1ec1219e0
};

export class Projectile {
    constructor(ownerIndex, x, y, vx, vy, damage, color, radius = 8, type = 'standard') {
        this.ownerIndex = ownerIndex;
        this.x = Number.isFinite(x) ? x : 0;
        this.y = Number.isFinite(y) ? y : 0;
        this.vx = Number.isFinite(vx) ? vx : 0;
        this.vy = Number.isFinite(vy) ? vy : 0;
        this.damage = Number.isFinite(damage) ? damage : 20;
        this.color = color || '#ffffff';
        this.radius = Number.isFinite(radius) ? radius : 8;
        this.life = 160;
        this.isReflected = false;
        this.type = type || 'standard';
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

<<<<<<< HEAD
        } else if (this.type === 'shadow_dog') {
            // MEGUMI: SHADOW DIVINE DOG 🐺
            const angle = Math.atan2(this.vy, this.vx);
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(angle);
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 25;

            // Dark shadow wolf head & jaws
            ctx.fillStyle = '#0f172a';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(22, 0);       // snout
            ctx.lineTo(0, -14);      // left ear
            ctx.lineTo(-12, -8);     // neck top
            ctx.lineTo(-24, 0);      // back
            ctx.lineTo(-12, 8);      // neck bottom
            ctx.lineTo(0, 14);       // right ear
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Glowing cyan eyes
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(6, -5, 2.5, 0, Math.PI * 2);
            ctx.arc(6, 5, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Shadow smoke trail
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
            ctx.lineWidth = 14;
            ctx.beginPath();
            ctx.moveTo(-10, 0);
            ctx.lineTo(-38, 0);
            ctx.stroke();
            ctx.restore();

        } else if (this.type === 'blood_crescent') {
            // MIRAI: BLOOD CRESCENT WAVE (Huyết Nguyệt Trảm) 🩸
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
=======
        } else if (this.type === 'projection_frame') {
            // NAOYA: 24 FPS PROJECTION FRAME BLADE / SORCERY FILM WAVE
            const r = this.radius;
            const angle = Math.atan2(this.vy, this.vx);
>>>>>>> a5abf9f205de21426fb630f4942a94f1ec1219e0

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
            // VERINA: PHOTONIC FLORA BLOSSOM (Radiant emerald-mint botanical energy orb)
            const r = Math.max(18, this.radius);
            const pulse = Math.sin(this.animTimer * 0.35) * 3;
            const angle = Math.atan2(this.vy, this.vx);

            // 1. Long radiant emerald motion tail (65px)
            const tailGrad = ctx.createLinearGradient(
                this.x, this.y,
                this.x - Math.cos(angle) * 65, this.y - Math.sin(angle) * 65
            );
            tailGrad.addColorStop(0, 'rgba(52, 211, 153, 0.9)');
            tailGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.45)');
            tailGrad.addColorStop(1, 'rgba(5, 150, 105, 0)');
            ctx.strokeStyle = tailGrad;
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - Math.cos(angle) * 65, this.y - Math.sin(angle) * 65);
            ctx.stroke();

            // 2. Wide glowing outer aura
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 35;

            // 3. Orbiting floral petals
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.animTimer * 0.16);

            ctx.fillStyle = 'rgba(167, 243, 208, 0.9)';
            ctx.strokeStyle = '#34d399';
            ctx.lineWidth = 2.5;
            for (let i = 0; i < 6; i++) {
                const petalAngle = i * (Math.PI * 2 / 6);
                const px = Math.cos(petalAngle) * (r + 6 + pulse);
                const py = Math.sin(petalAngle) * (r + 6 + pulse);
                ctx.beginPath();
                ctx.arc(px, py, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }

            // Central radiant flora core
            const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, r + 4);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.25, '#d1fae5');
            grad.addColorStop(0.65, '#34d399');
            grad.addColorStop(1, '#059669');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fill();

            // Diamond crystal highlight
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(0, -r * 0.55);
            ctx.lineTo(r * 0.55, 0);
            ctx.lineTo(0, r * 0.55);
            ctx.lineTo(-r * 0.55, 0);
            ctx.closePath();
            ctx.fill();

            ctx.restore();

        } else if (this.type === 'ether_cluster') {
            // NICOLE: ETHER CLUSTER EXPLOSIVE (Vibrant magenta/hot-pink ether vortex)
            const r = Math.max(20, this.radius);
            const pulse = Math.sin(this.animTimer * 0.4) * 4;
            const angle = Math.atan2(this.vy, this.vx);

            // Gravitational distortion tail
            const tailGrad = ctx.createLinearGradient(
                this.x, this.y,
                this.x - Math.cos(angle) * 75, this.y - Math.sin(angle) * 75
            );
            tailGrad.addColorStop(0, 'rgba(244, 114, 182, 0.95)');
            tailGrad.addColorStop(0.5, 'rgba(219, 39, 119, 0.5)');
            tailGrad.addColorStop(1, 'rgba(131, 24, 67, 0)');
            ctx.strokeStyle = tailGrad;
            ctx.lineWidth = 14;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - Math.cos(angle) * 75, this.y - Math.sin(angle) * 75);
            ctx.stroke();

            ctx.shadowColor = '#f472b6';
            ctx.shadowBlur = 40;

            // Rotating vortex rings
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.animTimer * 0.22);
            ctx.strokeStyle = 'rgba(251, 207, 232, 0.85)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.ellipse(0, 0, r + 7 + pulse, (r + 7 + pulse) * 0.5, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            // Core
            const grad = ctx.createRadialGradient(this.x, this.y, 2, this.x, this.y, r + 3);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.3, '#fbcfe8');
            grad.addColorStop(0.7, '#ec4899');
            grad.addColorStop(1, '#831843');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
            ctx.fill();

        } else if (this.type === 'sniper_beam') {
            // TRIGGER: ELECTROMAGNETIC PLASMA RAILGUN DART
            const r = Math.max(16, this.radius);
            const angle = Math.atan2(this.vy, this.vx);

            // Piercing railgun beam line (110px)
            const tailGrad = ctx.createLinearGradient(
                this.x, this.y,
                this.x - Math.cos(angle) * 110, this.y - Math.sin(angle) * 110
            );
            tailGrad.addColorStop(0, '#ffffff');
            tailGrad.addColorStop(0.3, '#38bdf8');
            tailGrad.addColorStop(0.7, '#0284c7');
            tailGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
            ctx.strokeStyle = tailGrad;
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - Math.cos(angle) * 110, this.y - Math.sin(angle) * 110);
            ctx.stroke();

            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 35;

            // Sharp plasma arrowhead
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(angle);
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(r * 1.6, 0);
            ctx.lineTo(-r, -r * 0.8);
            ctx.lineTo(-r * 0.4, 0);
            ctx.lineTo(-r, r * 0.8);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();

        } else if (this.type === 'ether_feather') {
            // VIVIAN: ABYSSAL BANSHEE ETHER FEATHER
            const r = Math.max(18, this.radius);
            const angle = Math.atan2(this.vy, this.vx);

            const tailGrad = ctx.createLinearGradient(
                this.x, this.y,
                this.x - Math.cos(angle) * 70, this.y - Math.sin(angle) * 70
            );
            tailGrad.addColorStop(0, 'rgba(192, 132, 252, 0.95)');
            tailGrad.addColorStop(0.6, 'rgba(147, 51, 234, 0.45)');
            tailGrad.addColorStop(1, 'rgba(88, 28, 135, 0)');
            ctx.strokeStyle = tailGrad;
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - Math.cos(angle) * 70, this.y - Math.sin(angle) * 70);
            ctx.stroke();

            ctx.shadowColor = '#c084fc';
            ctx.shadowBlur = 35;

            // Feather shape
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(angle);
            const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, r + 4);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.35, '#e9d5ff');
            grad.addColorStop(0.75, '#a855f7');
            grad.addColorStop(1, '#581c87');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.ellipse(0, 0, r * 1.4, r * 0.7, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

        } else if (this.type === 'maid_needle') {
            // TST-26: ABSOLUTE PRECISION SANITIZATION NEEDLE
            const r = Math.max(16, this.radius);
            const angle = Math.atan2(this.vy, this.vx);

            const tailGrad = ctx.createLinearGradient(
                this.x, this.y,
                this.x - Math.cos(angle) * 80, this.y - Math.sin(angle) * 80
            );
            tailGrad.addColorStop(0, '#ffffff');
            tailGrad.addColorStop(0.4, '#ec4899');
            tailGrad.addColorStop(1, 'rgba(236, 72, 153, 0)');
            ctx.strokeStyle = tailGrad;
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - Math.cos(angle) * 80, this.y - Math.sin(angle) * 80);
            ctx.stroke();

            ctx.shadowColor = '#ec4899';
            ctx.shadowBlur = 35;

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(angle);
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#f472b6';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(r * 1.5, 0);
            ctx.lineTo(0, -r * 0.6);
            ctx.lineTo(-r * 1.5, 0);
            ctx.lineTo(0, r * 0.6);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();

        } else {
            // Standard / Custom colored glowing energy orb
            const r = Math.max(16, this.radius);
            const angle = Math.atan2(this.vy, this.vx);

            const tailGrad = ctx.createLinearGradient(
                this.x, this.y,
                this.x - Math.cos(angle) * 60, this.y - Math.sin(angle) * 60
            );
            tailGrad.addColorStop(0, '#ffffff');
            tailGrad.addColorStop(0.5, this.color);
            tailGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.strokeStyle = tailGrad;
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - Math.cos(angle) * 60, this.y - Math.sin(angle) * 60);
            ctx.stroke();

            ctx.shadowColor = this.color;
            ctx.shadowBlur = 30;
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 3.5;

            ctx.beginPath();
            ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
            ctx.fill();
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

<<<<<<< HEAD
            // Satoru Gojo: Infinity Barrier (Vô Hạn Trụ) - Slow down enemy projectiles within 150px
            for (const target of players) {
                if (target && target.characterId === 'gojo' && target.index !== p.ownerIndex && !target.isStunned && !target.isDead) {
                    if (target.teamId !== undefined) {
                        const owner = players.find(pl => pl && pl.index === p.ownerIndex);
                        if (owner && owner.teamId === target.teamId) continue; // Same team
                    }
=======
            // Satoru Gojo: Infinity Barrier - Slows opponent projectiles within 150px
            if (p1 && p2) {
                const target = (p.ownerIndex === 0) ? p2 : p1;
                if (target && target.characterId === 'gojo' && !target.isStunned && !target.isDead) {
>>>>>>> a5abf9f205de21426fb630f4942a94f1ec1219e0
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

            // Bounds & safety check
            if (!Number.isFinite(p.x) || !Number.isFinite(p.y) ||
                (arenaBounds && (p.x < arenaBounds.minX || p.x > arenaBounds.maxX ||
                p.y < arenaBounds.minY || p.y > arenaBounds.maxY)) || p.life <= 0) {
                if (Number.isFinite(p.x) && Number.isFinite(p.y)) {
                    fx.spawnHitSparks(p.x, p.y, p.color, 8);
                }
                this.projectiles.splice(i, 1);
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

<<<<<<< HEAD
            for (const defender of players) {
                if (!defender || defender.isDead) continue;
                // Friendly Fire OFF
                if (attacker && defender.teamId === attacker.teamId) continue;
                if (defender.index === proj.ownerIndex) continue;
=======
            // Capsule hitbox covering entire character body from head to feet
            const targetY = Math.max(defender.y - 55, Math.min(defender.y + 30, proj.y));
            const dist = Math.hypot(defender.x - proj.x, targetY - proj.y);
>>>>>>> a5abf9f205de21426fb630f4942a94f1ec1219e0

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
                        defender.applyStun(45);
                        fx.addText(defender.x, targetY - 45, '🐺 PINNED BY DIVINE DOG!', '#38bdf8', 24);
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
<<<<<<< HEAD
=======

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
>>>>>>> a5abf9f205de21426fb630f4942a94f1ec1219e0
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
<<<<<<< HEAD
                    // SAITAMA: SERIOUS SERIES - SERIOUS PUNCH! 👊
=======
                    // SAITAMA: SERIOUS PUNCH - DEATH IMPACT
>>>>>>> a5abf9f205de21426fb630f4942a94f1ec1219e0
                    const facingDir = Math.cos(user.aimAngle) >= 0 ? 1 : -1;
                    const forwardDist = (target.x - user.x) * facingDir;
                    const verticalDist = Math.abs(target.y - user.y);
                    const beamLen = 1600;
                    const halfThickness = 55;
<<<<<<< HEAD

                    if (forwardDist >= 30 && forwardDist <= beamLen + target.radius && verticalDist <= target.radius + halfThickness) {
                        target.takeDamage(ultDmgPerFrame * 1.25, true, user.x, user.y);
                        target.applyStun(15);
                        physics.applyKnockback(target, facingDir * 2.5, -0.8, 3.8);
                        fx.spawnHitSparks(target.x, target.y, '#f59e0b', 8);
                        triggerScreenShake(5, 9);
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
                    // MIRAI: BLOOD CATACLYSM STRIKE (CỰ ĐẠI HUYẾT KIẾM) 🩸
                    const dist = Math.hypot(target.x - user.x, target.y - user.y);
                    if (dist < target.radius + 350) {
                        target.takeDamage(ultDmgPerFrame * 1.15, true, user.x, user.y);
                        target.applyStun(12);
                        physics.applyKnockback(target, 0, 1.2, 3.2);
                        fx.spawnHitSparks(target.x, target.y, '#ef4444', 8);
                        // Lifesteal on ultimate
                        user.hp = Math.min(user.maxHp, user.hp + (ultDmgPerFrame * 0.25));
=======
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
>>>>>>> a5abf9f205de21426fb630f4942a94f1ec1219e0
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
