// Multi-player Input Manager with anti-ghosting Keyboard & Gamepad API support
export class InputManager {
    constructor() {
        this.keys = {};
        this.prevKeys = {};
        this.gamepads = [];

        // Player 1 bindings
        this.p1Bindings = {
            up: ['KeyW', 'keyw'],
            left: ['KeyA', 'keya'],
            down: ['KeyS', 'keys'],
            right: ['KeyD', 'keyd'],
            lightAttack: ['KeyF', 'keyf'],
            heavyAttack: [],
            shield: ['KeyH', 'keyh'],
            skill: ['KeyR', 'keyr'],
            strafe: ['ShiftLeft'],
            ultimate: ['Space', ' ', 'Spacebar']
        };

        // Player 2 bindings (Supports both Numpad & Home row J/L/I/U/O for compact laptops)
        this.p2Bindings = {
            up: ['ArrowUp'],
            left: ['ArrowLeft'],
            down: ['ArrowDown'],
            right: ['ArrowRight'],
            lightAttack: ['Numpad1', 'KeyJ', 'keyj'],
            heavyAttack: [],
            shield: ['Numpad3', 'KeyL', 'keyl'],
            skill: ['Numpad5', 'KeyI', 'keyi'],
            strafe: ['Numpad0', 'KeyU', 'keyu', 'ControlRight'],
            ultimate: ['Enter', 'NumpadEnter', 'KeyO', 'keyo']
        };

        this.initListeners();
    }

    initListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.key) this.keys[e.key] = true;
            if (e.code === 'Space' || e.key === ' ') {
                this.keys['Space'] = true;
                this.keys[' '] = true;
            }
            // Prevent scrolling on arrows/space
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', ' '].includes(e.code) || e.key === ' ') {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            if (e.key) this.keys[e.key] = false;
            if (e.code === 'Space' || e.key === ' ') {
                this.keys['Space'] = false;
                this.keys[' '] = false;
            }
        });

        window.addEventListener('blur', () => {
            this.keys = {};
        });
    }

    update() {
        // Poll Gamepads
        if (navigator.getGamepads) {
            const rawGamepads = navigator.getGamepads();
            this.gamepads = [];
            for (let i = 0; i < rawGamepads.length; i++) {
                if (rawGamepads[i]) this.gamepads.push(rawGamepads[i]);
            }
        }
    }

    postUpdate() {
        this.prevKeys = { ...this.keys };
    }

    // Check keyboard key code
    isKeyDown(code) {
        return !!this.keys[code];
    }

    isKeyJustPressed(code) {
        if (code === 'Space' || code === ' ') {
            return (!!this.keys['Space'] && !this.prevKeys['Space']) ||
                   (!!this.keys[' '] && !this.prevKeys[' ']);
        }
        return !!this.keys[code] && !this.prevKeys[code];
    }

    // High level action checks for Player 1 or 2
    getActionState(playerIndex, action) {
        const bindings = playerIndex === 0 ? this.p1Bindings : this.p2Bindings;
        const keyList = bindings[action] || [];

        // Check Keyboard
        let isDown = keyList.some(k => this.isKeyDown(k));
        let justDown = keyList.some(k => this.isKeyJustPressed(k));

        // Check Gamepad
        const gp = this.gamepads[playerIndex];
        if (gp) {
            const padState = this.getGamepadAction(gp, action);
            if (padState.down) isDown = true;
            if (padState.just) justDown = true;
        }

        return { isDown, justDown };
    }

    getGamepadAction(gp, action) {
        const deadzone = 0.25;
        const axisX = gp.axes[0] || 0;
        const axisY = gp.axes[1] || 0;
        const buttons = gp.buttons;

        let down = false;
        switch (action) {
            case 'up':
                down = axisY < -deadzone || (buttons[12] && buttons[12].pressed);
                break;
            case 'down':
                down = axisY > deadzone || (buttons[13] && buttons[13].pressed);
                break;
            case 'left':
                down = axisX < -deadzone || (buttons[14] && buttons[14].pressed);
                break;
            case 'right':
                down = axisX > deadzone || (buttons[15] && buttons[15].pressed);
                break;
            case 'lightAttack': // X / Square
                down = buttons[2] && buttons[2].pressed;
                break;
            case 'heavyAttack': // Y / Triangle
                down = buttons[3] && buttons[3].pressed;
                break;
            case 'shield': // B / Circle
                down = buttons[1] && buttons[1].pressed;
                break;
            case 'skill': // A / Cross
                down = buttons[0] && buttons[0].pressed;
                break;
            case 'strafe': // Left Trigger / L1
                down = (buttons[4] && buttons[4].pressed) || (buttons[6] && buttons[6].pressed);
                break;
            case 'ultimate': // Right Trigger / R1
                down = (buttons[5] && buttons[5].pressed) || (buttons[7] && buttons[7].pressed);
                break;
        }

        return { down, just: down }; // Simplification for gamepads
    }

    // Returns directional vector (-1 to 1)
    getMovementVector(playerIndex) {
        let x = 0;
        let y = 0;

        if (this.getActionState(playerIndex, 'left').isDown) x -= 1;
        if (this.getActionState(playerIndex, 'right').isDown) x += 1;
        if (this.getActionState(playerIndex, 'up').isDown) y -= 1;
        if (this.getActionState(playerIndex, 'down').isDown) y += 1;

        // Gamepad analog input overrides if present
        const gp = this.gamepads[playerIndex];
        if (gp) {
            const axisX = gp.axes[0] || 0;
            const axisY = gp.axes[1] || 0;
            const deadzone = 0.25;
            if (Math.hypot(axisX, axisY) > deadzone) {
                x = axisX;
                y = axisY;
            }
        }

        // Normalize if diagonal
        const mag = Math.hypot(x, y);
        if (mag > 1) {
            x /= mag;
            y /= mag;
        }

        return { x, y };
    }
}

export const input = new InputManager();
