class GameApp {
    constructor() {
        this.canvas = null;
        this.world = null;
        this.keyboard = new Keyboard();
        this.gameStarted = false;
        this.mobileControlsReady = false;
        this.orientationGuardReady = false;

        document.addEventListener('keydown', (event) => this.onKeyDown(event));
        document.addEventListener('keyup', (event) => this.onKeyUp(event));
    }

    init() {
        this.canvas = document.getElementById('canvas');
        this.world = new World(this.canvas, this.keyboard);
    }

    startGame() {
        if (this.gameStarted) return;
        this.gameStarted = true;
        this.hideLanding();
        this.hideEndScreen();
        AudioManager.stopAllSounds();
        AudioManager.pauseOtherTracks('game-music');
        AudioManager.startGameMusic();
        this.init();
    }

    hideLanding() {
        const landing = document.getElementById('landing');
        if (landing) landing.classList.add('hidden');
    }

    showLanding() {
        const landing = document.getElementById('landing');
        if (landing) landing.classList.remove('hidden');
        AudioManager.stopAllSounds();
        AudioManager.pauseOtherTracks('bg-music');
        AudioManager.startBackgroundMusic();
    }

    showEndScreen(isWin) {
        const endscreen = document.getElementById('endscreen');
        const title = document.getElementById('end-title');
        const text = document.getElementById('end-text');
        if (!endscreen || !title || !text) return;
        if (isWin) {
            title.textContent = 'Gewonnen!';
            text.textContent = 'Stark! Du hast den Endboss besiegt.';
        } else {
            title.textContent = 'Game Over';
            text.textContent = 'Du hast verloren. Versuch es nochmal!';
        }
        endscreen.classList.remove('hidden');
    }

    hideEndScreen() {
        const endscreen = document.getElementById('endscreen');
        if (endscreen) endscreen.classList.add('hidden');
    }

    restartGame() {
        this.stopCurrentWorld();
        this.hideEndScreen();
        this.gameStarted = true;
        level1 = LevelFactory.createLevel1();
        AudioManager.stopAllSounds();
        AudioManager.pauseOtherTracks('game-music');
        AudioManager.startGameMusic();
        this.init();
    }

    backToHome() {
        this.stopCurrentWorld();
        this.hideEndScreen();
        this.showLanding();
        this.gameStarted = false;
        level1 = LevelFactory.createLevel1();
    }

    stopCurrentWorld() {
        if (!this.world) return;
        this.world.stop();
        this.world = null;
        this.resetKeyboard();
    }

    resetKeyboard() {
        this.keyboard.left = false;
        this.keyboard.right = false;
        this.keyboard.up = false;
        this.keyboard.down = false;
        this.keyboard.space = false;
        this.keyboard.D = false;
    }

    setupMobileControls() {
        if (this.mobileControlsReady) return;
        const buttons = this.getMobileControlButtons();
        if (buttons.length === 0) return;
        const handlers = this.createMobileControlHandlers();
        this.attachMobileControlHandlers(buttons, handlers);
        this.mobileControlsReady = true;
    }

    getMobileControlButtons() {
        const container = document.getElementById('mobile-controls');
        if (!container) return [];
        return Array.from(container.querySelectorAll('[data-action]'));
    }

    setMobileKey(action, pressed) {
        if (action === 'left') this.keyboard.left = pressed;
        if (action === 'right') this.keyboard.right = pressed;
        if (action === 'jump') this.keyboard.space = pressed;
        if (action === 'throw') this.keyboard.D = pressed;
    }

    createMobileControlHandlers() {
        const startHandler = (event) => {
            event.preventDefault();
            const action = event.currentTarget.dataset.action;
            this.setMobileKey(action, true);
        };
        const endHandler = (event) => {
            event.preventDefault();
            const action = event.currentTarget.dataset.action;
            this.setMobileKey(action, false);
        };
        return { startHandler, endHandler };
    }

    attachMobileControlHandlers(buttons, handlers) {
        buttons.forEach((button) => {
            button.addEventListener('touchstart', handlers.startHandler, { passive: false });
            button.addEventListener('touchend', handlers.endHandler, { passive: false });
            button.addEventListener('touchcancel', handlers.endHandler, { passive: false });
            button.addEventListener('mousedown', handlers.startHandler);
            button.addEventListener('mouseup', handlers.endHandler);
            button.addEventListener('mouseleave', handlers.endHandler);
            button.addEventListener('contextmenu', (event) => event.preventDefault());
        });
    }

    setupOrientationGuard() {
        if (this.orientationGuardReady) return;
        const overlay = document.getElementById('rotate-overlay');
        if (!overlay) return;
        const update = this.createOrientationUpdater(overlay);
        update();
        window.addEventListener('resize', update);
        window.addEventListener('orientationchange', update);
        this.orientationGuardReady = true;
    }

    createOrientationUpdater(overlay) {
        return () => {
            const portrait = window.matchMedia('(orientation: portrait)').matches;
            overlay.classList.toggle('hidden', !(this.isMobileView() && portrait));
        };
    }

    isMobileView() {
        return window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 900;
    }

    openModal(type) {
        this.setModalContent(type);
        this.toggleModal(true);
    }

    closeModal() {
        this.toggleModal(false);
    }

    toggleModal(show) {
        const modal = document.getElementById('info-modal');
        if (!modal) return;
        modal.classList.toggle('hidden', !show);
    }

    setModalContent(type) {
        const title = document.getElementById('modal-title');
        const content = document.getElementById('modal-content');
        if (!title || !content) return;
        const data = ModalTemplates.getByType(type);
        title.textContent = data.title;
        content.innerHTML = data.html;
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            return;
        }
        document.exitFullscreen();
    }

    onKeyDown(event) {
        if (!this.world) return;
        if (event.key === 'ArrowRight') this.keyboard.right = true;
        if (event.key === 'ArrowLeft') this.keyboard.left = true;
        if (event.key === 'ArrowUp') this.keyboard.up = true;
        if (event.key === 'ArrowDown') this.keyboard.down = true;
        if (event.key === ' ') this.keyboard.space = true;
        if (event.key === 'd' || event.key === 'D') this.keyboard.D = true;
    }

    onKeyUp(event) {
        if (!this.world) return;
        if (event.key === 'ArrowRight') this.keyboard.right = false;
        if (event.key === 'ArrowLeft') this.keyboard.left = false;
        if (event.key === 'ArrowUp') this.keyboard.up = false;
        if (event.key === 'ArrowDown') this.keyboard.down = false;
        if (event.key === ' ') this.keyboard.space = false;
        if (event.key === 'd' || event.key === 'D') this.keyboard.D = false;
    }

    startLandingWhenReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupLandingScreen());
            return;
        }
        this.setupLandingScreen();
    }

    setupLandingScreen() {
        this.canvas = document.getElementById('canvas');
        this.resizeCanvasToViewport();
        this.setupMobileControls();
        this.setupOrientationGuard();
        this.setupViewportResize();
        AudioManager.init();
        AudioManager.startBackgroundMusic();
    }

    setupViewportResize() {
        window.addEventListener('resize', () => this.resizeCanvasToViewport());
        window.addEventListener('orientationchange', () => this.resizeCanvasToViewport());
    }

    resizeCanvasToViewport() {
        if (!this.canvas) return;
        if (!this.isMobileCanvasViewport()) {
            this.resetCanvasSize();
            return;
        }
        this.fillCanvasViewport();
    }

    isMobileCanvasViewport() {
        return window.matchMedia('(pointer: coarse)').matches ||
            window.matchMedia('(max-width: 1024px)').matches;
    }

    resetCanvasSize() {
        this.canvas.style.width = '';
        this.canvas.style.height = '';
    }

    fillCanvasViewport() {
        this.canvas.width = 720;
        this.canvas.height = 480;
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        if (typeof CSS !== 'undefined' && CSS.supports('height', '100dvh')) {
            this.canvas.style.width = '100dvw';
            this.canvas.style.height = '100dvh';
        }
    }
}

const gameApp = new GameApp();
gameApp.startLandingWhenReady();

function startGame() {
    gameApp.startGame();
}

function restartGame() {
    gameApp.restartGame();
}

function backToHome() {
    gameApp.backToHome();
}

function openModal(type) {
    gameApp.openModal(type);
}

function closeModal() {
    gameApp.closeModal();
}

function toggleFullscreen() {
    gameApp.toggleFullscreen();
}

function showEndScreen(isWin) {
    gameApp.showEndScreen(isWin);
}
