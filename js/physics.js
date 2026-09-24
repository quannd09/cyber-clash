// 2D Zero-G & Gravity Platformer Physics Engine
export class PhysicsEngine {
    constructor() {
        this.friction = 0.92;        // Zero-G drift dampening
        this.groundFriction = 0.82;  // Higher horizontal dampening on solid ground
        this.airFriction = 0.96;     // Air mobility dampening
        this.maxSpeed = 9.0;         // Normal maximum cruising speed
        this.boostMaxSpeed = 15.0;   // Maximum speed during Wall Bounce / Dash
        this.wallElasticity = 0.875; // Restitution when hitting arena walls
        this.gravityEnabled = false; // Toggled on for 2v2 Platformer mode
        this.gravity = 0.46;
        this.terminalVelocity = 14.0;
        this.jumpSpeed = -13.2;      // Reaches ~190px single jump height to easily land on obstacles
        this.doubleJumpSpeed = -11.5;
    }

    updateBody(body, dt = 1) {
        // Save previous position for platform tunneling protection
        body.prevX = body.x;
        body.prevY = body.y;

        // Apply acceleration to velocity
        body.vx += body.ax * dt;
        body.vy += body.ay * dt;

        // Reset frame acceleration
        body.ax = 0;
        body.ay = 0;

        // Drop-through timer for soft platforms
        if (body.dropCooldown > 0) {
            body.dropCooldown -= dt;
        }

        if (this.gravityEnabled || body.gravityEnabled) {
            // --- GRAVITY PLATFORMER PHYSICS ---
            // Apply downward gravitational acceleration
            body.vy += this.gravity * dt;
            if (body.vy > this.terminalVelocity) {
                body.vy = this.terminalVelocity;
            }

            // Horizontal friction depends on grounded status
            const f = body.isGrounded ? this.groundFriction : this.airFriction;
            body.vx *= Math.pow(f, dt);
        } else {
            // --- ZERO-G DRIFT INERTIA ---
            body.vx *= Math.pow(this.friction, dt);
            body.vy *= Math.pow(this.friction, dt);
        }

        // Speed cap (boost allowance decays)
        const currentCap = body.isBoosted ? this.boostMaxSpeed : this.maxSpeed;
        const speed = Math.hypot(body.vx, body.vy);
        if (speed > currentCap) {
            body.vx = (body.vx / speed) * currentCap;
            body.vy = (body.vy / speed) * currentCap;
        }

        // Apply velocity to position
        body.x += body.vx * dt;
        body.y += body.vy * dt;

        // Decay boost timer
        if (body.boostTimer > 0) {
            body.boostTimer -= dt;
            if (body.boostTimer <= 0) {
                body.isBoosted = false;
            }
        }
    }

    // Resolve collisions with terrain platforms
    resolvePlatforms(body, platforms = []) {
        if (!platforms || platforms.length === 0) return;

        const radius = body.radius || 24;
        let onAnyPlatform = false;

        const feetPrevY = body.prevY + radius;
        const feetCurrY = body.y + radius;

        for (const plat of platforms) {
            const left = plat.x;
            const right = plat.x + plat.width;
            const top = plat.y;
            const bottom = plat.y + plat.height;

            // Check horizontal overlap with player
            if (body.x + radius * 0.75 < left || body.x - radius * 0.75 > right) {
                continue;
            }

            if (plat.type === 'soft') {
                // One-way soft platform:
                // Pass-through when rising or when dropping down intentionally
                if (body.dropCooldown > 0 || body.vy < 0) {
                    continue;
                }

                // Landing or standing firmly on top surface
                const maxStep = Math.max(16, body.vy + 8);
                const canLand = (feetCurrY >= top - 4 && feetCurrY <= top + maxStep && feetPrevY <= top + 18);
                const alreadyStanding = (Math.abs(feetCurrY - top) <= 4 && body.vy >= 0);

                if (canLand || alreadyStanding) {
                    body.y = top - radius;
                    body.vy = 0;
                    body.isGrounded = true;
                    body.jumpCount = 0;
                    onAnyPlatform = true;
                    break;
                }
            } else if (plat.type === 'solid') {
                // Solid platform: blocks from top, underside, and sides
                const maxStep = Math.max(16, body.vy + 8);

                // 1. Landing or standing on top surface
                if (body.vy >= 0 && ((feetCurrY >= top - 4 && feetCurrY <= top + maxStep && feetPrevY <= top + 18) || Math.abs(feetCurrY - top) <= 4)) {
                    body.y = top - radius;
                    body.vy = 0;
                    body.isGrounded = true;
                    body.jumpCount = 0;
                    onAnyPlatform = true;
                    break;
                }
                // 2. Hitting underside while jumping up
                else if (body.vy < 0 && body.prevY - radius >= bottom - 14 && body.y - radius <= bottom + 4) {
                    body.y = bottom + radius;
                    body.vy = Math.max(0, -body.vy * 0.2);
                }
                // 3. Side collisions
                else if (body.y + radius > top + 6 && body.y - radius < bottom - 4) {
                    if (body.prevX + radius <= left + 8 && body.x + radius >= left) {
                        body.x = left - radius;
                        body.vx = 0;
                    } else if (body.prevX - radius >= right - 8 && body.x - radius <= right) {
                        body.x = right + radius;
                        body.vx = 0;
                    }
                }
            }
        }

        if (!onAnyPlatform && (this.gravityEnabled || body.gravityEnabled)) {
            // In gravity mode, if not touching platform or arena floor, marked airborne
            body.isGrounded = false;
        }
    }

    // Trigger jump or double jump for gravity mode
    executeJump(body) {
        if (!this.gravityEnabled && !body.gravityEnabled) return false;

        if (body.isGrounded) {
            body.vy = this.jumpSpeed;
            body.y -= 2; // initial lift to cleanly unstick from platform
            body.isGrounded = false;
            body.jumpCount = 1;
            return true;
        } else if ((body.jumpCount || 0) < 2) {
            body.vy = this.doubleJumpSpeed;
            body.jumpCount = 2;
            body.isBoosted = true;
            body.boostTimer = 12;
            return true;
        }
        return false;
    }

    // Drop down through soft platforms
    dropThrough(body) {
        if (body.isGrounded) {
            body.dropCooldown = 18; // Ignore soft platforms for 18 frames (~300ms)
            body.isGrounded = false;
            body.y += 6;
            body.vy = 2.5;
            return true;
        }
        return false;
    }

    // Check and resolve collisions with rectangular arena boundaries
    resolveArenaBounds(body, bounds, onWallBounce = null) {
        const radius = body.radius || 24;
        let hitWall = false;
        let normalX = 0;
        let normalY = 0;

        // Left wall
        if (body.x - radius < bounds.minX) {
            body.x = bounds.minX + radius;
            normalX = 1;
            hitWall = true;
        }
        // Right wall
        else if (body.x + radius > bounds.maxX) {
            body.x = bounds.maxX - radius;
            normalX = -1;
            hitWall = true;
        }

        // Top wall
        if (body.y - radius < bounds.minY) {
            body.y = bounds.minY + radius;
            normalY = 1;
            hitWall = true;
        }
        // Bottom wall
        else if (body.y + radius > bounds.maxY) {
            body.y = bounds.maxY - radius;
            normalY = -1;
            hitWall = true;
            if (this.gravityEnabled || body.gravityEnabled) {
                body.isGrounded = true;
                body.jumpCount = 0;
                body.vy = 0;
                return true; // In gravity mode, landing on arena floor firmly lands without bouncing
            }
        }

        if (hitWall) {
            const dotProduct = body.vx * normalX + body.vy * normalY;

            if (dotProduct < -2.0) {
                const bounceForce = 8.75;
                if (normalX !== 0) {
                    body.vx = normalX * Math.abs(body.vx) * 0.875 + normalX * bounceForce * 0.4;
                }
                if (normalY !== 0) {
                    body.vy = normalY * Math.abs(body.vy) * 0.875 + normalY * bounceForce * 0.4;
                }
                body.isBoosted = true;
                body.boostTimer = 35;

                if (onWallBounce) {
                    onWallBounce(body, normalX, normalY);
                }
            } else {
                if (normalX !== 0) body.vx = -body.vx * this.wallElasticity;
                if (normalY !== 0) body.vy = -body.vy * this.wallElasticity;
            }
        }

        return hitWall;
    }

    applyKnockback(body, dirX, dirY, force) {
        const len = Math.hypot(dirX, dirY) || 1;
        body.vx += (dirX / len) * force;
        body.vy += (dirY / len) * force;
    }
}

export const physics = new PhysicsEngine();
