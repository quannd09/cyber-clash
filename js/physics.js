// 2D Zero-G Inertial Physics & Wall Bounce Mechanics
export class PhysicsEngine {
    constructor() {
        this.friction = 0.92;       // Zero-G drift dampening
        this.maxSpeed = 9.0;        // Normal maximum cruising speed
        this.boostMaxSpeed = 13.0;   // Maximum speed during Wall Bounce / Dash
        this.wallElasticity = 0.70;  // Base restitution when hitting arena walls
    }

    updateBody(body, dt = 1) {
        // Apply acceleration to velocity
        body.vx += body.ax * dt;
        body.vy += body.ay * dt;

        // Reset frame acceleration
        body.ax = 0;
        body.ay = 0;

        // Apply friction / vacuum drag
        body.vx *= Math.pow(this.friction, dt);
        body.vy *= Math.pow(this.friction, dt);

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
        }

        if (hitWall) {
            // Check if player executed a Wall Bounce Boost trick
            // (Thrusting away from the wall or having inward momentum)
            const dotProduct = body.vx * normalX + body.vy * normalY;

            if (dotProduct < -2.0) {
                // Strong impact -> Can convert into Wall Bounce Boost!
                const bounceForce = 7.0;

                // Reflect velocity across the normal
                if (normalX !== 0) {
                    body.vx = normalX * Math.abs(body.vx) * 0.7 + normalX * bounceForce * 0.4;
                }
                if (normalY !== 0) {
                    body.vy = normalY * Math.abs(body.vy) * 0.7 + normalY * bounceForce * 0.4;
                }

                // Grant temporary boost status
                body.isBoosted = true;
                body.boostTimer = 35; // frames of high speed

                if (onWallBounce) {
                    onWallBounce(body, normalX, normalY);
                }
            } else {
                // Mild bounce
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
