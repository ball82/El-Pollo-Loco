/**
 * Orchestrates game setup, world lifecycle and high-level app flows.
 */
class GameApp {
    /**
     * Creates an instance of GameApp.
     */
    constructor() {
        this.canvas = null;
        this.world = null;
        this.keyboard = new Keyboard();
        this.gameStarted = false;
        this.ui = new GameUiController();
        this.viewport = new GameViewportController();
        this.input = new GameInputController(this.keyboard, () => Boolean(this.world));
        this.input.bindKeyboard();
    }

    /**
     * Initializes a new world instance.
     * @returns {void} - No return value.
     */
    initWorld() {
        this.canvas = document.getElementById('canvas');
        if (!this.canvas) return;
        this.viewport.setCanvas(this.canvas);
        this.world = new World(this.canvas, this.keyboard);
    }

    /**
     * Starts the game if it has not started yet.
     * @returns {void} - No return value.
     */
    startGame() {
        if (this.gameStarted) return;
        this.gameStarted = true;
        this.ui.hideLanding();
        this.ui.hideEndScreen();
        this.startGameAudio();
        this.initWorld();
    }

    /**
     * Restarts the current game session.
     * @returns {void} - No return value.
     */
    restartGame() {
        this.stopCurrentWorld();
        this.ui.hideEndScreen();
        this.gameStarted = true;
        level1 = LevelFactory.createLevel1();
        this.startGameAudio();
        this.initWorld();
    }

    /**
     * Stops the world and returns to landing state.
     * @returns {void} - No return value.
     */
    backToHome() {
        this.stopCurrentWorld();
        this.ui.hideEndScreen();
        this.startBackgroundAudio();
        this.ui.showLanding();
        this.gameStarted = false;
        level1 = LevelFactory.createLevel1();
    }

    /**
     * Stops the active world and resets input state.
     * @returns {void} - No return value.
     */
    stopCurrentWorld() {
        if (!this.world) return;
        this.world.stop();
        this.world = null;
        this.input.resetKeyboard();
    }

    /**
     * Defers landing setup until the DOM is ready.
     * @returns {void} - No return value.
     */
    startLandingWhenReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupLandingScreen());
            return;
        }
        this.setupLandingScreen();
    }

    /**
     * Initializes landing UI and startup systems.
     * @returns {void} - No return value.
     */
    setupLandingScreen() {
        this.canvas = document.getElementById('canvas');
        if (!this.canvas) return;
        this.viewport.setCanvas(this.canvas);
        this.viewport.resizeCanvasToViewport();
        this.input.setupMobileControls();
        this.viewport.setupOrientationGuard();
        this.viewport.setupViewportResize();
        AudioManager.init();
        AudioManager.startBackgroundMusic();
    }

    /**
     * Starts game audio tracks and stops other sounds.
     * @returns {void} - No return value.
     */
    startGameAudio() {
        AudioManager.stopAllSounds();
        AudioManager.pauseOtherTracks('game-music');
        AudioManager.startGameMusic();
    }

    /**
     * Starts landing/background audio tracks.
     * @returns {void} - No return value.
     */
    startBackgroundAudio() {
        AudioManager.stopAllSounds();
        AudioManager.pauseOtherTracks('bg-music');
        AudioManager.startBackgroundMusic();
    }

    /**
     * Opens an informational modal for the provided type.
     *
     * @param {string} type - Type key for template content.
     * @returns {void} - No return value.
     */
    openModal(type) {
        this.ui.openModal(type);
    }

    /**
     * Closes the informational modal.
     * @returns {void} - No return value.
     */
    closeModal() {
        this.ui.closeModal();
    }

    /**
     * Toggles browser fullscreen mode.
     * @returns {void} - No return value.
     */
    toggleFullscreen() {
        this.ui.toggleFullscreen();
    }

    /**
     * Shows the end screen with win/loss content.
     *
     * @param {boolean} isWin - Whether the game ended in a win.
     * @returns {void} - No return value.
     */
    showEndScreen(isWin) {
        this.ui.showEndScreen(isWin);
    }
}
