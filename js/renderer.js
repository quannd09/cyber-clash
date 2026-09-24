// Cyberpunk Neon Glow Canvas Renderer
import { WEAPONS } from './combat.js?v=76';
import { assets } from './assets.js?v=76';
import { mapManager } from './maps.js?v=76';

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
        this.activeUltimateCutIn = null;
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
        if (this.activeUltimateCutIn) {
            this.activeUltimateCutIn.timer -= dt;
            if (this.activeUltimateCutIn.timer <= 0) {
                this.activeUltimateCutIn = null;
            }
        }
        this.gridOffset = (this.gridOffset + 0.4 * dt) % 40;
        this.reactorAngle += 0.015 * dt;
    }

    // --- ARENA DRAWING (VIBRANT SCENIC BRAWLHALLA-STYLE STAGE) ---
    drawArena(bounds, activeMap = null) {
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
        const map = activeMap || (window.game && window.game.is2v2Mode ? mapManager.currentMap : null);
        let bgImg = null;
        if (map && map.bgKey) {
            bgImg = assets.getImage(map.bgKey);
        }
        if (!bgImg) {
            bgImg = assets.getImage('background');
        }

        if (bgImg) {
            ctx.drawImage(bgImg, 0, 0, w, h);
        } else {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, w, h);
        }

        // Draw terrain platforms if in a map with platforms
        if (map && map.platforms) {
            this.drawPlatforms(map.platforms);
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

    drawPlatforms(platforms) {
        const ctx = this.ctx;
        for (const plat of platforms) {
            ctx.save();
            if (plat.type === 'solid') {
                // High-tech Solid Floating Island / Floor
                ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
                ctx.shadowBlur = 18;
                ctx.shadowOffsetY = 10;

                const grad = ctx.createLinearGradient(plat.x, plat.y, plat.x, plat.y + plat.height);
                grad.addColorStop(0, '#1e293b');
                grad.addColorStop(0.25, '#0f172a');
                grad.addColorStop(1, '#020617');
                ctx.fillStyle = grad;
                ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

                // Glowing neon top surface
                ctx.shadowColor = plat.color || '#38bdf8';
                ctx.shadowBlur = 14;
                ctx.fillStyle = plat.color || '#38bdf8';
                ctx.fillRect(plat.x, plat.y, plat.width, 4);

                // Tech outline
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
                ctx.lineWidth = 1.2;
                ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);

                // Platform label / LED indicator
                ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
                ctx.font = "900 10px 'Orbitron', monospace";
                ctx.fillText(`▰▰ ${plat.label || 'SOLID PLATFORM'} ▰▰`, plat.x + 16, plat.y + 20);

            } else if (plat.type === 'soft') {
                // One-way Soft Energy Rail
                const pulse = Math.sin(Date.now() * 0.005) * 0.2 + 0.8;
                ctx.shadowColor = '#67e8f9';
                ctx.shadowBlur = 14;

                ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
                ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

                // Glowing dual neon rails
                ctx.strokeStyle = `rgba(103, 232, 249, ${pulse})`;
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(plat.x, plat.y);
                ctx.lineTo(plat.x + plat.width, plat.y);
                ctx.moveTo(plat.x, plat.y + plat.height);
                ctx.lineTo(plat.x + plat.width, plat.y + plat.height);
                ctx.stroke();

                // Chevron pass-through indicators
                ctx.strokeStyle = 'rgba(103, 232, 249, 0.55)';
                ctx.lineWidth = 1.5;
                for (let cx = plat.x + 30; cx < plat.x + plat.width - 20; cx += 50) {
                    ctx.beginPath();
                    ctx.moveTo(cx, plat.y + 11);
                    ctx.lineTo(cx + 6, plat.y + 4);
                    ctx.lineTo(cx + 12, plat.y + 11);
                    ctx.stroke();
                }
            }
            ctx.restore();
        }
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

        // ALWAYS USE 1 SINGLE BASE IMAGE (procedural skeletal deformations)
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
            const pivotY = 48; // Pivot set at feet level
            
            // Translate pivot to feet so tilt and rotations keep feet grounded
            ctx.translate(0, pivotY);

            // Dynamic Action Transformations on the SINGLE image
            if (pose === 'dead') {
                const dt = c.deathTimer || 0;

                // 1. Multi-phase anime KO animation
                if (dt < 22) {
                    // Phase 1 (frames 0 - 22): Finishing blow - violent recoil, head snap, camera shake
                    const reelProgress = dt / 22;
                    const reelAngle = -0.55 * Math.sin(reelProgress * Math.PI / 2);
                    ctx.rotate(reelAngle);
                    ctx.scale(1.15, 0.85); // Impact squash & stretch
                    ctx.translate(-25 * reelProgress, -12 * Math.sin(reelProgress * Math.PI));
                    ctx.filter = 'drop-shadow(0 0 25px rgba(239, 68, 68, 0.95)) sepia(100%) hue-rotate(-50deg) saturate(450%) contrast(150%)';
                } else if (dt < 65) {
                    // Phase 2 (frames 22 - 65): Zero-G spin and gradual floor drop
                    const fallProgress = (dt - 22) / 43;
                    const baseRot = -0.55;
                    const targetRot = -Math.PI / 2; // Horizontal 90 deg
                    const currentRot = baseRot + (targetRot - baseRot) * Math.sin(fallProgress * Math.PI / 2);

                    ctx.rotate(currentRot);
                    ctx.translate(-25 + fallProgress * 15, fallProgress * 20);

                    // Hologram connection error glitch flickering
                    const flicker = Math.sin(dt * 1.2) > 0 ? 0.95 : 0.65;
                    ctx.globalAlpha = flicker;
                    ctx.filter = `drop-shadow(0 0 15px ${c.color}) grayscale(${Math.round(fallProgress * 70)}%) brightness(90%)`;
                } else {
                    // Phase 3 (frames 65+): Defeated / Offline state
                    ctx.rotate(-Math.PI / 2);
                    ctx.scale(1.18, 0.72); // Flattened onto floor
                    ctx.translate(-10, 22);

                    // Metallic depleted-power desaturation
                    ctx.globalAlpha = 0.65;
                    ctx.filter = 'grayscale(100%) brightness(40%) drop-shadow(0 0 8px rgba(0, 0, 0, 0.8))';
                }

                // Digital Scanline Glitch Slices on fatal hit
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

                // Holographic Defeated HUD Emblem floating overhead
                if (dt > 25) {
                    ctx.save();
                    ctx.rotate(Math.PI / 2); // Re-orient upright
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
                // Dash forward, lean, and stretch for rapid slash feel
                ctx.rotate(0.35); 
                ctx.scale(1.15, 0.9); // Stretch along X, squash Y
                ctx.translate(15, 0);
                
                // Motion Blur ghost trail
                ctx.globalAlpha = 0.4;
                ctx.drawImage(customSprite, -targetW / 2 - 20, -targetH, targetW, targetH);
                ctx.globalAlpha = 1.0;
            } else if (pose === 'attack_heavy') {
                // Heavy slash: Deep forward lean rotation
                ctx.rotate(0.55);
                ctx.scale(1.2, 0.85);
                ctx.translate(25, 0);
                
                ctx.globalAlpha = 0.3;
                ctx.drawImage(customSprite, -targetW / 2 - 30, -targetH, targetW, targetH);
                ctx.globalAlpha = 1.0;
            } else if (pose === 'hurt') {
                // Hurt: Recoil backward, squash impact
                ctx.rotate(-0.4);
                ctx.scale(1.1, 0.7); 
                ctx.translate(-20, 10);
            } else if (pose === 'shield') {
                // Guard: Defensive crouch
                ctx.rotate(-0.1);
                ctx.scale(0.95, 0.95);
                ctx.translate(-5, 0);
            } else if (pose === 'thrust') {
                // Dash thrust: Forward tilt
                ctx.rotate(0.2);
                ctx.scale(1.05, 0.95);
                ctx.translate(15, 0);
            } else {
                // Idle: Natural breathing rhythm
                const time = Date.now() * 0.004;
                const bob = Math.sin(time + c.index * 2) * 2.5;
                const breath = 1 + Math.sin(time * 0.8) * 0.025; // Breathing pulse
                ctx.translate(0, bob);
                ctx.scale(1 / breath, breath); // Volume-conserving breathing scaling
            }

            // Damage flash tint if hurt
            if (c.isStunned) {
                ctx.filter = 'drop-shadow(0 0 15px rgba(239, 68, 68, 0.9)) sepia(100%) hue-rotate(-50deg) saturate(400%)';
            }

            // Render sprite at transformed coordinates
            ctx.drawImage(customSprite, -targetW / 2, -targetH, targetW, targetH);

            // 24 FPS Celluloid Projection Frame Effect
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
            } else if (c.characterId === 'goku') {
                // Goku: Saiyan Golden Ki Fist Shockwave & Kaioken Fire Arc
                ctx.strokeStyle = c.isBoosted ? '#ef4444' : '#fbbf24';
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.arc(15, 0, c.attackReach, startAngle - 0.7, startAngle + 0.7);
                ctx.stroke();
                ctx.strokeStyle = c.isBoosted ? '#f97316' : '#ffffff';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(18, 0, c.attackReach * 0.85, startAngle - 0.4, startAngle + 0.4);
                ctx.stroke();
            } else if (c.characterId === 'jotaro') {
                // Jotaro: Star Platinum Indigo ORA Punch Shockwave
                ctx.strokeStyle = '#818cf8';
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.arc(15, 0, c.attackReach, startAngle - 0.75, startAngle + 0.75);
                ctx.stroke();
                ctx.strokeStyle = '#c7d2fe';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(18, 0, c.attackReach * 0.85, startAngle - 0.4, startAngle + 0.4);
                ctx.stroke();
            } else if (c.characterId === 'giorno') {
                // Giorno: Gold Experience Radiant Life Energy Arc
                ctx.strokeStyle = '#facc15';
                ctx.lineWidth = 5.5;
                ctx.beginPath();
                ctx.arc(15, 0, c.attackReach, startAngle - 0.7, startAngle + 0.7);
                ctx.stroke();
                ctx.strokeStyle = '#fef08a';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(18, 0, c.attackReach * 0.85, startAngle - 0.4, startAngle + 0.4);
                ctx.stroke();
            } else if (isYanagi) {
                // Sharp Electric Purple / Blue Crescent Slash
                ctx.strokeStyle = swingProgress < 0.5 ? '#38bdf8' : '#a78bfa';
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

        // 5.5 Signature Passive Auras
        if (!c.isDead && !c.isStunned) {
            if (c.characterId === 'gojo') {
                // Gojo: Infinity Barrier Spatial Ripple
                ctx.save();
                const pulse = Math.sin(Date.now() * 0.005) * 3;
                ctx.strokeStyle = 'rgba(2, 132, 199, 0.35)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(0, 0, 48 + pulse, 0, Math.PI * 2);
                ctx.stroke();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(0, 0, 56 + pulse * 1.5, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            } else if (c.characterId === 'goku' && c.isBoosted) {
                // Goku: Kaioken Blazing Crimson Flame Aura
                ctx.save();
                const pulse = Math.sin(Date.now() * 0.015) * 4;
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 2.5;
                ctx.shadowColor = '#dc2626';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(0, 0, 36 + pulse, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }
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
                // NICOLE: GRAVITATIONAL SINGULARITY (BLACK HOLE)
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
                // VIVIAN: BANSHEE BLOOM (ETHER FEATHER STORM - RANGE 500)
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
                // GOJO: DOMAIN EXPANSION - UNLIMITED VOID
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
                // SUKUNA: DOMAIN EXPANSION - MALEVOLENT SHRINE
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

            } else if (c.characterId === 'saitama') {
                // SAITAMA: SERIOUS SERIES - SERIOUS PUNCH! 👊 (BLINK & KINETIC BLOW)
                ctx.save();

                const isPostPunch = (c.ultimateTimer >= 22);
                const punchProgress = Math.min(1, Math.max(0, (c.ultimateTimer - 22) / 25));

                if (!isPostPunch) {
                    // PRE-PUNCH WINDUP (Golden air suction & white-hot core at fist)
                    const windupPulse = Math.sin(c.ultimateTimer * 0.4) * 8;
                    const fistX = 25;

                    // Radiant Golden Aura converging on fist
                    ctx.shadowColor = '#f59e0b';
                    ctx.shadowBlur = 35 + windupPulse;
                    ctx.fillStyle = '#f59e0b';
                    ctx.beginPath();
                    ctx.arc(fistX, 0, 24 + windupPulse, 0, Math.PI * 2);
                    ctx.fill();

                    // Blazing White Hot Core
                    ctx.shadowBlur = 15;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(fistX, 0, 12, 0, Math.PI * 2);
                    ctx.fill();

                    // Air compression lines spiraling inward
                    ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)';
                    ctx.lineWidth = 2.5;
                    for (let i = 0; i < 4; i++) {
                        const angle = c.ultimateTimer * 0.3 + (i * Math.PI / 2);
                        const r = 35 + windupPulse * 0.5;
                        ctx.beginPath();
                        ctx.arc(fistX, 0, r, angle, angle + Math.PI * 0.4);
                        ctx.stroke();
                    }
                } else {
                    // POST-PUNCH: EXPLOSIVE CONICAL SHOCKWAVE BURST & ATMOSPHERE PARTING!
                    const punchFade = 1 - punchProgress;
                    const blastReach = 280 + punchProgress * 420;
                    const blastWidth = 90 + punchProgress * 140;

                    // 1. Conical Atmosphere Parting Shockwave
                    ctx.save();
                    ctx.globalAlpha = punchFade * 0.85;
                    ctx.shadowColor = '#f59e0b';
                    ctx.shadowBlur = 40;
                    ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
                    ctx.beginPath();
                    ctx.moveTo(35, 0);
                    ctx.lineTo(blastReach, -blastWidth);
                    ctx.lineTo(blastReach + 60, 0);
                    ctx.lineTo(blastReach, blastWidth);
                    ctx.closePath();
                    ctx.fill();

                    // 2. White-Hot Kinetic Impact Cone
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                    ctx.beginPath();
                    ctx.moveTo(35, 0);
                    ctx.lineTo(blastReach * 0.7, -blastWidth * 0.5);
                    ctx.lineTo(blastReach * 0.85, 0);
                    ctx.lineTo(blastReach * 0.7, blastWidth * 0.5);
                    ctx.closePath();
                    ctx.fill();

                    // 3. Expanding Sonic Boom Compression Rings
                    for (let r = 0; r < 3; r++) {
                        const ringOffset = 40 + r * 100 + punchProgress * 180;
                        if (ringOffset < blastReach + 100) {
                            ctx.strokeStyle = `rgba(254, 240, 138, ${punchFade * 0.9})`;
                            ctx.lineWidth = 5 - r;
                            ctx.beginPath();
                            ctx.ellipse(ringOffset, 0, 25 + r * 10, 45 + r * 25 + punchProgress * 40, 0, 0, Math.PI * 2);
                            ctx.stroke();
                        }
                    }

                    // 4. Fist Strike Burst Center
                    ctx.fillStyle = '#ffffff';
                    ctx.shadowColor = '#ffffff';
                    ctx.shadowBlur = 30;
                    ctx.beginPath();
                    ctx.arc(45, 0, 20 * punchFade + 8, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.restore();
                }

                ctx.restore();

            } else if (c.characterId === 'megumi') {
                // MEGUMI: EIGHT-HANDLED SWORD DIVERGENT SILA DIVINE GENERAL MAHORAGA ⚔️
                ctx.save();

                // 1. Divine General Mahoraga Titan Winged Silhouette Rising from Shadows
                ctx.save();
                ctx.translate(-20, -60);
                const titanFade = Math.min(1, c.ultimateTimer / 12);
                ctx.globalAlpha = 0.55 * titanFade;
                ctx.shadowColor = '#38bdf8';
                ctx.shadowBlur = 45;

                // Wing canopy (feathered wings spreading wide behind Megumi)
                ctx.fillStyle = '#f8fafc';
                ctx.beginPath();
                // Left wing
                ctx.moveTo(-10, 0);
                ctx.quadraticCurveTo(-100, -110, -210, -50);
                ctx.quadraticCurveTo(-140, 20, -10, 35);
                // Right wing
                ctx.moveTo(10, 0);
                ctx.quadraticCurveTo(100, -110, 210, -50);
                ctx.quadraticCurveTo(140, 20, 10, 35);
                ctx.fill();

                // Muscular shadow titan torso & shoulders
                ctx.fillStyle = '#0f172a';
                ctx.beginPath();
                ctx.moveTo(-55, 40);
                ctx.lineTo(-45, -45);
                ctx.lineTo(-15, -75);
                ctx.lineTo(15, -75);
                ctx.lineTo(45, -45);
                ctx.lineTo(55, 40);
                ctx.closePath();
                ctx.fill();

                // Mahoraga glowing eyes
                ctx.fillStyle = '#38bdf8';
                ctx.shadowColor = '#00f0ff';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(-16, -55, 4, 0, Math.PI * 2);
                ctx.arc(16, -55, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                // 2. The Sacred Eight-Spoked Dharmachakra Wheel (八握の法輪) Hovering Above
                ctx.save();
                ctx.translate(-30, -82);
                ctx.rotate(c.ultimateTimer * 0.14); // Ratchet rotation

                // Divine halo aura
                ctx.shadowColor = '#fbbf24';
                ctx.shadowBlur = 35;

                // Outer golden ring (heavy ornate bevel)
                ctx.strokeStyle = '#d97706';
                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.arc(0, 0, 56, 0, Math.PI * 2);
                ctx.stroke();

                ctx.strokeStyle = '#fbbf24';
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.arc(0, 0, 56, 0, Math.PI * 2);
                ctx.stroke();

                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.arc(0, 0, 56, 0, Math.PI * 2);
                ctx.stroke();

                // Inner ring
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(0, 0, 32, 0, Math.PI * 2);
                ctx.stroke();

                // Central golden hub
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.arc(0, 0, 14, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#38bdf8';
                ctx.beginPath();
                ctx.arc(0, 0, 7, 0, Math.PI * 2);
                ctx.fill();

                // 8 Ornate Spokes with Diamond Arrowheads poking outward
                for (let k = 0; k < 8; k++) {
                    const spkAngle = k * (Math.PI / 4);
                    ctx.save();
                    ctx.rotate(spkAngle);

                    // Spoke bar
                    ctx.strokeStyle = '#fbbf24';
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.moveTo(0, 14);
                    ctx.lineTo(0, 56);
                    ctx.stroke();

                    // Diamond spearhead extending past outer rim
                    ctx.fillStyle = '#ffffff';
                    ctx.strokeStyle = '#d97706';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(0, 72);
                    ctx.lineTo(6, 56);
                    ctx.lineTo(0, 50);
                    ctx.lineTo(-6, 56);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();

                    ctx.restore();
                }
                ctx.restore();

                // 3. Sword of Extermination (退魔の剣) & Colossal Cleave Arc
                const slashProgress = Math.min(1, (c.ultimateTimer - 8) / 26);
                const slashAngle = -Math.PI * 0.45 + slashProgress * Math.PI * 0.9;
                ctx.shadowColor = '#38bdf8';
                ctx.shadowBlur = 45;

                // Outer sacred blade aura
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
                ctx.lineWidth = 36;
                ctx.beginPath();
                ctx.arc(70, 0, 310, slashAngle - 0.55, slashAngle + 0.55);
                ctx.stroke();

                // Searing white positive energy core blade
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 16;
                ctx.beginPath();
                ctx.arc(70, 0, 310, slashAngle - 0.55, slashAngle + 0.55);
                ctx.stroke();

                ctx.restore();

            } else if (c.characterId === 'mirai') {
                // MIRAI: BLOOD CATACLYSM STRIKE (COLOSSAL BLOOD BLADE) 🩸
                ctx.save();
                const slamProgress = Math.min(1, (c.ultimateTimer - 12) / 22);
                const swordY = -220 + slamProgress * 220;

                // Ground blood shockwave ring
                ctx.shadowColor = '#dc2626';
                ctx.shadowBlur = 40;
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 8;
                ctx.beginPath();
                ctx.ellipse(0, 35, 180 + pulse * 12, 45 + pulse * 4, 0, 0, Math.PI * 2);
                ctx.stroke();

                // Giant Blood Sword Blade
                ctx.fillStyle = '#991b1b';
                ctx.strokeStyle = '#fca5a5';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(0, swordY + 80);        // Sword tip crashing down
                ctx.lineTo(-30, swordY - 180);     // Left guard
                ctx.lineTo(-45, swordY - 210);
                ctx.lineTo(0, swordY - 250);       // Pommel
                ctx.lineTo(45, swordY - 210);
                ctx.lineTo(30, swordY - 180);      // Right guard
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Blood crystal facets & inner crimson glow
                ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
                ctx.beginPath();
                ctx.moveTo(0, swordY + 70);
                ctx.lineTo(-14, swordY - 170);
                ctx.lineTo(14, swordY - 170);
                ctx.closePath();
                ctx.fill();

                // Crimson blood erupting spikes
                for (let s = -3; s <= 3; s++) {
                    if (s === 0) continue;
                    const spX = s * 45;
                    const spH = (4 - Math.abs(s)) * 28 + Math.random() * 15;
                    ctx.strokeStyle = '#ef4444';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(spX, 35);
                    ctx.lineTo(spX + s * 10, 35 - spH);
                    ctx.stroke();
                }

                ctx.restore();
            }

            ctx.restore();
        }

        // 7. Overhead Player Indicator Tag (P1 / P2 / P3 / P4)
        if (!c.isDead && c.hp > 0) {
            ctx.save();
            ctx.scale(facingDir, 1);

            const tagText = `P${c.index + 1}`;
            const tagColor = c.teamId === 0 
                ? (c.index === 0 ? '#00f0ff' : '#60a5fa') 
                : (c.index === 2 ? '#f43f5e' : '#fb7185');
            const tagY = -94;

            ctx.shadowColor = tagColor;
            ctx.shadowBlur = 8;

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

            ctx.fillStyle = tagColor;
            ctx.beginPath();
            ctx.moveTo(-3.5, tagY + pillH / 2);
            ctx.lineTo(3.5, tagY + pillH / 2);
            ctx.lineTo(0, tagY + pillH / 2 + 3.5);
            ctx.closePath();
            ctx.fill();

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
        if (Array.isArray(p1)) {
            this.drawHUD2v2(p1, matchTimer, roundText);
            return;
        }

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
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 20;
            ctx.fillText(roundText, w / 2, this.canvas.height / 2 - 35);
        }

        ctx.restore();
    }

    // --- 2V2 HUD (DUAL STACKED HEALTH BARS PER TEAM) ---
    drawHUD2v2(players, matchTimer, roundText = null) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        ctx.save();

        const [p1, p2, p3, p4] = players;

        // Team Blue (Left): P1 at y=18, P2 at y=52
        if (p1) this.drawPlayerStatsCompact(p1, 25, 16, false, 'TEAM BLUE (P1)', '#38bdf8');
        if (p2) this.drawPlayerStatsCompact(p2, 25, 52, false, 'TEAM BLUE (P2)', '#60a5fa');

        // Team Red (Right): P3 at y=18, P4 at y=52
        if (p3) this.drawPlayerStatsCompact(p3, w - 25, 16, true, 'TEAM RED (P3)', '#f43f5e');
        if (p4) this.drawPlayerStatsCompact(p4, w - 25, 52, true, 'TEAM RED (P4)', '#fb7185');

        // Center Timer Badge
        const timerText = Math.ceil(matchTimer).toString().padStart(2, '0');
        const badgeW = 68;
        const badgeH = 40;
        const badgeX = w / 2 - badgeW / 2;
        const badgeY = 16;

        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 6);
        else ctx.rect(badgeX, badgeY, badgeW, badgeH);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = `700 22px 'Orbitron', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(timerText, w / 2, badgeY + badgeH / 2);

        // Round score pips
        const blueWins = (p1 && p1.teamRoundsWon) || 0;
        const redWins = (p3 && p3.teamRoundsWon) || 0;
        this.drawRoundPips(blueWins, w / 2 - 62, 36, '#38bdf8');
        this.drawRoundPips(redWins, w / 2 + 62, 36, '#f43f5e');

        // Announcement text
        if (roundText) {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.fillRect(0, this.canvas.height / 2 - 80, w, 90);

            ctx.fillStyle = '#f8fafc';
            ctx.font = `900 44px 'Orbitron', sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 20;
            ctx.fillText(roundText, w / 2, this.canvas.height / 2 - 35);
        }

        ctx.restore();
    }

    drawPlayerStatsCompact(player, anchorX, y, isRight, tagLabel, teamColor) {
        const ctx = this.ctx;
        const barW = 200;
        const barH = 14;
        const x = isRight ? (anchorX - barW) : anchorX;

        ctx.save();
        // Background track
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = teamColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x, y + 14, barW, barH, 3);
        else ctx.rect(x, y + 14, barW, barH);
        ctx.fill();
        ctx.stroke();

        // Health fill
        const hpRatio = Math.max(0, Math.min(1, player.hp / player.maxHp));
        const fillW = barW * hpRatio;
        const fillX = isRight ? (x + barW - fillW) : x;

        ctx.fillStyle = player.hp <= 0 ? '#475569' : (hpRatio < 0.25 ? '#ef4444' : teamColor);
        ctx.shadowColor = teamColor;
        ctx.shadowBlur = 8;
        ctx.fillRect(fillX, y + 14, fillW, barH);

        // Player Tag & Name
        ctx.fillStyle = '#f8fafc';
        ctx.font = "700 11px 'Orbitron', sans-serif";
        ctx.textAlign = isRight ? 'right' : 'left';
        ctx.fillText(`${tagLabel} - ${player.name}`, isRight ? (anchorX) : x, y + 10);

        // HP numbers or K.O.
        ctx.font = "900 10px 'Orbitron', sans-serif";
        ctx.textAlign = 'center';
        if (player.hp <= 0 || player.isDead) {
            ctx.fillStyle = '#ef4444';
            ctx.fillText('⚡ K.O. OFFLINE ⚡', x + barW / 2, y + 21);
        } else {
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`${Math.round(player.hp)} / ${player.maxHp}`, x + barW / 2, y + 21);
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

        // Numeric HP text display
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

    triggerUltimateCutIn(user) {
        if (!user) return;
        const ultTitles = {
            yanagi: { tag: '✦ ELECTRIC EXCEED ✦', title: 'LIGHTNING CANNON', sub: 'TSUKISHIRO YANAGI' },
            velina: { tag: '✦ LIFE BLOOM HARMONY ✦', title: 'LIFE BLOSSOM STORM', sub: 'VERINA AIRGID' },
            nicole: { tag: '✦ ZERO GRAVITY COLLAPSE ✦', title: 'GRAVITATIONAL BLACK HOLE', sub: 'NICOLE DEMARA' },
            trigger: { tag: '✦ TACTICAL LOCK-ON ✦', title: 'SYNCHRONIZED FIREPOWER', sub: 'TRIGGER' },
            vivian: { tag: '✦ ETHER WING DESCENT ✦', title: 'FEATHER STORM HARBINGER', sub: 'VIVIAN BANSHEE' },
            jotaro: { tag: '✦ STAND PROUD: THE WORLD ✦', title: 'ORA ORA ORA: TIME STOP', sub: 'JOTARO KUJO' },
            goku: { tag: '✦ SUPER SAIYAN BURST ✦', title: 'SUPER KAMEHAMEHA', sub: 'SON GOKU' },
            giorno: { tag: '✦ GOLDEN EXPERIENCE REQUIEM ✦', title: 'RETURN TO ZERO', sub: 'GIORNO GIOVANNA' },
            naoya: { tag: '✦ 24 FPS PROJECTION SORCERY ✦', title: 'MACH 3 PROJECTION BARRAGE', sub: "NAOYA ZEN'IN" },
            luffy: { tag: '✦ GEAR 5 SUN GOD NIKA ✦', title: 'GOMU GOMU NO BAJRANG GUN', sub: 'MONKEY D. LUFFY' },
            gojo: { tag: '✦ INNATE DOMAIN EXPANSION ✦', title: 'UNLIMITED VOID', sub: 'SATORU GOJO' },
            sukuna: { tag: '✦ INNATE DOMAIN EXPANSION ✦', title: 'MALEVOLENT SHRINE', sub: 'RYOMEN SUKUNA' },
            saitama: { tag: '✦ SERIOUS SERIES SPECIAL MOVE ✦', title: 'SERIOUS PUNCH: DEATH', sub: 'SAITAMA' },
            megumi: { tag: '✦ TEN SHADOWS SACRED TECHNIQUE ✦', title: 'EIGHT-HANDLED SWORD: MAHORAGA', sub: 'FUSHIGURO MEGUMI' },
            mirai: { tag: '✦ SPIRIT WORLD BLOOD CATACLYSM ✦', title: 'BLOOD WEAPON: FUYUKAI DESU', sub: 'KURIYAMA MIRAI' }
        };
        const info = ultTitles[user.characterId] || {
            tag: '✦ MAXIMUM OVERDRIVE FINISHER ✦',
            title: 'OVERDRIVE ULTIMATE',
            sub: user.name || 'FIGHTER'
        };

        this.activeUltimateCutIn = {
            user: user,
            charId: user.characterId,
            tag: info.tag,
            title: info.title,
            sub: info.sub,
            color: user.color || '#38bdf8',
            timer: 55,
            maxTimer: 55
        };
        this.triggerFlash(user.color || '#ffffff', 0.55);
        this.triggerShake(12, 18);
    }

    drawUltimateCutIn(ctx) {
        if (!this.activeUltimateCutIn) return;
        const cut = this.activeUltimateCutIn;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const p = 1 - (cut.timer / cut.maxTimer);

        // Alpha envelope: fade in first 8 frames, sustain, fade out last 8 frames
        let alpha = 1;
        if (cut.timer > cut.maxTimer - 8) {
            alpha = (cut.maxTimer - cut.timer) / 8;
        } else if (cut.timer < 8) {
            alpha = cut.timer / 8;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

        // 1. Cinematic Dark Backdrop
        ctx.fillStyle = 'rgba(3, 7, 18, 0.72)';
        ctx.fillRect(0, 0, w, h);

        // 2. Cinematic Black Letterbox Bars (Top & Bottom)
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w, 46);
        ctx.fillRect(0, h - 46, w, 46);

        // Border neon glow lines on letterbox
        ctx.strokeStyle = cut.color;
        ctx.shadowColor = cut.color;
        ctx.shadowBlur = 15;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, 46);
        ctx.lineTo(w, 46);
        ctx.moveTo(0, h - 46);
        ctx.lineTo(w, h - 46);
        ctx.stroke();

        // 3. Dynamic Angled Slash Banner across screen center
        const bannerH = 175;
        const bannerY = h * 0.42;
        const slideOffset = (1 - Math.sin(Math.min(1, p * 4) * Math.PI * 0.5)) * -220;

        ctx.save();
        ctx.translate(slideOffset, 0);

        // Banner Polygon
        const polyTopY = bannerY - bannerH * 0.5;
        const polyBotY = bannerY + bannerH * 0.5;

        // Banner gradient
        const bgGrad = ctx.createLinearGradient(0, polyTopY, w, polyBotY);
        bgGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
        bgGrad.addColorStop(0.35, 'rgba(2, 6, 23, 0.98)');
        bgGrad.addColorStop(0.7, 'rgba(15, 23, 42, 0.95)');
        bgGrad.addColorStop(1, 'rgba(2, 6, 23, 0.98)');

        ctx.fillStyle = bgGrad;
        ctx.beginPath();
        ctx.moveTo(-100, polyTopY - 12);
        ctx.lineTo(w + 100, polyTopY + 12);
        ctx.lineTo(w + 100, polyBotY + 12);
        ctx.lineTo(-100, polyBotY - 12);
        ctx.closePath();
        ctx.fill();

        // Glowing border stripes
        ctx.strokeStyle = cut.color;
        ctx.lineWidth = 4;
        ctx.shadowColor = cut.color;
        ctx.shadowBlur = 24;
        ctx.beginPath();
        ctx.moveTo(-100, polyTopY - 12);
        ctx.lineTo(w + 100, polyTopY + 12);
        ctx.moveTo(-100, polyBotY - 12);
        ctx.lineTo(w + 100, polyBotY + 12);
        ctx.stroke();

        // Animated neon speed lines passing across banner
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        for (let i = 0; i < 6; i++) {
            const lineX = ((p * 2500 + i * 280) % (w + 400)) - 200;
            const lineY = polyTopY + (i / 5) * bannerH;
            ctx.beginPath();
            ctx.moveTo(lineX, lineY);
            ctx.lineTo(lineX + 180, lineY + 6);
            ctx.stroke();
        }

        // 4. Character Portrait Cut-In
        const avatar = assets.getCharacterAvatar ? assets.getCharacterAvatar(cut.charId) : null;
        const portX = 220;
        const portY = bannerY;
        const portR = 64;

        ctx.save();
        ctx.shadowColor = cut.color;
        ctx.shadowBlur = 30;

        // Portrait glowing backdrop shield
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.strokeStyle = cut.color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(portX, portY, portR + 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw Avatar inside circle
        if (avatar && avatar.complete && avatar.naturalWidth > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(portX, portY, portR, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(avatar, portX - portR, portY - portR, portR * 2, portR * 2);
            ctx.restore();
        }
        ctx.restore();

        // 5. Stylized Typography & Titles
        const textX = 320;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        // Tagline (Category / Domain)
        ctx.font = 'bold 15px Rajdhani, monospace';
        ctx.fillStyle = cut.color;
        ctx.shadowColor = cut.color;
        ctx.shadowBlur = 12;
        ctx.fillText(cut.tag, textX, bannerY - 42);

        // Main Ultimate Title
        ctx.font = '900 36px Orbitron, Rajdhani, sans-serif';
        // Outer dark glow
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.strokeStyle = cut.color;
        ctx.lineWidth = 5;
        ctx.strokeText(cut.title, textX, bannerY);
        // Inner white/bright fill
        ctx.fillStyle = '#ffffff';
        ctx.fillText(cut.title, textX, bannerY);

        // Subtitle / Fighter Name
        ctx.font = 'bold 17px Rajdhani, sans-serif';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#000000';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(`◆ ${cut.sub} ◆`, textX, bannerY + 40);

        ctx.restore();
        ctx.restore();
    }
}
