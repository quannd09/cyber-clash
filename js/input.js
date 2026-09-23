export const DEFAULT_P1_BINDINGS = {
    up: ['KeyW', 'keyw', 'w', 'W'],
    left: ['KeyA', 'keya', 'a', 'A'],
    down: ['KeyS', 'keys', 's', 'S'],
    right: ['KeyD', 'keyd', 'd', 'D'],
    lightAttack: ['KeyF', 'keyf', 'f', 'F'],
    heavyAttack: [],
    shield: ['KeyH', 'keyh', 'h', 'H'],
    skill: ['KeyR', 'keyr', 'r', 'R'],
    dash: ['ShiftLeft', 'KeyC', 'keyc', 'c', 'C'],
    ultimate: ['Space', ' ', 'Spacebar']
};

export const DEFAULT_P2_BINDINGS = {
    up: ['ArrowUp'],
    left: ['ArrowLeft'],
    down: ['ArrowDown'],
    right: ['ArrowRight'],
    lightAttack: ['Numpad1', 'KeyJ', 'keyj', 'j', 'J'],
    heavyAttack: [],
    shield: ['Numpad3', 'KeyL', 'keyl', 'l', 'L'],
    skill: ['Numpad5', 'KeyI', 'keyi', 'i', 'I'],
    dash: ['Numpad0', 'KeyU', 'keyu', 'u', 'U', 'ControlRight', 'NumpadPeriod'],
    ultimate: ['Enter', 'NumpadEnter', 'KeyO', 'keyo', 'o', 'O']
};

// Multi-player Input Manager with anti-ghosting Keyboard & Gamepad API support
export class InputManager {
    constructor() {
        this.keys = {};
        this.prevKeys = {};
        this.gamepads = [];

        // Player bindings loaded from defaults or localStorage
        this.p1Bindings = JSON.parse(JSON.stringify(DEFAULT_P1_BINDINGS));
        this.p2Bindings = JSON.parse(JSON.stringify(DEFAULT_P2_BINDINGS));
        this.loadBindings();

        // Mouse controls for Single Player / Online Client (Disabled in Local 2-Player)
        this.mouseEnabled = false;
        this.mouse = {
            x: 640,
            y: 360,
            leftDown: false,
            leftJustDown: false,
            prevLeftDown: false,
            rightDown: false,
            rightJustDown: false,
            prevRightDown: false,
            hasMoved: false,
            lastMoveTime: 0
        };

        // Mobile Touch Controls
        this.touchEnabled = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        this.touchControlMode = 'auto'; // 'auto' | 'on' | 'off'
        this.touchMove = { x: 0, y: 0 };
        this.touchActions = {
            lightAttack: false,
            shield: false,
            skill: false,
            dash: false,
            ultimate: false
        };
        this.touchActionsJust = {
            lightAttack: false,
            shield: false,
            skill: false,
            dash: false,
            ultimate: false
        };
        this.joystickTouchId = null;
        this.joystickCenter = { x: 0, y: 0, maxRadius: 42 };

        this.initListeners();
    }

    setMouseEnabled(enabled) {
        this.mouseEnabled = Boolean(enabled);
        if (!this.mouseEnabled && this.mouse) {
            this.mouse.leftDown = false;
            this.mouse.leftJustDown = false;
            this.mouse.prevLeftDown = false;
            this.mouse.rightDown = false;
            this.mouse.rightJustDown = false;
            this.mouse.prevRightDown = false;
            this.mouse.hasMoved = false;
        }
    }

    updateMousePosition(e) {
        if (!this.mouseEnabled) return;
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                const scaleX = 1280 / rect.width;
                const scaleY = 720 / rect.height;
                const rawX = (e.clientX - rect.left) * scaleX;
                const rawY = (e.clientY - rect.top) * scaleY;
                this.mouse.x = Math.max(0, Math.min(1280, rawX));
                this.mouse.y = Math.max(0, Math.min(720, rawY));
                this.mouse.hasMoved = true;
                this.mouse.lastMoveTime = Date.now();
            }
        }
    }

    isMouseActive(timeoutMs = 6000) {
        if (!this.mouseEnabled || !this.mouse) return false;
        return Boolean(this.mouse.hasMoved && (Date.now() - (this.mouse.lastMoveTime || 0) < timeoutMs));
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

        // Mouse event listeners
        window.addEventListener('mousemove', (e) => {
            if (!this.mouseEnabled) return;
            this.updateMousePosition(e);
        });

        window.addEventListener('mousedown', (e) => {
            if (!this.mouseEnabled) return;
            this.updateMousePosition(e);

            // Ignore clicks on UI cards, overlays, modals, buttons, inputs
            if (e.target.closest('#loadout-screen, #controls-modal, #disconnect-modal, #victory-screen, #keybinds-modal, #secret-code-modal, button, input, select, .char-card, a')) {
                return;
            }

            if (e.button === 0) {
                this.mouse.leftDown = true;
                this.mouse.leftJustDown = true;
            } else if (e.button === 2) {
                this.mouse.rightDown = true;
                this.mouse.rightJustDown = true;
            }
        });

        window.addEventListener('mouseup', (e) => {
            if (!this.mouseEnabled) return;
            if (e.button === 0) {
                this.mouse.leftDown = false;
            } else if (e.button === 2) {
                this.mouse.rightDown = false;
            }
        });

        window.addEventListener('contextmenu', (e) => {
            if (e.target.id === 'gameCanvas' || e.target.closest('#game-container')) {
                e.preventDefault();
            }
        });

        window.addEventListener('blur', () => {
            this.keys = {};
            this.mouse.leftDown = false;
            this.mouse.rightDown = false;
            this.mouse.leftJustDown = false;
            this.mouse.rightJustDown = false;
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
        this.mouse.leftJustDown = false;
        this.mouse.rightJustDown = false;
        this.mouse.prevLeftDown = this.mouse.leftDown;
        this.mouse.prevRightDown = this.mouse.rightDown;

        // Reset single-frame touch triggers
        for (const action in this.touchActionsJust) {
            this.touchActionsJust[action] = false;
        }
    }

    // Check keyboard key code
    isKeyDown(code) {
        if (!code) return false;
        if (this.keys[code]) return true;
        if (code.length === 1) {
            return !!(this.keys[code.toLowerCase()] || this.keys[code.toUpperCase()]);
        }
        return false;
    }

    isKeyJustPressed(code) {
        if (!code) return false;
        if (code === 'Space' || code === ' ') {
            return (!!this.keys['Space'] && !this.prevKeys['Space']) ||
                   (!!this.keys[' '] && !this.prevKeys[' ']);
        }
        if (this.keys[code] && !this.prevKeys[code]) return true;
        if (code.length === 1) {
            const lower = code.toLowerCase();
            const upper = code.toUpperCase();
            return (!!this.keys[lower] && !this.prevKeys[lower]) ||
                   (!!this.keys[upper] && !this.prevKeys[upper]);
        }
        return false;
    }

    // High level action checks for Player 1 or 2
    getActionState(playerIndex, action) {
        const bindings = playerIndex === 0 ? this.p1Bindings : this.p2Bindings;
        const keyList = bindings[action] || [];

        // Check Keyboard
        let isDown = keyList.some(k => this.isKeyDown(k));
        let justDown = keyList.some(k => this.isKeyJustPressed(k));

        // Player 1 Touch Controls Integration (Active for Player 1 / Solo / Online client)
        if (playerIndex === 0) {
            if (this.touchActions[action]) isDown = true;
            if (this.touchActionsJust[action]) justDown = true;
        }

        // Player 1 Mouse Integration (ONLY active in Single Player vs BOT or Online mode, DISABLED in Local 2-Player mode)
        if (this.mouseEnabled && playerIndex === 0 && this.mouse) {
            if (action === 'lightAttack') {
                if (this.mouse.leftDown) isDown = true;
                if (this.mouse.leftJustDown) justDown = true;
            } else if (action === 'shield') {
                if (this.mouse.rightDown) isDown = true;
                if (this.mouse.rightJustDown) justDown = true;
            }
        }

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
            case 'dash': // Left Bumper / L1
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

        // Touch Virtual Joystick for Player 1 (or Solo/Online client)
        if (playerIndex === 0 && (this.touchMove.x !== 0 || this.touchMove.y !== 0)) {
            x = this.touchMove.x;
            y = this.touchMove.y;
        }

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

    // --- MOBILE TOUCH CONTROLS METHODS ---
    setTouchAction(action, isDown, justDown = false) {
        if (this.touchActions.hasOwnProperty(action)) {
            this.touchActions[action] = Boolean(isDown);
            if (justDown) {
                this.touchActionsJust[action] = true;
            }
        }
    }

    setTouchControlMode(mode) {
        // mode: 'auto' | 'on' | 'off'
        this.touchControlMode = mode;
        if (mode === 'on') {
            this.touchEnabled = true;
        } else if (mode === 'off') {
            this.touchEnabled = false;
        } else {
            this.touchEnabled = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        }
        return this.touchControlMode;
    }

    cycleTouchControlMode() {
        if (this.touchControlMode === 'auto') return this.setTouchControlMode('on');
        if (this.touchControlMode === 'on') return this.setTouchControlMode('off');
        return this.setTouchControlMode('auto');
    }

    initTouchControls(container) {
        const touchOverlay = document.getElementById('touch-controls');
        const joystickZone = document.getElementById('touch-joystick-zone');
        const joystickBase = document.getElementById('touch-joystick-base');
        const joystickKnob = document.getElementById('touch-joystick-knob');

        if (!touchOverlay || !joystickZone || !joystickBase || !joystickKnob) return;

        // 1. VIRTUAL JOYSTICK MULTI-TOUCH HANDLER
        const handleJoystickStart = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.joystickTouchId !== null) return;
            const touch = e.changedTouches ? e.changedTouches[0] : e;
            this.joystickTouchId = (touch.identifier !== undefined) ? touch.identifier : 'mouse';
            const rect = joystickBase.getBoundingClientRect();
            this.joystickCenter = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                maxRadius: rect.width * 0.38
            };
            updateJoystick(touch.clientX, touch.clientY);
        };

        const updateJoystick = (clientX, clientY) => {
            const dx = clientX - this.joystickCenter.x;
            const dy = clientY - this.joystickCenter.y;
            const dist = Math.hypot(dx, dy);
            const maxR = this.joystickCenter.maxRadius || 42;
            const angle = Math.atan2(dy, dx);
            const clampedDist = Math.min(dist, maxR);

            const knobX = Math.cos(angle) * clampedDist;
            const knobY = Math.sin(angle) * clampedDist;
            joystickKnob.style.transform = `translate(${knobX}px, ${knobY}px)`;

            const force = Math.min(dist / maxR, 1.0);
            if (force > 0.12) {
                this.touchMove.x = Math.cos(angle) * force;
                this.touchMove.y = Math.sin(angle) * force;
            } else {
                this.touchMove.x = 0;
                this.touchMove.y = 0;
            }
        };

        const handleJoystickMove = (e) => {
            if (this.joystickTouchId === null) return;
            e.preventDefault();
            e.stopPropagation();
            if (e.changedTouches) {
                for (let i = 0; i < e.changedTouches.length; i++) {
                    const t = e.changedTouches[i];
                    if (t.identifier === this.joystickTouchId) {
                        updateJoystick(t.clientX, t.clientY);
                        break;
                    }
                }
            } else if (this.joystickTouchId === 'mouse') {
                updateJoystick(e.clientX, e.clientY);
            }
        };

        const handleJoystickEnd = (e) => {
            if (this.joystickTouchId === null) return;
            if (e.changedTouches) {
                for (let i = 0; i < e.changedTouches.length; i++) {
                    if (e.changedTouches[i].identifier === this.joystickTouchId) {
                        this.joystickTouchId = null;
                        this.touchMove.x = 0;
                        this.touchMove.y = 0;
                        joystickKnob.style.transform = 'translate(0px, 0px)';
                        break;
                    }
                }
            } else if (this.joystickTouchId === 'mouse') {
                this.joystickTouchId = null;
                this.touchMove.x = 0;
                this.touchMove.y = 0;
                joystickKnob.style.transform = 'translate(0px, 0px)';
            }
        };

        joystickZone.addEventListener('touchstart', handleJoystickStart, { passive: false });
        window.addEventListener('touchmove', handleJoystickMove, { passive: false });
        window.addEventListener('touchend', handleJoystickEnd, { passive: false });
        window.addEventListener('touchcancel', handleJoystickEnd, { passive: false });

        // Desktop mouse fallback for testing
        joystickZone.addEventListener('mousedown', (e) => {
            if (e.button === 0) handleJoystickStart(e);
        });
        window.addEventListener('mousemove', (e) => {
            if (this.joystickTouchId === 'mouse') handleJoystickMove(e);
        });
        window.addEventListener('mouseup', (e) => {
            if (this.joystickTouchId === 'mouse') handleJoystickEnd(e);
        });

        // 2. COMBAT ACTION BUTTONS MULTI-TOUCH HANDLER
        const actionButtons = touchOverlay.querySelectorAll('.touch-btn');
        actionButtons.forEach(btn => {
            const action = btn.getAttribute('data-action');
            if (!action) return;

            const onBtnDown = (e) => {
                e.preventDefault();
                e.stopPropagation();
                btn.classList.add('touch-active');
                const isInstant = (action === 'lightAttack' || action === 'skill' || action === 'ultimate' || action === 'dash');
                this.setTouchAction(action, true, isInstant);
            };

            const onBtnUp = (e) => {
                e.preventDefault();
                e.stopPropagation();
                btn.classList.remove('touch-active');
                this.setTouchAction(action, false, false);
            };

            btn.addEventListener('touchstart', onBtnDown, { passive: false });
            btn.addEventListener('touchend', onBtnUp, { passive: false });
            btn.addEventListener('touchcancel', onBtnUp, { passive: false });

            // Desktop mouse fallback
            btn.addEventListener('mousedown', onBtnDown);
            btn.addEventListener('mouseup', onBtnUp);
            btn.addEventListener('mouseleave', onBtnUp);
        });
    }

    // --- CUSTOM KEYBINDINGS STORAGE & UTILITIES ---
    loadBindings() {
        try {
            const s1 = localStorage.getItem('cyber_clash_p1_bindings');
            const s2 = localStorage.getItem('cyber_clash_p2_bindings');
            if (s1) {
                const parsed1 = JSON.parse(s1);
                this.p1Bindings = { ...this.p1Bindings, ...parsed1 };
            }
            if (s2) {
                const parsed2 = JSON.parse(s2);
                this.p2Bindings = { ...this.p2Bindings, ...parsed2 };
            }
            // Purge obsolete strafe lock from saved bindings
            delete this.p1Bindings.strafe;
            delete this.p2Bindings.strafe;

            if (!this.p1Bindings.dash || this.p1Bindings.dash.length === 0) {
                this.p1Bindings.dash = JSON.parse(JSON.stringify(DEFAULT_P1_BINDINGS.dash));
            } else if (!this.p1Bindings.dash.includes('KeyC') && !this.p1Bindings.dash.includes('keyc')) {
                this.p1Bindings.dash.push('KeyC', 'keyc');
            }

            if (!this.p2Bindings.dash || this.p2Bindings.dash.length === 0) {
                this.p2Bindings.dash = JSON.parse(JSON.stringify(DEFAULT_P2_BINDINGS.dash));
            } else if (!this.p2Bindings.dash.includes('Numpad0')) {
                this.p2Bindings.dash.push('Numpad0', 'ControlRight');
            }
        } catch (err) {
            console.warn('[InputManager] Could not load saved bindings:', err);
        }
    }

    saveBindings() {
        try {
            localStorage.setItem('cyber_clash_p1_bindings', JSON.stringify(this.p1Bindings));
            localStorage.setItem('cyber_clash_p2_bindings', JSON.stringify(this.p2Bindings));
        } catch (err) {
            console.warn('[InputManager] Could not save bindings:', err);
        }
    }

    rebindAction(playerIndex, action, keyCode, keyChar) {
        const bindings = playerIndex === 0 ? this.p1Bindings : this.p2Bindings;
        const keysArr = [keyCode];
        if (keyChar && keyChar !== keyCode) {
            keysArr.push(keyChar);
            if (typeof keyChar === 'string') {
                keysArr.push(keyChar.toLowerCase());
                keysArr.push(keyChar.toUpperCase());
            }
        }
        bindings[action] = [...new Set(keysArr)];
        this.saveBindings();
    }

    resetDefaults() {
        this.p1Bindings = JSON.parse(JSON.stringify(DEFAULT_P1_BINDINGS));
        this.p2Bindings = JSON.parse(JSON.stringify(DEFAULT_P2_BINDINGS));
        this.saveBindings();
    }

    getBindingDisplay(playerIndex, action) {
        const bindings = playerIndex === 0 ? this.p1Bindings : this.p2Bindings;
        const list = bindings[action] || [];
        if (list.length === 0) return 'NONE';

        // Select the most user-friendly code in the list
        const primary = list[0];
        return this.formatKeyName(primary);
    }

    formatKeyName(code) {
        if (!code) return 'NONE';
        if (code.startsWith('Key')) return code.replace('Key', '');
        if (code.startsWith('Digit')) return code.replace('Digit', '');
        if (code.startsWith('Numpad')) return 'Num ' + code.replace('Numpad', '');
        if (code === 'Space' || code === ' ') return 'Space';
        if (code === 'Enter' || code === 'NumpadEnter') return 'Enter';
        if (code === 'ArrowUp') return '↑';
        if (code === 'ArrowDown') return '↓';
        if (code === 'ArrowLeft') return '←';
        if (code === 'ArrowRight') return '→';
        if (code === 'ShiftLeft') return 'L-Shift';
        if (code === 'ShiftRight') return 'R-Shift';
        if (code === 'ControlLeft') return 'L-Ctrl';
        if (code === 'ControlRight') return 'R-Ctrl';
        if (code === 'AltLeft') return 'L-Alt';
        if (code === 'AltRight') return 'R-Alt';
        return code.toUpperCase();
    }
}

export const input = new InputManager();

