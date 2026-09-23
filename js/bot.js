// AI Bot Controller for Cyber Clash: Zero-G Arena
// Features 4 Difficulties: Easy, Normal, Master, and Impossible (God AI)
import { WEAPONS, combat } from './combat.js?v=75';
import { physics } from './physics.js?v=75';

export class BotController {
    constructor(difficulty = 'normal') {
        this.difficulty = difficulty; // 'easy' | 'normal' | 'master' | 'impossible'
        this.parryHoldTimer = 0;
        this.recentAttacks = [];
        this.decisionTimer = 0;
        this.strafeDir = 1;
        this.orbitTimer = 0;
        this.feintTimer = 0;
    }

    setDifficulty(diff) {
        this.difficulty = diff;
    }

    update(bot, opponent, dt, bounds) {
        if (!bot || !opponent || bot.hp <= 0 || bot.isStunned || bot.isUsingUltimate) {
            return;
        }

        const now = performance.now();
        const dist = Math.hypot(opponent.x - bot.x, opponent.y - bot.y);
        const isMelee = bot.combatStyle === 'melee';

        // -------------------------------------------------------------
        // 1. DEFENSE & REACTION SYSTEM (PARRY / REFLECT)
        // -------------------------------------------------------------
        let shouldShield = false;
        let parryDuration = 6;

        // Nerf bot Easy & Normal: Completely disables blocking and parrying any attacks
        const canBlock = (this.difficulty === 'impossible' || this.difficulty === 'master');

        if (canBlock) {
            // A. Incoming Projectiles Detection
            if (combat && combat.projectiles) {
                for (let i = 0; i < combat.projectiles.length; i++) {
                    const p = combat.projectiles[i];
                    if (p.ownerIndex === bot.index) continue; // Ignore own projectiles

                    const dx = bot.x - p.x;
                    const dy = bot.y - p.y;
                    const pDist = Math.hypot(dx, dy);

                    // Relative velocity
                    const rvx = p.vx - bot.vx;
                    const rvy = p.vy - bot.vy;
                    const relSpeed = Math.hypot(rvx, rvy);
                    const dot = dx * rvx + dy * rvy;

                    // Moving towards bot
                    if (dot > 0 && relSpeed > 0.5) {
                        const timeToImpact = pDist / relSpeed;
                        // Closest approach distance
                        const cross = Math.abs(dx * rvy - dy * rvx) / relSpeed;

                        if (cross <= bot.radius + p.radius + 14) {
                            if (this.difficulty === 'impossible') {
                                // Frame-perfect 0-1 frame reflex, within 8 frames of impact
                                if (timeToImpact <= 8) {
                                    shouldShield = true;
                                    parryDuration = 4;
                                    break;
                                }
                            } else if (this.difficulty === 'master') {
                                // 85% reflex within 7 frames
                                if (timeToImpact <= 7 && Math.random() < 0.85) {
                                    shouldShield = true;
                                    parryDuration = 5;
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            // B. Opponent Melee Slash Reaction
            if (!shouldShield && opponent.isAttacking && !opponent.isShooting) {
                const opponentReach = opponent.attackReach || 80;
                if (dist <= opponentReach + bot.radius + 12) {
                    if (this.difficulty === 'impossible') {
                        // Frame-perfect melee parry -> Stuns opponent for 0.9s!
                        shouldShield = true;
                        parryDuration = 4;
                    } else if (this.difficulty === 'master' && Math.random() < 0.80) {
                        shouldShield = true;
                        parryDuration = 5;
                    }
                }
            }
        }

        // Apply Shield / Release
        if (shouldShield && bot.energy >= 15 && !bot.isAttacking) {
            bot.activateShield();
            this.parryHoldTimer = parryDuration;
        } else if (this.parryHoldTimer > 0) {
            this.parryHoldTimer -= dt;
            if (this.parryHoldTimer <= 0) {
                bot.releaseShield();
            }
        } else {
            bot.releaseShield();
        }

        // -------------------------------------------------------------
        // 2. ZERO-G MOVEMENT & KITING BEHAVIOR
        // -------------------------------------------------------------
        this.orbitTimer += dt;
        if (this.orbitTimer > 90) {
            this.orbitTimer = 0;
            if (Math.random() < 0.5) this.strafeDir *= -1;
        }

        let thrustX = 0;
        let thrustY = 0;
        const normDx = dist > 1 ? (opponent.x - bot.x) / dist : 1;
        const normDy = dist > 1 ? (opponent.y - bot.y) / dist : 0;
        const perpX = -normDy * this.strafeDir;
        const perpY = normDx * this.strafeDir;

        if (isMelee) {
            // Melee Fighter: aggressively close distance
            if (this.difficulty === 'impossible') {
                if (dist > 65) {
                    thrustX = normDx + perpX * 0.25;
                    thrustY = normDy + perpY * 0.25;
                } else {
                    // Micro-spacing in face
                    thrustX = perpX;
                    thrustY = perpY;
                }

                // Intentional Wall-Bounce Boost if player is far and wall is nearby
                if (dist > 350) {
                    if (bot.x < bounds.minX + 90) thrustX = -1;
                    else if (bot.x > bounds.maxX - 90) thrustX = 1;
                    if (bot.y < bounds.minY + 90) thrustY = -1;
                    else if (bot.y > bounds.maxY - 90) thrustY = 1;
                }
            } else if (this.difficulty === 'master') {
                if (dist > 75) {
                    thrustX = normDx + perpX * 0.3;
                    thrustY = normDy + perpY * 0.3;
                } else {
                    thrustX = perpX;
                    thrustY = perpY;
                }
            } else if (this.difficulty === 'normal') {
                thrustX = normDx * 0.85;
                thrustY = normDy * 0.85;
            } else {
                // Easy
                thrustX = normDx * 0.55;
                thrustY = normDy * 0.55;
            }
        } else {
            // Ranged Fighter: Kiting & Spacing
            const idealDist = this.difficulty === 'impossible' ? 400 : (this.difficulty === 'master' ? 380 : 340);

            if (dist < idealDist - 60) {
                // Backpedal + Orbit
                thrustX = -normDx * 1.1 + perpX * 0.7;
                thrustY = -normDy * 1.1 + perpY * 0.7;

                // Wall avoid / Bounce Boost
                if (this.difficulty === 'impossible') {
                    if (bot.x < bounds.minX + 110) thrustX = -1; // Intentionally wall-bounce!
                    else if (bot.x > bounds.maxX - 110) thrustX = 1;
                    if (bot.y < bounds.minY + 110) thrustY = -1;
                    else if (bot.y > bounds.maxY - 110) thrustY = 1;
                }
            } else if (dist > idealDist + 90) {
                // Advance
                thrustX = normDx * 0.8 + perpX * 0.4;
                thrustY = normDy * 0.8 + perpY * 0.4;
            } else {
                // Sweet spot: Orbit around player to dodge straight line projectiles
                thrustX = perpX * 0.95;
                thrustY = perpY * 0.95;
            }

            if (this.difficulty === 'easy') {
                thrustX *= 0.6;
                thrustY *= 0.6;
            }
        }

        // Apply thrust (updateAim = false so thrust movement never clobbers bot's aim angle!)
        if (Math.hypot(thrustX, thrustY) > 0.1) {
            bot.thrust(thrustX, thrustY, false);
        }

        // In Gravity Platformer mode, leap or drop between platforms
        if (physics && (physics.gravityEnabled || bot.gravityEnabled)) {
            if (opponent.y < bot.y - 35 && (bot.isGrounded || (bot.jumpCount || 0) < 2)) {
                if (Math.random() < 0.18) {
                    physics.executeJump(bot);
                }
            } else if (opponent.y > bot.y + 60 && bot.isGrounded && Math.random() < 0.12) {
                physics.dropThrough(bot);
            }
        }

        // -------------------------------------------------------------
        // 3. PREDICTIVE AIMING SYSTEM (Lock aim angle towards opponent)
        // -------------------------------------------------------------
        let targetAimAngle = Math.atan2(opponent.y - bot.y, opponent.x - bot.x);

        if (isMelee) {
            // Melee fighters: Lock aim directly at opponent
            // Slight 2-frame lead compensation for fast moving targets
            const leadFrames = (this.difficulty === 'impossible' || this.difficulty === 'master') ? 2 : 0;
            const predX = opponent.x + opponent.vx * leadFrames;
            const predY = opponent.y + opponent.vy * leadFrames;
            targetAimAngle = Math.atan2(predY - bot.y, predX - bot.x);
        } else {
            // Ranged fighters: Ballistic Lead Aim calculation
            if (this.difficulty === 'impossible' || this.difficulty === 'master') {
                const bulletSpeed = 14.5;
                const travelTime = dist / bulletSpeed;
                const predX = opponent.x + opponent.vx * travelTime;
                const predY = opponent.y + opponent.vy * travelTime;
                targetAimAngle = Math.atan2(predY - bot.y, predX - bot.x);

                if (this.difficulty === 'master') {
                    // Tiny aim inaccuracy (±2 deg)
                    targetAimAngle += (Math.random() - 0.5) * 0.04;
                }
            } else if (this.difficulty === 'normal') {
                // Light aim inaccuracy (±5 deg)
                targetAimAngle += (Math.random() - 0.5) * 0.09;
            } else {
                // Easy: Moderate aim inaccuracy (±12 deg)
                targetAimAngle += (Math.random() - 0.5) * 0.20;
            }
        }

        // Set aim angle and facing direction towards opponent
        bot.setAimAngle(targetAimAngle);

        // -------------------------------------------------------------
        // 4. COMBAT & ATTACK EXECUTION (GLOBAL BOT NERF: MAX 6 SHOTS IN 4.5S -> 1.5S OVERHEAT LOCKOUT)
        // -------------------------------------------------------------
        // Clean attack history older than 4.5 seconds (4500ms)
        this.shotTimestamps = (this.shotTimestamps || []).filter(t => now - t <= 4500);

        // Check if currently overheated (cannot shoot/strike for 1.5s)
        this.overheatEndTime = this.overheatEndTime || 0;
        const isOverheated = now < this.overheatEndTime;

        // Attack range check according to character weapon range
        const weapon = WEAPONS[bot.characterId.toUpperCase()] || { attackRange: isMelee ? 85 : 550 };
        const inAttackRange = isMelee ? (dist <= weapon.attackRange + 25) : (dist <= (weapon.attackRange || 600));

        // Shield baiting: if player is shielding with high energy, avoid wasting strikes
        let shouldStrike = inAttackRange && !isOverheated && !bot.isShielding && bot.attackCooldown <= 0;

        // NERF ENFORCEMENT: Max 6 shots in 4.5s. If reached, trigger 1.5s lockout
        if (shouldStrike && this.shotTimestamps.length >= 6) {
            this.overheatEndTime = now + 1500;
            shouldStrike = false;
        }

        if (this.difficulty === 'impossible') {
            if (opponent.isShielding) {
                // If opponent shield is about to break, crack it!
                if (opponent.energy < 22) {
                    shouldStrike = !isOverheated && inAttackRange;
                } else {
                    // Don't waste hits into full shield; reposition!
                    shouldStrike = false;
                }
            }
        }

        if (shouldStrike) {
            let willAttack = false;
            if (this.difficulty === 'easy') {
                willAttack = Math.random() < 0.4;
            } else if (this.difficulty === 'normal') {
                willAttack = Math.random() < 0.75;
            } else {
                willAttack = true;
            }

            if (willAttack) {
                bot.setAimAngle(targetAimAngle);
                bot.attack();
                this.shotTimestamps.push(now);
            }
        }

        // -------------------------------------------------------------
        // 5. SKILLS & LETHAL COMBO CHAINS
        // -------------------------------------------------------------
        if (bot.skillCooldownTimer <= 0 && !bot.isShielding) {
            let fireSkill = false;
            const charId = bot.characterId;

            if (charId === 'goku') {
                // Instant transmission: if opponent is far or bot wants to backstab
                if (dist > 120) fireSkill = true;
            } else if (charId === 'yanagi') {
                // Phase blink: if in strike zone or closing gap
                if (dist < 160 || (dist > 280 && dist < 450)) fireSkill = true;
            } else if (charId === 'jotaro') {
                // Star finger: medium range reach
                if (dist < 250) fireSkill = true;
            } else if (charId === 'vivian') {
                // Abloom burst: massive 4-feather shotgun
                if (dist < 420) fireSkill = true;
            } else if (charId === 'trigger') {
                // Sniper shot: long range piercing
                if (dist > 220) fireSkill = true;
            } else if (charId === 'nicole') {
                // Sugar slide
                if (dist < 360) fireSkill = true;
            } else if (charId === 'velina') {
                // EMP burst / Heal: if hurt or opponent close
                if (bot.hp < bot.maxHp * 0.85 || dist < 220) fireSkill = true;
            } else if (charId === 'giorno') {
                // Tree of life
                if (dist < 320) fireSkill = true;
            } else if (charId === 'naoya') {
                // Projection dash: dash through opponent
                if (dist > 80 && dist < 260) fireSkill = true;
            } else if (charId === 'luffy') {
                // Gigant stomp: close to mid range
                if (dist < 230) fireSkill = true;
            } else if (charId === 'gojo') {
                // Lapse Blue: mid to close range vacuum suction
                if (dist > 100 && dist < 320) fireSkill = true;
            } else if (charId === 'sukuna') {
                // Kamino fire arrow: mid to long range
                if (dist > 140) fireSkill = true;
            }

            if (fireSkill) {
                bot.setAimAngle(targetAimAngle);
                if (this.difficulty === 'impossible' || this.difficulty === 'master') {
                    bot.activateSkill(opponent);
                } else if (this.difficulty === 'normal' && Math.random() < 0.7) {
                    bot.activateSkill(opponent);
                } else if (this.difficulty === 'easy' && Math.random() < 0.35) {
                    bot.activateSkill(opponent);
                }
            }
        }

        // -------------------------------------------------------------
        // 6. ULTIMATE ABILITY (OVERDRIVE)
        // -------------------------------------------------------------
        if (bot.overdrive >= 100 && !bot.isShielding) {
            bot.setAimAngle(targetAimAngle);
            if (this.difficulty === 'impossible') {
                // Lethal execution: Fire Ultimate when opponent is stunned or guard broken
                if (opponent.isStunned || dist < 380 || opponent.hp < 200) {
                    bot.activateUltimate();
                }
            } else if (this.difficulty === 'master') {
                if (opponent.isStunned || dist < 400 || Math.random() < 0.7) {
                    bot.activateUltimate();
                }
            } else if (this.difficulty === 'normal') {
                if (dist < 450 && Math.random() < 0.5) {
                    bot.activateUltimate();
                }
            } else {
                // Easy
                if (Math.random() < 0.3) {
                    bot.activateUltimate();
                }
            }
        } else if (bot.overdrive < 100 && bot.energy >= 35) {
            // Boost Dash (when overdrive not full)
            if (this.difficulty === 'impossible' || this.difficulty === 'master') {
                // Use boost dash if opponent is stunned to close distance instantly, or to escape corner
                if (opponent.isStunned && dist > 140 && isMelee) {
                    bot.dash(normDx, normDy);
                }
            }
        }
    }
}
