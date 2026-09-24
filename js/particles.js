// Particle FX & Floating Combat Text Engine
export class Particle {
    constructor(x, y, vx, vy, color, size, life, shape = 'circle', alpha = 1) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.maxLife = life;
        this.life = life;
        this.shape = shape;
        this.alpha = alpha;
        this.rotation = Math.random() * Math.PI * 2;
        this.vRot = (Math.random() - 0.5) * 0.2;
    }

    update(dt = 1) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.rotation += this.vRot * dt;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.life -= dt;
    }

    draw(ctx) {
        const progress = Math.max(0, this.life / this.maxLife);
        const currentAlpha = this.alpha * progress;

        ctx.save();
        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12 * progress;

        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        if (this.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, this.size * progress, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.shape === 'spark') {
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size * progress * 2.5, this.size * progress * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.shape === 'ring') {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 3 * progress;
            ctx.beginPath();
            ctx.arc(0, 0, this.size * (1.5 - progress * 0.5), 0, Math.PI * 2);
            ctx.stroke();
        } else if (this.shape === 'box') {
            const s = this.size * progress;
            ctx.fillRect(-s, -s, s * 2, s * 2);
        }

        ctx.restore();
    }
}

export class FloatingText {
    constructor(x, y, text, color, fontSize = 22, life = 50) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color;
        this.fontSize = fontSize;
        this.maxLife = life;
        this.life = life;
        this.vy = -1.6;
    }

    update(dt = 1) {
        this.y += this.vy * dt;
        this.vy *= 0.94;
        this.life -= dt;
    }

    draw(ctx) {
        const progress = Math.max(0, this.life / this.maxLife);
        ctx.save();
        ctx.globalAlpha = progress;
        ctx.font = `900 ${this.fontSize}px 'Courier New', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 16;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.strokeText(this.text, this.x, this.y);
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}

export class ParticleSystem {
    constructor() {
        this.particles = [];
        this.texts = [];
    }

    spawnThrusterFlame(x, y, dirAngle, color = '#00f0ff') {
        const spread = (Math.random() - 0.5) * 0.45;
        const speed = 3.5 + Math.random() * 4.0;
        const vx = -Math.cos(dirAngle + spread) * speed;
        const vy = -Math.sin(dirAngle + spread) * speed;
        this.particles.push(new Particle(x, y, vx, vy, color, 4 + Math.random() * 3, 14, 'circle', 0.8));
    }

    spawnHitSparks(x, y, color = '#ff007f', count = 16) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 8;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            this.particles.push(new Particle(x, y, vx, vy, color, 3 + Math.random() * 3, 20 + Math.random() * 15, 'spark'));
        }
    }

    spawnClashShockwave(x, y) {
        // Shockwave rings
        this.particles.push(new Particle(x, y, 0, 0, '#ffffff', 45, 25, 'ring', 1.0));
        this.particles.push(new Particle(x, y, 0, 0, '#00ffff', 65, 30, 'ring', 0.9));
        this.particles.push(new Particle(x, y, 0, 0, '#ff00ff', 85, 35, 'ring', 0.8));

        // Bright multi-color sparks
        this.spawnHitSparks(x, y, '#ffffff', 20);
        this.spawnHitSparks(x, y, '#ffff00', 16);
    }

    spawnParryBurst(x, y, color = '#00ffcc') {
        this.particles.push(new Particle(x, y, 0, 0, color, 50, 24, 'ring', 1.0));
        for (let i = 0; i < 18; i++) {
            const angle = (i / 18) * Math.PI * 2;
            const speed = 5;
            this.particles.push(new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 4, 18, 'spark'));
        }
    }

    spawnDash(x, y, color = '#00f0ff') {
        this.particles.push(new Particle(x, y, 0, 0, color, 42, 20, 'ring', 0.9));
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 6;
            this.particles.push(new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 3, 16, 'spark'));
        }
    }

    spawnWallBounce(x, y, normalX, normalY, color = '#00f0ff') {
        const baseAngle = Math.atan2(normalY, normalX);
        this.particles.push(new Particle(x, y, 0, 0, color, 40, 20, 'ring', 0.9));
        for (let i = 0; i < 12; i++) {
            const spread = (Math.random() - 0.5) * 1.5;
            const speed = 3 + Math.random() * 7;
            const vx = Math.cos(baseAngle + spread) * speed;
            const vy = Math.sin(baseAngle + spread) * speed;
            this.particles.push(new Particle(x, y, vx, vy, '#ffffff', 3, 16, 'spark'));
        }
    }

    spawnDeathBurst(x, y, color = '#ef4444') {
        // Massive energy shockwave rings
        this.particles.push(new Particle(x, y, 0, 0, '#ffffff', 55, 28, 'ring', 1.0));
        this.particles.push(new Particle(x, y, 0, 0, color, 85, 36, 'ring', 0.9));
        this.particles.push(new Particle(x, y, 0, 0, '#ff0055', 115, 42, 'ring', 0.8));

        // 35 flying cyber debris fragments & sparks
        for (let i = 0; i < 35; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 9;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 2.5; // Biased upwards
            const pColor = Math.random() > 0.4 ? color : (Math.random() > 0.5 ? '#ffffff' : '#f43f5e');
            const shape = Math.random() > 0.5 ? 'box' : 'spark';
            const size = 3 + Math.random() * 4;
            const life = 35 + Math.random() * 30;
            this.particles.push(new Particle(x, y, vx, vy, pColor, size, life, shape, 0.95));
        }

        // Heavy floating K.O. text with neon outline
        this.addText(x, y - 45, '⚡ K. O. ⚡', '#ef4444', 38, 75);
    }

    spawnDeathSparks(x, y, color = '#00f0ff') {
        for (let i = 0; i < 4; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 4;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            this.particles.push(new Particle(
                x + (Math.random() - 0.5) * 32,
                y + (Math.random() - 0.5) * 44,
                vx, vy, color, 2 + Math.random() * 2, 12 + Math.random() * 10, 'spark', 0.9
            ));
        }
    }

    spawnDeathSmoke(x, y) {
        const vx = (Math.random() - 0.5) * 0.8;
        const vy = -1.2 - Math.random() * 1.0;
        this.particles.push(new Particle(
            x + (Math.random() - 0.5) * 24,
            y + 10 + (Math.random() - 0.5) * 10,
            vx, vy, 'rgba(100, 116, 139, 0.6)', 6 + Math.random() * 6, 40 + Math.random() * 20, 'circle', 0.6
        ));
    }

    addText(x, y, text, color = '#ffff00', size = 22, life = 45) {
        this.texts.push(new FloatingText(x, y, text, color, size, life));
    }

    update(dt = 1) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(dt);
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        for (let i = this.texts.length - 1; i >= 0; i--) {
            this.texts[i].update(dt);
            if (this.texts[i].life <= 0) {
                this.texts.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
        this.texts.forEach(t => t.draw(ctx));
    }

    clear() {
        this.particles = [];
        this.texts = [];
    }
}

export const fx = new ParticleSystem();
