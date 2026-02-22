/**
 * Controls canvas sizing behavior and mobile orientation overlay.
 */
class GameViewportController {
    /**
     * Creates an instance of GameViewportController.
     */
    constructor() {
        this.canvas = null;
        this.orientationGuardReady = false;
        this.resizeHandler = () => this.resizeCanvasToViewport();
    }

    /**
     * Sets the active canvas element for viewport updates.
     *
     * @param {HTMLCanvasElement} canvas - Canvas element to manage.
     * @returns {void} - No return value.
     */
    setCanvas(canvas) {
        this.canvas = canvas;
    }

    /**
     * Registers orientation guard listeners once.
     * @returns {void} - No return value.
     */
    setupOrientationGuard() {
        if (this.orientationGuardReady) return;
        const overlay = document.getElementById('rotate-overlay');
        if (!overlay) return;
        const update = () => this.updateOrientationOverlay(overlay);
        update();
        window.addEventListener('resize', update);
        window.addEventListener('orientationchange', update);
        this.orientationGuardReady = true;
    }

    /**
     * Updates rotate-overlay visibility for mobile portrait mode.
     *
     * @param {HTMLElement} overlay - Overlay element for orientation hint.
     * @returns {void} - No return value.
     */
    updateOrientationOverlay(overlay) {
        const portrait = window.matchMedia('(orientation: portrait)').matches;
        const shouldShow = this.isMobileView() && portrait;
        overlay.classList.toggle('hidden', !shouldShow);
    }

    /**
     * Checks whether the current viewport is a mobile view.
     *
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    isMobileView() {
        return window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 900;
    }

    /**
     * Registers resize listeners for canvas scaling.
     * @returns {void} - No return value.
     */
    setupViewportResize() {
        window.addEventListener('resize', this.resizeHandler);
        window.addEventListener('orientationchange', this.resizeHandler);
    }

    /**
     * Resizes canvas according to current viewport profile.
     * @returns {void} - No return value.
     */
    resizeCanvasToViewport() {
        if (!this.canvas) return;
        if (!this.isMobileCanvasViewport()) {
            this.resetCanvasSize();
            return;
        }
        this.fillCanvasViewport();
    }

    /**
     * Checks if canvas should use full mobile viewport dimensions.
     *
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    isMobileCanvasViewport() {
        return window.matchMedia('(pointer: coarse)').matches ||
            window.matchMedia('(max-width: 1024px)').matches;
    }

    /**
     * Restores canvas style dimensions to CSS defaults.
     * @returns {void} - No return value.
     */
    resetCanvasSize() {
        this.canvas.style.width = '';
        this.canvas.style.height = '';
    }

    /**
     * Expands canvas to viewport (with dynamic viewport fallback).
     * @returns {void} - No return value.
     */
    fillCanvasViewport() {
        this.canvas.width = 720;
        this.canvas.height = 480;
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        if (!this.hasDynamicViewportSupport()) return;
        this.canvas.style.width = '100dvw';
        this.canvas.style.height = '100dvh';
    }

    /**
     * Checks dynamic viewport unit support (`dvh`).
     *
     * @returns {boolean} - True if supported; otherwise false.
     */
    hasDynamicViewportSupport() {
        return typeof CSS !== 'undefined' && CSS.supports('height', '100dvh');
    }
}
