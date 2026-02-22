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
    throwableObjects = [];
    isStopped = false;
    isGameOver = false;
    mainInterval;
    animationFrameId;
    lastThrow = 0;
    endbossSpawnInterval = 8000;
    lastEndbossSpawn = 0;

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
        this.statusBar.setPercentage(this.character.energy);
        this.coinStatusBar.setPercentage(this.character.coins);
        this.bottleStatusBar.setPercentage(this.character.bottles);
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
            this.checkGameEnd();
        }, 1000 / 60);
    }

    /**
     * Draws the object.
     * @returns {void} - No return value.
     */
    draw() {
        WorldRenderer.drawFrame(this);
    }
}
