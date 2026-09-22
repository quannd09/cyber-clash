// Cyberpunk Neon Glow Canvas Renderer
import { WEAPONS } from './combat.js?v=74';
import { assets } from './assets.js?v=74';

export class GameRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        // Screen Shake
        this.shakeIntensity = 0;
        this.shakeTimer = 0;

        // Screen Flash
        this.flashColor = '#ffffff';
        this.flashAlpha = 0;

        this.gridOffset = 0;
        this.reactorAngle = 0;
    }

    triggerShake(intensity = 8, duration = 12) {
        this.shakeIntensity = intensity;
        this.shakeTimer = duration;
    }

    triggerFlash(color = '#ffffff', alpha = 0.6) {
        this.flashColor = color;
        this.flashAlpha = alpha;
    }

    update(dt = 1) {
        if (this.shakeTimer > 0) {
            this.shakeTimer -= dt;
            if (this.shakeTimer <= 0) {
                this.shakeIntensity = 0;
            }
        }
        if (this.flashAlpha > 0) {
            this.flashAlpha = Math.max(0, this.flashAlpha - 0.04 * dt);
        }
        this.gridOffset = (this.gridOffset + 0.4 * dt) % 40;
        this.reactorAngle += 0.015 * dt;
    }

    // --- ARENA DRAWING (VIBRANT SCENIC BRAWLHALLA-STYLE STAGE) ---
    drawArena(bounds) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.save();

        // Screen Shake offset
        if (this.shakeTimer > 0) {
            const rx = (Math.random() - 0.5) * this.shakeIntensity * 2;
            const ry = (Math.random() - 0.5) * this.shakeIntensity * 2;
            ctx.translate(rx, ry);
        }

        const arenaW = bounds.maxX - bounds.minX;
        const arenaH = bounds.maxY - bounds.minY;

        // 1. Draw Full-Screen Scenic Background Art
        const bgImg = assets.getImage('background');
        if (bgImg) {
            ctx.drawImage(bgImg, 0, 0, w, h);
        } else {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, w, h);
        }

        // 2. Subtle Stage Combat Area Boundary Line (Clean dashed border)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([8, 8]);
        ctx.strokeRect(bounds.minX, bounds.minY, arenaW, arenaH);
        ctx.setLineDash([]);

        // Subtle Corner Accents
        const corners = [
            [bounds.minX, bounds.minY],
            [bounds.maxX, bounds.minY],
            [bounds.minX, bounds.maxY],
            [bounds.maxX, bounds.maxY]
        ];

        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        corners.forEach(([cx, cy]) => {
            ctx.beginPath();
            ctx.arc(cx, cy, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }

    // --- CYBORG / CHARACTER DRAWING ---
    drawCyborg(c) {
        const ctx = this.ctx;
        ctx.save();

        if (this.shakeTimer > 0) {
            const rx = (Math.random() - 0.5) * this.shakeIntensity * 2;
            const ry = (Math.random() - 0.5) * this.shakeIntensity * 2;
            ctx.translate(rx, ry);
        }

        // 1. Clean Aiming Guide Line (Subtle white line)
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x + Math.cos(c.aimAngle) * 260, c.y + Math.sin(c.aimAngle) * 260);
        ctx.stroke();

        const pipX = c.x + Math.cos(c.aimAngle) * 85;
        const pipY = c.y + Math.sin(c.aimAngle) * 85;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pipX, pipY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 2. Character State & Active Pose
        let pose = 'idle';
        if (c.isDead || c.hp <= 0) pose = 'dead';
        else if (c.isStunned) pose = 'hurt';
        else if (c.isUsingUltimate) pose = 'ultimate';
        else if (c.isUsingSkill) pose = 'attack_heavy';
        else if (c.isShielding) pose = 'shield';
        else if (c.isAttacking) pose = 'attack_heavy';
        else if (c.isBoosted) pose = 'attack_light';
        else if (Math.hypot(c.vx, c.vy) > 0.8) pose = 'thrust';

        // ALWAYS USE 1 SINGLE BASE IMAGE (thay vì đổi nhiều ảnh)
        const customSprite = assets.getCharacterSprite(c.characterId, 'idle');

        // Draw Projection Afterimages (e.g. Naoya's 24 FPS Afterimages)
        if (c.afterimages && c.afterimages.length > 0 && customSprite) {
            const targetH = 135;
            const aspect = (customSprite.naturalWidth && customSprite.naturalHeight) 
                ? (customSprite.naturalWidth / customSprite.naturalHeight) 
                : 1;
            const targetW = targetH * aspect;
            const pivotY = 48;

            c.afterimages.forEach(ai => {
                ctx.save();
                ctx.translate(ai.x, ai.y);
                ctx.scale(ai.facingDir, 1);
                ctx.translate(0, pivotY);

                // Cel-shaded green projection aura
                ctx.globalAlpha = ai.alpha * 0.75;
                ctx.shadowColor = '#a3e635';
                ctx.shadowBlur = 18;
                ctx.drawImage(customSprite, -targetW / 2, -targetH, targetW, targetH);

                // 24 FPS Film Frame Border on afterimage
                ctx.strokeStyle = '#a3e635';
                ctx.lineWidth = 2;
                ctx.strokeRect(-targetW / 2 - 4, -targetH - 4, targetW + 8, targetH + 8);

                ctx.restore();
            });
        }

        // Position Character
        ctx.translate(c.x, c.y);

        // Facing Direction: Character stays UPRIGHT, flips Left/Right towards aim/movement
        const facingDir = Math.cos(c.aimAngle) >= 0 ? 1 : -1;
        ctx.scale(facingDir, 1);

        // Soft drop shadow under feet
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(0, 48, 30, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        if (customSprite) {
            // --- FULL ANIME CHARACTER SPRITE (SINGLE IMAGE ADVANCED PROCEDURAL ANIMATION) ---
            ctx.save();
            const targetH = 135;
            const aspect = (customSprite.naturalWidth && customSprite.naturalHeight) 
                ? (customSprite.naturalWidth / customSprite.naturalHeight) 
                : 1;
            const targetW = targetH * aspect;
            const pivotY = 48; // Đặt tâm xoay ở dưới chân (feet level)
            
            // Chuyển tâm (pivot) về dưới chân để khi xoay, nghiêng không bị lơ lửng
            ctx.translate(0, pivotY);

            // Dynamic Action Transformations on the SINGLE image
            if (pose === 'dead') {
                const dt = c.deathTimer || 0;

                // 1. Phim hoạt họa cái chết nhiều giai đoạn (Multi-phase anime KO animation)
                if (dt < 22) {
                    // Giai đoạn 1 (frames 0 - 22): Cú đánh kết liễu - giật lùi dữ dội, ngửa cổ ra sau, rung lắc chấn động
                    const reelProgress = dt / 22;
                    const reelAngle = -0.55 * Math.sin(reelProgress * Math.PI / 2);
                    ctx.rotate(reelAngle);
                    ctx.scale(1.15, 0.85); // Kéo biến dạng va đập
                    ctx.translate(-25 * reelProgress, -12 * Math.sin(reelProgress * Math.PI));
                    ctx.filter = 'drop-shadow(0 0 25px rgba(239, 68, 68, 0.95)) sepia(100%) hue-rotate(-50deg) saturate(450%) contrast(150%)';
                } else if (dt < 65) {
                    // Giai đoạn 2 (frames 22 - 65): Lộn ngược trong môi trường không trọng lực (Zero-G spin) & gục ngã dần xuống sàn
                    const fallProgress = (dt - 22) / 43;
                    const baseRot = -0.55;
                    const targetRot = -Math.PI / 2; // Nằm ngang 90 độ
                    const currentRot = baseRot + (targetRot - baseRot) * Math.sin(fallProgress * Math.PI / 2);

                    ctx.rotate(currentRot);
                    ctx.translate(-25 + fallProgress * 15, fallProgress * 20);

                    // Nhấp nháy hologram lỗi kết nối (glitch flickering)
                    const flicker = Math.sin(dt * 1.2) > 0 ? 0.95 : 0.65;
                    ctx.globalAlpha = flicker;
                    ctx.filter = `drop-shadow(0 0 15px ${c.color}) grayscale(${Math.round(fallProgress * 70)}%) brightness(90%)`;
                } else {
                    // Giai đoạn 3 (frames 65+): Đã ngã gục hoàn toàn (Defeated / Offline)
                    ctx.rotate(-Math.PI / 2);
                    ctx.scale(1.18, 0.72); // Bị ép phẳng xuống sàn
                    ctx.translate(-10, 22);

                    // Tông màu xám kim loại mất điện (depleted power)
                    ctx.globalAlpha = 0.65;
                    ctx.filter = 'grayscale(100%) brightness(40%) drop-shadow(0 0 8px rgba(0, 0, 0, 0.8))';
                }

                // Digital Scanline Glitch Slices (Vỡ ảnh kỹ thuật số khi trúng đòn tử trận)
                if (dt < 55) {
                    const slices = 4;
                    const sliceH = targetH / slices;
                    for (let s = 0; s < slices; s++) {
                        const glitchOffset = (Math.sin(dt * 0.8 + s * 1.7) > 0.3) ? (Math.sin(s * 99) * 12) : 0;
                        ctx.drawImage(
                            customSprite,
                            0, s * (customSprite.naturalHeight / slices),
                            customSprite.naturalWidth, customSprite.naturalHeight / slices,
                            -targetW / 2 + glitchOffset, -targetH + s * sliceH,
                            targetW, sliceH
                        );
                    }
                } else {
                    ctx.drawImage(customSprite, -targetW / 2, -targetH, targetW, targetH);
                }

                // Holographic Defeated HUD Emblem (Huy hiệu K.O. OFFLINE nổi trên người)
                if (dt > 25) {
                    ctx.save();
                    ctx.rotate(Math.PI / 2); // Xoay ngược lại thẳng đứng
                    ctx.translate(-targetH * 0.45, -targetW * 0.6);

                    const hudAlpha = Math.min(1, (dt - 25) / 25);
                    ctx.globalAlpha = hudAlpha * (0.85 + Math.sin(dt * 0.15) * 0.15);

                    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
                    ctx.strokeStyle = '#ef4444';
                    ctx.lineWidth = 1.5;
                    ctx.shadowColor = '#ef4444';
                    ctx.shadowBlur = 12;

                    const boxW = 110;
                    const boxH = 22;
                    ctx.fillRect(-boxW / 2, -boxH / 2, boxW, boxH);
                    ctx.strokeRect(-boxW / 2, -boxH / 2, boxW, boxH);

                    ctx.fillStyle = '#f8fafc';
                    ctx.font = "900 11px 'Orbitron', monospace";
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('💀 K.O. - OFFLINE', 0, 0);
                    ctx.restore();
                }

                ctx.restore();
                ctx.restore();
                return;
            } else if (pose === 'attack_light') {
                // Lao tới, nghiêng người và kéo giãn tạo cảm giác chém nhanh
                ctx.rotate(0.35); 
                ctx.scale(1.15, 0.9); // Kéo dài theo trục X, ép trục Y
                ctx.translate(15, 0);
                
                // Hiệu ứng bóng mờ (Motion Blur)
                ctx.globalAlpha = 0.4;
                ctx.drawImage(customSprite, -targetW / 2 - 20, -targetH, targetW, targetH);
                ctx.globalAlpha = 1.0;
            } else if (pose === 'attack_heavy') {
                // Chém mạnh: Xoay gập người xuống sâu
                ctx.rotate(0.55);
                ctx.scale(1.2, 0.85);
                ctx.translate(25, 0);
                
                ctx.globalAlpha = 0.3;
                ctx.drawImage(customSprite, -targetW / 2 - 30, -targetH, targetW, targetH);
                ctx.globalAlpha = 1.0;
            } else if (pose === 'hurt') {
                // Bị thương: Ngửa ra sau, nén người lại (squash)
                ctx.rotate(-0.4);
                ctx.scale(1.1, 0.7); 
                ctx.translate(-20, 10);
            } else if (pose === 'shield') {
                // Đỡ đòn: Co ro người lại
                ctx.rotate(-0.1);
                ctx.scale(0.95, 0.95);
                ctx.translate(-5, 0);
            } else if (pose === 'thrust') {
                // Đang chạy lướt: Nghiêng tới trước
                ctx.rotate(0.2);
                ctx.scale(1.05, 0.95);
                ctx.translate(15, 0);
            } else {
                // Đứng yên: Nhịp thở tự nhiên (co giãn theo nhịp điệu)
                const time = Date.now() * 0.004;
                const bob = Math.sin(time + c.index * 2) * 2.5;
                const breath = 1 + Math.sin(time * 0.8) * 0.025; // Nhịp phập phồng
                ctx.translate(0, bob);
                ctx.scale(1 / breath, breath); // Ép một trục, giãn một trục để giữ thể tích
            }

            // Damage flash tint if hurt (Nháy đỏ nguyên người)
            if (c.isStunned) {
                ctx.filter = 'drop-shadow(0 0 15px rgba(239, 68, 68, 0.9)) sepia(100%) hue-rotate(-50deg) saturate(400%)';
            }

            // Vẽ ảnh gốc tại toạ độ đã được transform
            ctx.drawImage(customSprite, -targetW / 2, -targetH, targetW, targetH);

            // 24 FPS Celluloid Projection Frame Effect (Hiệu ứng đóng băng khung hình 24 FPS)
            if (c.frameFrozenTimer > 0) {
                ctx.save();
                ctx.strokeStyle = '#a3e635';
                ctx.lineWidth = 3;
                ctx.shadowColor = '#a3e635';
                ctx.shadowBlur = 15;
                const fw = targetW + 22;
                const fh = targetH + 16;
                const fx = -fw / 2;
                const fy = -targetH - 8;
                // Film border
                ctx.strokeRect(fx, fy, fw, fh);
                // Film perforations (sprocket holes)
                ctx.fillStyle = '#0f172a';
                for (let py = fy + 6; py < fy + fh - 10; py += 16) {
                    ctx.fillRect(fx + 2, py, 5, 8);
                    ctx.fillRect(fx + fw - 7, py, 5, 8);
                }
                // Text label
                ctx.fillStyle = '#a3e635';
                ctx.font = 'bold 9px Orbitron, sans-serif';
                ctx.fillText('24 FPS', fx + 10, fy + 14);
                ctx.restore();
            }

            ctx.restore();
        } else {
            // PROCEDURAL ANIME WARRIOR (Fallback)
            ctx.save();
            const isYanagi = c.characterId === 'yanagi';

            if (pose === 'dead') {
                ctx.rotate(-Math.PI / 2);
                ctx.translate(-15, 25);
                ctx.filter = 'grayscale(100%) brightness(50%)';
            } else if (pose === 'attack_light') ctx.translate(20, 0);
            else if (pose === 'attack_heavy') ctx.translate(32, 0);
            else if (pose === 'hurt') ctx.translate(-16, 0);
            else ctx.translate(0, Math.sin(Date.now() * 0.005 + c.index * 2) * 2);

            if (isYanagi) {
                // Tsukishiro Yanagi (Purple hair, dark agent coat)
                ctx.fillStyle = '#6b32a8';
                ctx.beginPath();
                ctx.ellipse(-12, -10, 16, 22, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#1e293b';
                ctx.fillRect(-10, 0, 20, 42);

                ctx.fillStyle = '#fde047';
                ctx.fillRect(-2, 4, 4, 12);

                ctx.fillStyle = '#ffedd5';
                ctx.beginPath();
                ctx.arc(4, -14, 12, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#8e44ad';
                ctx.beginPath();
                ctx.arc(4, -14, 12, -Math.PI * 0.5, Math.PI * 0.5);
                ctx.fill();
            } else {
                // Velina Airgid (Silver hair, dark dress)
                ctx.fillStyle = '#e2e8f0';
                ctx.beginPath();
                ctx.ellipse(-14, -8, 14, 24, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#0f172a';
                ctx.fillRect(-10, 0, 20, 42);

                ctx.fillStyle = '#10b981';
                ctx.fillRect(-2, 6, 4, 8);

                ctx.fillStyle = '#ffedd5';
                ctx.beginPath();
                ctx.arc(4, -14, 12, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#f8fafc';
                ctx.beginPath();
                ctx.arc(4, -14, 12, -Math.PI * 0.5, Math.PI * 0.5);
                ctx.fill();
            }
            ctx.restore();
        }

        // --- 3. CLEAN ELEMENTAL SLASH WAVE (NO DUAL BLADE STICKS!) ---
        if (c.isAttacking && !c.isShooting) {
            const swingProgress = c.attackTimer / c.attackDuration;
            const startAngle = -0.9 + swingProgress * 1.8;

            ctx.save();
            const isYanagi = c.characterId === 'yanagi';

            if (c.characterId === 'naoya') {
                // Naoya: 24 FPS High-Speed Lime Green Projection Slashes
                ctx.strokeStyle = '#a3e635';
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.arc(15, 0, c.attackReach, startAngle - 0.8, startAngle + 0.8);
                ctx.stroke();
                ctx.strokeStyle = '#facc15';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(15, 0, c.attackReach * 0.85, startAngle - 0.5, startAngle + 0.5);
                ctx.stroke();
            } else if (c.characterId === 'luffy') {
                // Luffy: Rubber Stretched Red Haki Fist Shockwave
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 7;
                ctx.beginPath();
                ctx.arc(25, 0, c.attackReach, startAngle - 0.6, startAngle + 0.6);
                ctx.stroke();
                ctx.fillStyle = '#1e1b4b';
                ctx.beginPath();
                ctx.arc(15 + Math.cos(startAngle) * (c.attackReach * 0.9), Math.sin(startAngle) * (c.attackReach * 0.9), 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#ef4444';
                ctx.stroke();
            } else if (c.characterId === 'gojo') {
                // Gojo: Black Flash Spatial Cursed Punch Burst
                ctx.strokeStyle = '#0284c7';
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.arc(15, 0, c.attackReach, startAngle - 0.7, startAngle + 0.7);
                ctx.stroke();
                ctx.strokeStyle = '#dc2626';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(15, 0, c.attackReach * 0.9, startAngle - 0.4, startAngle + 0.4);
                ctx.stroke();
            } else if (c.characterId === 'sukuna') {
                // Sukuna: Dismantle Sharp Crimson Slashing Grid
                ctx.strokeStyle = '#f43f5e';
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.arc(15, 0, c.attackReach, startAngle - 0.9, startAngle + 0.9);
                ctx.stroke();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(20, -10, c.attackReach * 0.95, startAngle - 0.7, startAngle + 0.3);
                ctx.stroke();
            } else if (isYanagi) {
                // Sharp Electric Purple / Blue Crescent Slash
                ctx.strokeStyle = swingProgress < 0.5 ? '#38bdf8' : '#a855f7';
                ctx.lineWidth = c.attackType === 'heavy' ? 8 : 4;
                ctx.beginPath();
                ctx.arc(15, 0, c.attackReach, startAngle - 0.7, startAngle + 0.7);
                ctx.stroke();

                // Electric spark line
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(15, 0, c.attackReach * 0.85, startAngle - 0.4, startAngle + 0.4);
                ctx.stroke();
            } else {
                // Sharp Wind Emerald Crescent Slash
                ctx.strokeStyle = '#34d399';
                ctx.lineWidth = c.attackType === 'heavy' ? 8 : 4;
                ctx.beginPath();
                ctx.arc(15, 0, c.attackReach, startAngle - 0.7, startAngle + 0.7);
                ctx.stroke();

                // White wind streak
                ctx.strokeStyle = '#f0fdf4';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(15, 0, c.attackReach * 0.85, startAngle - 0.4, startAngle + 0.4);
                ctx.stroke();
            }

            ctx.restore();
        }

        // 4. Energy Shield (Clean Hexagonal Barrier)
        if (c.isShielding) {
            ctx.save();
            const isParry = c.shieldTimer <= 10;
            ctx.strokeStyle = isParry ? '#ffffff' : (c.characterId === 'yanagi' ? '#38bdf8' : '#34d399');
            ctx.fillStyle = isParry ? 'rgba(255, 255, 255, 0.25)' : 'rgba(56, 189, 248, 0.12)';
            ctx.lineWidth = isParry ? 4 : 2;

            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                const sx = 20 + Math.cos(angle) * 36;
                const sy = Math.sin(angle) * 44;
                if (i === 0) ctx.moveTo(sx, sy);
                else ctx.lineTo(sx, sy);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }

        // 5. Stun Stars
        if (c.isStunned) {
            ctx.save();
            ctx.translate(0, -68);
            const time = Date.now() * 0.008;
            for (let i = 0; i < 3; i++) {
                const angle = time + (i / 3) * Math.PI * 2;
                const sx = Math.cos(angle) * 18;
                const sy = Math.sin(angle) * 6;
                ctx.fillStyle = '#facc15';
                ctx.beginPath();
                ctx.arc(sx, sy, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // 6. Character-Specific Ultimate Visuals
        if (c.isUsingUltimate && c.ultimateTimer > 10) {
            ctx.save();
            const pulse = Math.sin(c.ultimateTimer * 0.5) * 5;

            if (c.characterId === 'yanagi') {
                // YANAGI: KAMEHAMEHA-STYLE LIGHTNING BEAM
                const beamLen = 1500;
                ctx.lineCap = 'round';

                // Outer Glow Layer
                ctx.shadowColor = '#a855f7';
                ctx.shadowBlur = 40;
                ctx.strokeStyle = '#a855f7';
                ctx.lineWidth = 100 + pulse;
                ctx.globalAlpha = 0.4;
                ctx.beginPath();
                ctx.moveTo(60, 0);
                ctx.lineTo(beamLen, 0);
                ctx.stroke();

                // Mid Layer
                ctx.shadowBlur = 20;
                ctx.strokeStyle = '#d8b4fe';
                ctx.lineWidth = 50 + pulse * 0.5;
                ctx.globalAlpha = 0.8;
                ctx.beginPath();
                ctx.moveTo(60, 0);
                ctx.lineTo(beamLen, 0);
                ctx.stroke();

                // Core Energy Layer
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#ffffff';
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 20;
                ctx.globalAlpha = 1.0;
                ctx.beginPath();
                ctx.moveTo(60, 0);
                ctx.lineTo(beamLen, 0);
                ctx.stroke();

                // MASSIVE Energy Ball at the palms (Kamehameha origin)
                const ballRadius = 65 + pulse * 2;
                ctx.beginPath();
                ctx.arc(45, 0, ballRadius, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#d8b4fe';
                ctx.shadowBlur = 50;
                ctx.fill();
                
                ctx.beginPath();
                ctx.arc(45, 0, ballRadius * 0.6, 0, Math.PI * 2);
                ctx.fillStyle = '#a855f7';
                ctx.fill();

                // Dynamic lightning arcs wrapping the beam
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 3;
                ctx.beginPath();
                for (let x = 60; x < 800; x += 40) {
                    const y = Math.sin(x * 0.05 - c.ultimateTimer * 0.5) * (40 + Math.random() * 20);
                    if (x === 60) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();

            } else if (c.characterId === 'velina') {
                // VELINA: STORM OF LIFE
                const stormRadius = 80 + c.ultimateTimer * 5;
                ctx.shadowColor = '#34d399';
                ctx.shadowBlur = 30;
                ctx.strokeStyle = '#6ee7b7';
                ctx.lineWidth = 25 + pulse;
                ctx.globalAlpha = 0.6;
                ctx.beginPath();
                ctx.arc(0, 0, stormRadius, 0, Math.PI * 2);
                ctx.stroke();

                ctx.fillStyle = '#34d399';
                ctx.globalAlpha = 0.2;
                ctx.beginPath();
                ctx.arc(0, 0, stormRadius * 0.8, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 4;
                ctx.globalAlpha = 0.8;
                for(let i=0; i<4; i++) {
                    ctx.save();
                    ctx.rotate(c.ultimateTimer * 0.2 + (i * Math.PI / 2));
                    ctx.beginPath();
                    ctx.arc(0, 0, stormRadius * (0.4 + i*0.15), 0, Math.PI * 0.7);
                    ctx.stroke();
                    ctx.restore();
                }
            } else if (c.characterId === 'nicole') {
                // NICOLE: GRAVITATIONAL SINGULARITY (HỐ ĐEN TRỌNG LỰC)
                const holeDist = 320;
                ctx.save();
                ctx.translate(holeDist, 0);
                const bhRadius = 55 + pulse * 2;

                // Event Horizon
                ctx.shadowColor = '#ec4899';
                ctx.shadowBlur = 40;
                ctx.fillStyle = '#05020a';
                ctx.beginPath();
                ctx.arc(0, 0, bhRadius, 0, Math.PI * 2);
                ctx.fill();

                // Swirling Accretion Disk
                ctx.strokeStyle = '#f472b6';
                ctx.lineWidth = 14;
                ctx.globalAlpha = 0.85;
                for(let i = 0; i < 3; i++) {
                    ctx.save();
                    ctx.rotate(-c.ultimateTimer * 0.25 + (i * Math.PI * 2 / 3));
                    ctx.beginPath();
                    ctx.ellipse(0, 0, bhRadius * 1.5, bhRadius * 0.6, 0.4, 0, Math.PI * 1.6);
                    ctx.stroke();
                    ctx.restore();
                }
                ctx.restore();
            } else if (c.characterId === 'trigger') {
                // TRIGGER: PRECISION SNIPER RAILGUN
                const beamLen = 1600;
                ctx.lineCap = 'butt';

                // Red targeting laser
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(35, 0);
                ctx.lineTo(beamLen, 0);
                ctx.stroke();

                // Piercing Electric Rail
                ctx.shadowColor = '#38bdf8';
                ctx.shadowBlur = 35;
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 36 + pulse;
                ctx.beginPath();
                ctx.moveTo(40, 0);
                ctx.lineTo(beamLen, 0);
                ctx.stroke();

                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(40, 0);
                ctx.lineTo(beamLen, 0);
                ctx.stroke();

                // Sonic Rings
                for(let i=0; i<6; i++) {
                    const ringX = 80 + i * 200 + (c.ultimateTimer * 20) % 200;
                    ctx.strokeStyle = '#38bdf8';
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.ellipse(ringX, 0, 8, 30, 0, 0, Math.PI * 2);
                    ctx.stroke();
                }
            } else if (c.characterId === 'vivian') {
                // VIVIAN: BANSHEE BLOOM (BÃO LÔNG VŨ ETHER - RANGE 500)
                const bloomRadius = 460 + pulse * 8;
                ctx.shadowColor = '#c084fc';
                ctx.shadowBlur = 40;

                // Glowing outer ether shockwave ring
                ctx.strokeStyle = 'rgba(192, 132, 252, 0.45)';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(0, 0, bloomRadius, 0, Math.PI * 2);
                ctx.stroke();

                // Feather vortex across 500px range
                for(let i=0; i<18; i++) {
                    const angle = c.ultimateTimer * 0.15 + (i * Math.PI * 2 / 18);
                    const r = 60 + (i * 24);
                    const fx = Math.cos(angle) * r;
                    const fy = Math.sin(angle) * r;
                    ctx.save();
                    ctx.translate(fx, fy);
                    ctx.rotate(angle + Math.PI / 2);
                    ctx.fillStyle = i % 2 === 0 ? '#e879f9' : '#c084fc';
                    ctx.beginPath();
                    ctx.ellipse(0, 0, 9, 26, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            } else if (c.characterId === 'jotaro') {
                // JOTARO: THE WORLD TIME STOP + STAR PLATINUM ORA ORA
                // Chromatic Time Stop Pulse
                ctx.shadowColor = '#818cf8';
                ctx.shadowBlur = 40;
                ctx.strokeStyle = '#818cf8';
                ctx.lineWidth = 8;
                ctx.strokeRect(-120, -120, 240, 240);

                // Star Platinum Phantom Fists Barrage
                for(let i=0; i<8; i++) {
                    const fistX = 40 + Math.random() * 120;
                    const fistY = -50 + Math.random() * 100;
                    ctx.save();
                    ctx.translate(fistX, fistY);
                    ctx.fillStyle = '#6366f1';
                    ctx.globalAlpha = 0.7;
                    ctx.beginPath();
                    ctx.arc(0, 0, 18, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(-4, -4, 7, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            } else if (c.characterId === 'goku') {
                // GOKU: SUPER SAIYAN MEGA KAMEHAMEHA
                const beamLen = 1500;
                ctx.lineCap = 'round';

                // Golden Super Saiyan Ki Wave
                ctx.shadowColor = '#fbbf24';
                ctx.shadowBlur = 45;
                ctx.strokeStyle = '#fbbf24';
                ctx.lineWidth = 120 + pulse * 2;
                ctx.globalAlpha = 0.5;
                ctx.beginPath();
                ctx.moveTo(50, 0);
                ctx.lineTo(beamLen, 0);
                ctx.stroke();

                // Core Blue/White Energy Wave
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 60 + pulse;
                ctx.globalAlpha = 0.85;
                ctx.beginPath();
                ctx.moveTo(50, 0);
                ctx.lineTo(beamLen, 0);
                ctx.stroke();

                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 24;
                ctx.globalAlpha = 1.0;
                ctx.beginPath();
                ctx.moveTo(50, 0);
                ctx.lineTo(beamLen, 0);
                ctx.stroke();

                // Giant Golden Energy Orb at palms
                const orbR = 75 + pulse * 3;
                ctx.beginPath();
                ctx.arc(50, 0, orbR, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#f59e0b';
                ctx.shadowBlur = 60;
                ctx.fill();
            } else if (c.characterId === 'giorno') {
                // GIORNO: RETURN TO ZERO (GER) GOLDEN ARRAYS
                ctx.shadowColor = '#facc15';
                ctx.shadowBlur = 35;
                ctx.strokeStyle = '#facc15';
                ctx.lineWidth = 6;

                // Golden Life Aura Rings
                for(let i=1; i<=3; i++) {
                    ctx.beginPath();
                    ctx.arc(0, 0, 50 * i + pulse * 2, 0, Math.PI * 2);
                    ctx.stroke();
                }

                // Rapid GER Gold Punches
                for(let i=0; i<6; i++) {
                    const px = 45 + Math.random() * 90;
                    const py = -40 + Math.random() * 80;
                    ctx.save();
                    ctx.translate(px, py);
                    ctx.fillStyle = '#facc15';
                    ctx.globalAlpha = 0.8;
                    ctx.beginPath();
                    ctx.arc(0, 0, 16, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            } else if (c.characterId === 'naoya') {
                // NAOYA: MACH 3 PROJECTION SORCERY MULTI-DASH BARRAGE (10 FPS OPTIMIZED - ZERO LAG)
                const zoneR = 340;
                ctx.save();
                ctx.strokeStyle = 'rgba(163, 230, 53, 0.45)';
                ctx.lineWidth = 2.5;
                ctx.setLineDash([12, 8]);
                ctx.beginPath();
                ctx.arc(0, 0, zoneR, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);

                // Mach 3 Supersonic Zigzag Dash Lines (Crisp neon, reduced path overhead)
                ctx.strokeStyle = '#bef264';
                ctx.lineWidth = 3;
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const a1 = (c.ultimateTimer * 0.35 + i * (Math.PI * 2 / 5)) % (Math.PI * 2);
                    const r1 = 80 + (i % 3) * 70;
                    const x1 = Math.cos(a1) * r1;
                    const y1 = Math.sin(a1) * r1;
                    const a2 = a1 + 2.0;
                    const x2 = Math.cos(a2) * (r1 + 45);
                    const y2 = Math.sin(a2) * (r1 + 45);
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                }
                ctx.stroke();

                // Celluloid film frame afterimages scattered across zone (10 FPS)
                for (let i = 0; i < 4; i++) {
                    const fa = c.ultimateTimer * 0.15 + i * 1.57;
                    const fx = Math.cos(fa) * 160;
                    const fy = Math.sin(fa) * 110;
                    ctx.strokeStyle = 'rgba(163, 230, 53, 0.65)';
                    ctx.lineWidth = 1.5;
                    ctx.strokeRect(fx - 20, fy - 25, 40, 50);
                    ctx.fillStyle = '#a3e635';
                    ctx.font = '7px Orbitron, sans-serif';
                    ctx.fillText('10 FPS', fx - 16, fy - 14);
                }
                ctx.restore();

            } else if (c.characterId === 'luffy') {
                // LUFFY: GOMU GOMU NO BAJRANG GUN (COLOSSAL HAKI FIST DESCENDING FROM STORM CLOUDS)
                ctx.save();
                const forwardOffset = 180;
                ctx.translate(forwardOffset, 0);

                // 1. Dark Thunderclouds Gathering Above
                ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
                ctx.beginPath();
                ctx.ellipse(0, -220, 260, 70, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
                ctx.beginPath();
                ctx.ellipse(0, -200, 210, 55, 0, 0, Math.PI * 2);
                ctx.fill();

                // 2. Black & Crimson Conqueror's Haki Lightning Bolts Crackling Down
                for (let i = 0; i < 6; i++) {
                    ctx.strokeStyle = i % 2 === 0 ? '#ef4444' : '#000000';
                    ctx.lineWidth = i % 2 === 0 ? 3 : 5;
                    ctx.shadowColor = '#ef4444';
                    ctx.shadowBlur = 20;
                    ctx.beginPath();
                    let lx = -140 + i * 55 + Math.sin(c.ultimateTimer + i) * 20;
                    let ly = -210;
                    ctx.moveTo(lx, ly);
                    for (let seg = 0; ly < 60; seg++) {
                        lx += (Math.random() - 0.5) * 35;
                        ly += 30 + Math.random() * 20;
                        ctx.lineTo(lx, ly);
                    }
                    ctx.stroke();
                }

                // 3. Colossal Armament Haki Fist Descending
                const slamProgress = Math.min(1, (c.ultimateTimer - 15) / 20);
                const fistY = -180 + slamProgress * 180;
                const fistRadius = 110 + pulse * 2;

                // Impact Shockwave Rings on ground
                if (slamProgress > 0.4) {
                    ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
                    ctx.lineWidth = 6;
                    ctx.beginPath();
                    ctx.ellipse(0, 40, 180 + pulse * 10, 45 + pulse * 4, 0, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.ellipse(0, 40, 120 + pulse * 6, 30 + pulse * 2, 0, 0, Math.PI * 2);
                    ctx.stroke();
                }

                // The Colossal Black Fist Body
                ctx.shadowColor = '#ef4444';
                ctx.shadowBlur = 35;
                ctx.fillStyle = '#0a0a0f'; // Jet black armament Haki
                ctx.strokeStyle = '#dc2626';
                ctx.lineWidth = 5;

                ctx.beginPath();
                ctx.arc(0, fistY, fistRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Knuckle contours on the giant fist
                for (let k = -2; k <= 2; k++) {
                    ctx.fillStyle = '#1e1b4b';
                    ctx.strokeStyle = '#f87171';
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    ctx.ellipse(k * 36, fistY + fistRadius * 0.45, 18, 26, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                }

                // Metallic specular sheen on Haki
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.arc(-25, fistY - 30, fistRadius * 0.55, -Math.PI * 0.8, -Math.PI * 0.2);
                ctx.stroke();

                ctx.restore();

            } else if (c.characterId === 'gojo') {
                // GOJO: DOMAIN EXPANSION - UNLIMITED VOID (VÔ LƯỢNG KHÔNG XỨ)
                ctx.save();
                const domainRadius = 450;

                // Deep Space Void Background Ring
                ctx.shadowColor = '#0284c7';
                ctx.shadowBlur = 45;
                ctx.fillStyle = 'rgba(3, 7, 18, 0.6)';
                ctx.beginPath();
                ctx.arc(0, 0, domainRadius, 0, Math.PI * 2);
                ctx.fill();

                // Cosmic Swirling Nebulae
                for (let i = 0; i < 4; i++) {
                    ctx.save();
                    ctx.rotate(c.ultimateTimer * 0.05 + (i * Math.PI / 2));
                    ctx.strokeStyle = i % 2 === 0 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(168, 85, 247, 0.35)';
                    ctx.lineWidth = 20 + pulse;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, 320, 120, 0.3, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.restore();
                }

                // Glowing Infinity Cosmic Eye Circles
                for (let r = 50; r <= 380; r += 70) {
                    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(0, 0, r + pulse, 0, Math.PI * 2);
                    ctx.stroke();
                }

                // Core Infinite Cyan Singularity at Gojo's location
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#38bdf8';
                ctx.shadowBlur = 50;
                ctx.beginPath();
                ctx.arc(0, 0, 35 + pulse * 2, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();

            } else if (c.characterId === 'sukuna') {
                // SUKUNA: DOMAIN EXPANSION - MALEVOLENT SHRINE (PHỤC MA NGỰ KHẢM TỬ)
                ctx.save();
                const shrineRadius = 420;

                // Blood-Red Domain Realm Atmosphere
                ctx.fillStyle = 'rgba(69, 10, 10, 0.45)';
                ctx.beginPath();
                ctx.arc(0, 0, shrineRadius, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = '#dc2626';
                ctx.lineWidth = 4;
                ctx.shadowColor = '#ef4444';
                ctx.shadowBlur = 30;
                ctx.beginPath();
                ctx.arc(0, 0, shrineRadius, 0, Math.PI * 2);
                ctx.stroke();

                // Sinister Demonic Torii Shrine Silhouette
                ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
                ctx.strokeStyle = '#991b1b';
                ctx.lineWidth = 4;
                // Roof curve
                ctx.beginPath();
                ctx.moveTo(-160, -90);
                ctx.quadraticCurveTo(0, -135, 160, -90);
                ctx.lineTo(130, -75);
                ctx.quadraticCurveTo(0, -115, -130, -75);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                // Pillars
                ctx.fillRect(-90, -75, 24, 110);
                ctx.strokeRect(-90, -75, 24, 110);
                ctx.fillRect(66, -75, 24, 110);
                ctx.strokeRect(66, -75, 24, 110);

                // Relentless Cleave & Dismantle Slashes Grid
                ctx.lineWidth = 2.5;
                for (let i = 0; i < 8; i++) {
                    const sx1 = -320 + Math.random() * 640;
                    const sy1 = -240 + Math.random() * 480;
                    const len = 90 + Math.random() * 110;
                    const sAngle = (i * 0.7 + c.ultimateTimer * 0.4);
                    const sx2 = sx1 + Math.cos(sAngle) * len;
                    const sy2 = sy1 + Math.sin(sAngle) * len;

                    ctx.strokeStyle = i % 2 === 0 ? '#ffffff' : '#f43f5e';
                    ctx.shadowColor = '#f43f5e';
                    ctx.shadowBlur = 15;
                    ctx.beginPath();
                    ctx.moveTo(sx1, sy1);
                    ctx.lineTo(sx2, sy2);
                    ctx.stroke();
                }

                ctx.restore();
            }

            ctx.restore();
        }

        // 7. Overhead Player Indicator Tag (P1 / P2)
        if (!c.isDead && c.hp > 0) {
            ctx.save();
            // Counteract facingDir so text and badge are never flipped horizontally
            ctx.scale(facingDir, 1);

            const isP1 = c.index === 0;
            const tagText = isP1 ? 'P1' : 'P2';
            const tagColor = isP1 ? '#00f0ff' : '#f43f5e';
            const tagY = -94;

            ctx.shadowColor = tagColor;
            ctx.shadowBlur = 8;

            // Badge pill background
            const pillW = 28;
            const pillH = 14;
            ctx.fillStyle = 'rgba(11, 15, 25, 0.88)';
            ctx.strokeStyle = tagColor;
            ctx.lineWidth = 1.2;

            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(-pillW / 2, tagY - pillH / 2, pillW, pillH, 4);
            } else {
                ctx.rect(-pillW / 2, tagY - pillH / 2, pillW, pillH);
            }
            ctx.fill();
            ctx.stroke();

            // Tiny downward pointing indicator triangle
            ctx.fillStyle = tagColor;
            ctx.beginPath();
            ctx.moveTo(-3.5, tagY + pillH / 2);
            ctx.lineTo(3.5, tagY + pillH / 2);
            ctx.lineTo(0, tagY + pillH / 2 + 3.5);
            ctx.closePath();
            ctx.fill();

            // P1 / P2 Text
            ctx.fillStyle = '#ffffff';
            ctx.font = "900 9px 'Orbitron', sans-serif";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(tagText, 0, tagY + 0.5);

            ctx.restore();
        }

        ctx.restore();
    }

    // --- HUD & HEALTH BARS (CLEAN, ELEGANT & MODERN) ---
    drawHUD(p1, p2, matchTimer, roundText = null) {
        const ctx = this.ctx;
        const w = this.canvas.width;

        ctx.save();

        // 1. Player 1 Bars (Left)
        this.drawPlayerStats(p1, 40, 26, false);

        // 2. Player 2 Bars (Right)
        this.drawPlayerStats(p2, w - 40, 26, true);

        // 3. Match Timer Center Badge
        const timerText = Math.ceil(matchTimer).toString().padStart(2, '0');
        const badgeW = 76;
        const badgeH = 46;
        const badgeX = w / 2 - badgeW / 2;
        const badgeY = 16;

        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = `700 26px 'Orbitron', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(timerText, w / 2, badgeY + badgeH / 2);

        // Round Dots (First to 2 wins)
        this.drawRoundPips(p1.roundsWon, w / 2 - 70, 39, '#a78bfa');
        this.drawRoundPips(p2.roundsWon, w / 2 + 70, 39, '#34d399');

        // 4. Central Round Banner Announcement
        if (roundText) {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
            ctx.fillRect(0, this.canvas.height / 2 - 80, w, 90);

            ctx.fillStyle = '#f8fafc';
            ctx.font = `900 44px 'Orbitron', sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(roundText, w / 2, this.canvas.height / 2 - 35);
        }

        // Screen Flash Overlay
        if (this.flashAlpha > 0) {
            ctx.fillStyle = this.flashColor;
            ctx.globalAlpha = this.flashAlpha;
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        ctx.restore();
    }

    drawPlayerStats(p, x, y, isRightSide) {
        const ctx = this.ctx;
        const barWidth = 340;
        const barHeight = 22;
        const startX = isRightSide ? x - barWidth : x;

        // Player Name
        ctx.font = `700 16px 'Orbitron', sans-serif`;
        ctx.textAlign = isRightSide ? 'right' : 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = p.color;
        ctx.fillText(p.name, x, y + 10);

        // HP Bar Container
        const hpY = y + 18;
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.fillRect(startX, hpY, barWidth, barHeight);
        ctx.strokeRect(startX, hpY, barWidth, barHeight);

        // HP Fill
        const hpPercent = Math.max(0, p.hp / p.maxHp);
        const hpFillWidth = barWidth * hpPercent;
        ctx.fillStyle = p.hp > 28 ? p.color : '#ef4444';
        if (isRightSide) {
            ctx.fillRect(x - hpFillWidth, hpY, hpFillWidth, barHeight);
        } else {
            ctx.fillRect(x, hpY, hpFillWidth, barHeight);
        }

        // Numeric HP text (Hiển thị rõ lượng máu: Vivian 650 HP, các nhân vật khác 500 HP)
        ctx.save();
        ctx.font = `700 11px 'Orbitron', sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 4;
        ctx.fillText(`${Math.max(0, Math.ceil(p.hp))} / ${p.maxHp} HP`, startX + barWidth / 2, hpY + barHeight / 2);
        ctx.restore();

        // Energy Bar (Middle bar)
        const energyY = hpY + barHeight + 5;
        const energyHeight = 7;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(startX, energyY, barWidth, energyHeight);

        const energyPercent = Math.max(0, p.energy / p.maxEnergy);
        const energyFillWidth = barWidth * energyPercent;
        ctx.fillStyle = '#38bdf8';
        if (isRightSide) {
            ctx.fillRect(x - energyFillWidth, energyY, energyFillWidth, energyHeight);
        } else {
            ctx.fillRect(x, energyY, energyFillWidth, energyHeight);
        }

        // Overdrive Super Meter (Bottom bar)
        const odY = energyY + energyHeight + 5;
        const odHeight = 8;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(startX, odY, barWidth, odHeight);

        const odPercent = p.overdrive / 100;
        const odFillWidth = barWidth * odPercent;
        const isOdReady = p.overdrive >= 100;

        ctx.fillStyle = isOdReady ? (Date.now() % 400 < 200 ? '#ffffff' : '#f59e0b') : '#d97706';

        if (isRightSide) {
            ctx.fillRect(x - odFillWidth, odY, odFillWidth, odHeight);
        } else {
            ctx.fillRect(x, odY, odFillWidth, odHeight);
        }

        if (isOdReady) {
            ctx.font = `700 11px 'Orbitron', sans-serif`;
            ctx.fillStyle = '#fbbf24';
            ctx.textAlign = isRightSide ? 'left' : 'right';
            ctx.fillText('⚡ OVERDRIVE READY (SPACE) ⚡', isRightSide ? startX : startX + barWidth, odY + 20);
        }
    }

    drawRoundPips(roundsWon, centerX, centerY, color) {
        const ctx = this.ctx;
        for (let i = 0; i < 2; i++) {
            const px = centerX + (i - 0.5) * 20;
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 1.5;
            ctx.fillStyle = i < roundsWon ? color : '#1e293b';
            ctx.beginPath();
            ctx.arc(px, centerY, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    }
}
