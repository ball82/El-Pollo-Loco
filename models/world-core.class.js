class WorldCore {
    character = new Character();
    level = level1;
    enemies = level1.enemies;
    clouds = level1.clouds;
    backgroundObjects = level1.backgroundObjects;
    coins = level1.coins;
    bottles = level1.bottles;
    canves;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar;
    coinStatusBar;
    bottleStatusBar;
    endbossStatusBar;
    endbossStatusBarVisible = false;
    throwableObjects = [];
    isStopped = false;
    isGameOver = false;
    mainInterval;
    animationFrameId;
    lastThrow = 0;
    bottleCapacity = 8;
    endbossSpawnInterval = 3000;
    lastEndbossSpawn = 0;
    endbossBottleRefillTriggered = false;

    healthImages = [
        'img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
    ];

    coinImages = [
        'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
    ];

    bottleImages = [
        'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png'
    ];

    endbossStatusImages = [
        'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green0.png',
        'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green20.png',
        'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green40.png',
        'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green60.png',
        'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green80.png',
        'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green100.png'
    ];

    /**
     * Creates an instance of WorldCore.
     *
     * @param {HTMLCanvasElement} canvas - Canvas element used for rendering.
     * @param {Keyboard} keyboard - Keyboard input state object.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canves = canvas;
        this.keyboard = keyboard;
        this.showHitboxes = false;
        this.statusBar = new StatusBar(this.healthImages, 40, 0);
        this.coinStatusBar = new StatusBar(this.coinImages, 40, 60);
        this.bottleStatusBar = new StatusBar(this.bottleImages, 40, 120);
        this.endbossStatusBar = new StatusBar(this.endbossStatusImages, 480, 0);
        this.statusBar.setPercentage(this.character.energy);
        this.coinStatusBar.setPercentage(this.character.coins);
        this.updateBottleStatusBar();
        this.endbossStatusBar.setPercentage(100);
        this.draw();
        this.setWorld();
        this.run();
    }

    /**
     * Assigns world references to all active entities.
     * @returns {void} - No return value.
     */
    setWorld() {
        this.character.world = this;
        this.enemies.forEach((enemy) => enemy.world = this);
        this.clouds.forEach((cloud) => cloud.world = this);
        this.coins.forEach((coin) => coin.world = this);
        this.bottles.forEach((bottle) => bottle.world = this);
    }

    /**
     * Runs the loop.
     * @returns {void} - No return value.
     */
    run() {
        if (this.mainInterval) {
            clearInterval(this.mainInterval);
        }
        this.mainInterval = setInterval(() => {
            if (this.isStopped) return;
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkCollectables();
            this.checkThrowableHits();
            this.checkEndbossSpawn();
            this.checkEndbossBottleRefill();
            this.updateEndbossStatusBar();
            this.checkGameEnd();
        }, 1000 / 60);
    }

    /**
     * Updates endboss health bar value and visibility during boss fight.
     * Overridden methods are used when available.
     *
     * @returns {void} - No return value.
     */
    updateEndbossStatusBar() {
        if (!this.endbossStatusBar) return;
        if (typeof this.getEndboss !== 'function') return;
        const endboss = this.getEndboss();
        if (!endboss) {
            this.endbossStatusBarVisible = false;
            return;
        }
        const canvasWidth = this.canves?.width || 720;
        this.endbossStatusBar.x = canvasWidth - this.endbossStatusBar.width - 28;
        this.endbossStatusBar.y = 12;
        this.endbossStatusBarVisible = this.character.x >= endboss.x - canvasWidth * 0.9;
        const maxHits = Math.max(1, endboss.maxHits || 1);
        const remainingHits = Math.max(0, maxHits - (endboss.hitsTaken || 0));
        const percentage = this.getEndbossStatusPercentage(maxHits, remainingHits);
        this.endbossStatusBar.setPercentage(percentage);
    }

    /**
     * Returns a status percentage that keeps the bar visible until the last hit.
     *
     * @param {number} maxHits - Maximum hits required to defeat endboss.
     * @param {number} remainingHits - Remaining hits before defeat.
     * @returns {number} - Status bar percentage.
     */
    getEndbossStatusPercentage(maxHits, remainingHits) {
        if (remainingHits <= 0) return 0;
        if (maxHits <= 1) return 100;
        return 20 + ((remainingHits - 1) / (maxHits - 1)) * 80;
    }

    /**
     * Updates bottle status bar based on current bottle count and max capacity.
     *
     * @returns {void} - No return value.
     */
    updateBottleStatusBar() {
        if (!this.bottleStatusBar) return;
        const safeCapacity = Math.max(1, this.bottleCapacity || 1);
        const percentage = (Math.max(0, this.character.bottles) / safeCapacity) * 100;
        this.bottleStatusBar.setPercentage(percentage);
    }

    /**
     * Optional hook for one-time bottle refill near endboss zone.
     * Overridden in WorldCombat.
     *
     * @returns {void} - No return value.
     */
    checkEndbossBottleRefill() {}

    /**
     * Draws the object.
     * @returns {void} - No return value.
     */
    draw() {
        WorldRenderer.drawFrame(this);
    }
}
