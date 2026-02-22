/**
 * Manages keyboard and touch input mapping for gameplay controls.
 */
class GameInputController {
    /**
     * Creates an instance of GameInputController.
     *
     * @param {Keyboard} keyboard - Shared keyboard state container.
     * @param {() => boolean} hasWorldFn - Callback indicating if a world is active.
     */
    constructor(keyboard, hasWorldFn) {
        this.keyboard = keyboard;
        this.hasWorldFn = hasWorldFn;
        this.mobileControlsReady = false;
    }

    /**
     * Registers desktop keyboard listeners.
     * @returns {void} - No return value.
     */
    bindKeyboard() {
        document.addEventListener('keydown', (event) => this.onKeyDown(event));
        document.addEventListener('keyup', (event) => this.onKeyUp(event));
    }

    /**
     * Handles keydown events.
     *
     * @param {KeyboardEvent} event - Browser keyboard event.
     * @returns {void} - No return value.
     */
    onKeyDown(event) {
        this.setDesktopKey(event, true);
    }

    /**
     * Handles keyup events.
     *
     * @param {KeyboardEvent} event - Browser keyboard event.
     * @returns {void} - No return value.
     */
    onKeyUp(event) {
        this.setDesktopKey(event, false);
    }

    /**
     * Updates one desktop key state in the shared keyboard model.
     *
     * @param {KeyboardEvent} event - Browser keyboard event.
     * @param {boolean} pressed - Whether the key is currently pressed.
     * @returns {void} - No return value.
     */
    setDesktopKey(event, pressed) {
        if (!this.hasWorldFn()) return;
        const map = this.getDesktopMap();
        const key = map[event.key];
        if (key) this.keyboard[key] = pressed;
    }

    /**
     * Returns the desktop key-to-state map.
     *
     * @returns {Object<string, string>} - Key mapping object.
     */
    getDesktopMap() {
        return {
            ArrowRight: 'right',
            ArrowLeft: 'left',
            ArrowUp: 'up',
            ArrowDown: 'down',
            ' ': 'space',
            d: 'D',
            D: 'D'
        };
    }

    /**
     * Resets all relevant control keys to false.
     * @returns {void} - No return value.
     */
    resetKeyboard() {
        const keys = ['left', 'right', 'up', 'down', 'space', 'D'];
        keys.forEach((key) => this.keyboard[key] = false);
    }

    /**
     * Binds touch/mouse handlers for mobile controls once.
     * @returns {void} - No return value.
     */
    setupMobileControls() {
        if (this.mobileControlsReady) return;
        const buttons = this.getMobileButtons();
        if (!buttons.length) return;
        const handlers = this.createMobileHandlers();
        this.attachMobileHandlers(buttons, handlers);
        this.mobileControlsReady = true;
    }

    /**
     * Returns all mobile control buttons with an action attribute.
     *
     * @returns {HTMLElement[]} - Matching control button elements.
     */
    getMobileButtons() {
        const container = document.getElementById('mobile-controls');
        if (!container) return [];
        return Array.from(container.querySelectorAll('[data-action]'));
    }

    /**
     * Creates press and release handlers for mobile controls.
     *
     * @returns {{start: Function, end: Function}} - Start/end handler pair.
     */
    createMobileHandlers() {
        return {
            start: (event) => this.handleMobileEvent(event, true),
            end: (event) => this.handleMobileEvent(event, false)
        };
    }

    /**
     * Handles one mobile button interaction event.
     *
     * @param {Event} event - Browser pointer/touch event.
     * @param {boolean} pressed - Whether the related action is pressed.
     * @returns {void} - No return value.
     */
    handleMobileEvent(event, pressed) {
        event.preventDefault();
        const action = event.currentTarget?.dataset?.action;
        this.setMobileKey(action, pressed);
    }

    /**
     * Maps a mobile action string to the keyboard model.
     *
     * @param {string} action - Mobile action key from dataset.
     * @param {boolean} pressed - Whether the action is pressed.
     * @returns {void} - No return value.
     */
    setMobileKey(action, pressed) {
        const map = { left: 'left', right: 'right', jump: 'space', throw: 'D' };
        const key = map[action];
        if (key) this.keyboard[key] = pressed;
    }

    /**
     * Attaches mobile handlers to a list of buttons.
     *
     * @param {HTMLElement[]} buttons - Buttons to wire.
     * @param {{start: Function, end: Function}} handlers - Interaction handlers.
     * @returns {void} - No return value.
     */
    attachMobileHandlers(buttons, handlers) {
        buttons.forEach((button) => this.bindMobileButton(button, handlers));
    }

    /**
     * Binds all touch/mouse listeners for one mobile button.
     *
     * @param {HTMLElement} button - Button element to wire.
     * @param {{start: Function, end: Function}} handlers - Interaction handlers.
     * @returns {void} - No return value.
     */
    bindMobileButton(button, handlers) {
        button.addEventListener('touchstart', handlers.start, { passive: false });
        button.addEventListener('touchend', handlers.end, { passive: false });
        button.addEventListener('touchcancel', handlers.end, { passive: false });
        button.addEventListener('mousedown', handlers.start);
        button.addEventListener('mouseup', handlers.end);
        button.addEventListener('mouseleave', handlers.end);
        button.addEventListener('contextmenu', (event) => event.preventDefault());
    }
}
