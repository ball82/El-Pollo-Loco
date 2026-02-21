class World {   
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

    constructor(canvas, keyboard){
        this.ctx = canvas.getContext("2d");
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

    setWorld(){
        this.character.world = this;
        this.enemies.forEach(enemy => enemy.world = this);
        this.clouds.forEach(cloud => cloud.world = this);
        this.coins.forEach(coin => coin.world = this);
        this.bottles.forEach(bottle => bottle.world = this);
    } 

    run(){
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

    checkThrowObjects() {
        if (!this.keyboard.D) return;
        if (!this.canThrowBottle()) return;
        let bottle = new ThowableObject(this.character.x + 100, this.character.y + 100);
        bottle.world = this;
        this.throwableObjects.push(bottle);
        this.consumeBottle();
        if (typeof playSfx === "function") {
            playSfx("bottle-throw", 0.35);
        }
    }

    canThrowBottle(){
        let timepassed = new Date().getTime() - this.lastThrow;
        return this.character.bottles >= 20 && timepassed > 400;
    }

    consumeBottle(){
        this.lastThrow = new Date().getTime();
        this.character.bottles = Math.max(0, this.character.bottles - 20);
        this.bottleStatusBar.setPercentage(this.character.bottles);
    }

    checkCollisions() {
        if (this.character.isDead()) return;
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.processEnemyCollision(this.enemies[i], i);
        }
    }

    processEnemyCollision(enemy, index) {
        if (enemy.isDead) return;
        if (!this.isCharacterEnemyColliding(enemy)) return;
        if (this.isStompingEnemy(enemy)) {
            this.handleStomp(enemy, index);
            return;
        }
        this.handleCharacterHit();
    }

    isStompingEnemy(enemy) {
        let characterBottom = this.character.y + this.character.height;
        let enemyTop = enemy.y;
        return (
            this.character.speedY < 0 &&
            this.character.y < enemy.y &&
            characterBottom <= enemyTop + 40
        );
    }

    isCharacterEnemyColliding(enemy) {
        const characterBox = this.getAdjustedBox(this.character, {
            top: 10,
            right: 18,
            bottom: 10,
            left: 18
        });
        const enemyOffset = enemy instanceof Endboss
            ? { top: 30, right: 35, bottom: 25, left: 35 }
            : { top: 6, right: 8, bottom: 4, left: 8 };
        const enemyBox = this.getAdjustedBox(enemy, enemyOffset);
        return this.boxesOverlap(characterBox, enemyBox);
    }

    getAdjustedBox(object, offset) {
        const width = Math.max(1, object.width - offset.left - offset.right);
        const height = Math.max(1, object.height - offset.top - offset.bottom);
        return {
            left: object.x + offset.left,
            top: object.y + offset.top,
            right: object.x + offset.left + width,
            bottom: object.y + offset.top + height
        };
    }

    boxesOverlap(a, b) {
        return (
            a.right > b.left &&
            a.bottom > b.top &&
            a.left < b.right &&
            a.top < b.bottom
        );
    }

    handleStomp(enemy, index) {
        if (enemy instanceof Endboss) {
            enemy.hit();
        } else if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
            this.killChicken(enemy);
        } else {
            this.enemies.splice(index, 1);
        }
        this.character.speedY = 10; // bounce after stomp
    }

    killChicken(enemy) {
        enemy.die();
        setTimeout(() => {
            let index = this.enemies.indexOf(enemy);
            if (index !== -1) this.enemies.splice(index, 1);
        }, 2000);
    }

    handleCharacterHit() {
        const wasHurt = this.character.isHurt();
        if (wasHurt) return;
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
        if (!wasHurt && typeof playSfx === "function") {
            playSfx("pepe-hurt", 0.4);
        }
    }

    checkCollectables(){
        this.collectCoins();
        this.collectBottles();
    }

    collectCoins() {
        this.collectFromArray(this.coins, (index) => this.onCoinCollected(index));
    }

    onCoinCollected(index) {
        this.character.coins = Math.min(100, this.character.coins + 20);
        this.coinStatusBar.setPercentage(this.character.coins);
        this.coins.splice(index, 1);
        if (typeof playSfx === "function") playSfx("coin_insert", 0.15);
    }

    collectBottles() {
        this.collectFromArray(this.bottles, (index) => this.onBottleCollected(index));
    }

    onBottleCollected(index) {
        const collectedBottle = this.bottles[index];
        this.character.bottles = Math.min(100, this.character.bottles + 20);
        this.bottleStatusBar.setPercentage(this.character.bottles);
        if (collectedBottle && typeof collectedBottle.stop === "function") {
            collectedBottle.stop();
        }
        this.bottles.splice(index, 1);
        if (typeof playSfx === "function") playSfx("retract_bottles", 0.15);
    }

    collectFromArray(items, onCollect){
        for (let i = items.length - 1; i >= 0; i--) {
            if(this.character.isColliding(items[i])){
                onCollect(i);
            }
        }
    }

    checkThrowableHits(){
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            this.processThrowableObject(i);
        }
    }

    checkEndbossSpawn() {
        const endboss = this.getEndboss();
        if (!endboss || endboss.isDead) return;
        const now = Date.now();
        if (now - this.lastEndbossSpawn < this.endbossSpawnInterval) return;
        this.spawnChickenFromEndboss(endboss);
        this.lastEndbossSpawn = now;
    }

    spawnChickenFromEndboss(endboss) {
        const chicken = Math.random() < 0.5 ? new SmallChicken() : new Chicken();
        chicken.x = endboss.x + 30 + Math.random() * 110;
        chicken.y = this.getGroundChickenY(chicken);
        chicken.world = this;
        this.enemies.push(chicken);
    }

    getGroundChickenY(chicken) {
        if (chicken instanceof SmallChicken) return 400;
        return 370;
     }

    processThrowableObject(index) {
        const bottle = this.throwableObjects[index];
        this.handleMissedBottle(bottle);
        if (this.removeMarkedBottle(index, bottle)) return;
        if (bottle.hasHit) return;
        this.checkBottleEnemyCollisions(index, bottle);
    }

    removeMarkedBottle(index, bottle) {
        if (!bottle.isMarkedForRemoval) return false;
        this.removeThrowableObject(index);
        return true;
    }

    checkBottleEnemyCollisions(bottleIndex, bottle) {
        for (let enemyIndex = this.enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
            const enemy = this.enemies[enemyIndex];
            if (!bottle.isColliding(enemy)) continue;
            this.handleThrowableHit(enemy, enemyIndex, bottle);
            if (!(enemy instanceof Endboss)) this.removeThrowableObject(bottleIndex);
            break;
        }
    }

    handleMissedBottle(bottle) {
        if (bottle.hasHit) return;
        if (bottle.y >= 360) {
            bottle.splash();
            return;
        }
        const outOfLevelRight = bottle.x > this.level.level_end_x + 500;
        const outOfScreenBottom = bottle.y > this.canves.height + 300;
        if (outOfLevelRight || outOfScreenBottom) {
            bottle.markForRemoval();
        }
    }

    removeThrowableObject(index) {
        const bottle = this.throwableObjects[index];
        if (bottle && typeof bottle.stop === "function") {
            bottle.stop();
        }
        this.throwableObjects.splice(index, 1);
    }

    handleThrowableHit(enemy, enemyIndex, bottle){
        if (enemy instanceof Endboss) return this.handleEndbossHit(enemy, bottle);
        this.enemies.splice(enemyIndex, 1);
    }

    handleEndbossHit(enemy, bottle) {
        enemy.hit();
        if (bottle) this.splashBottleOnBoss(enemy, bottle);
        if (typeof playSfx === "function") playSfx("bottle-hit", 0.45);
    }

    splashBottleOnBoss(enemy, bottle) {
        const bossCenter = enemy.x + enemy.width / 2;
        const bottleCenter = bottle.x + bottle.width / 2;
        bottle.x += bottleCenter < bossCenter ? 20 : -20;
        bottle.splash();
    }

    checkGameEnd() {
        if (this.isGameOver) return;
        if (this.handleLossCondition()) return;
        this.handleWinCondition();
    }

    handleLossCondition() {
        if (!this.character.isDead()) return false;
        this.endGame(false);
        return true;
    }

    handleWinCondition() {
        if (!this.isEndbossDefeated()) return;
        const endboss = this.getEndboss();
        if (this.isEndbossDeathAnimationRunning(endboss)) return;
        this.removeEndboss(endboss);
        this.endGame(true);
    }

    getEndboss() {
        return this.enemies.find((enemy) => enemy instanceof Endboss);
    }

    isEndbossDeathAnimationRunning(endboss) {
        const deadStartedAt = endboss?.deadStartedAt || 0;
        const deadDuration = endboss?.getDeadAnimationDuration?.() || 0;
        return deadStartedAt && Date.now() - deadStartedAt < deadDuration;
    }

    removeEndboss(endboss) {
        if (!endboss) return;
        const index = this.enemies.indexOf(endboss);
        if (index !== -1) this.enemies.splice(index, 1);
    }

    isEndbossDefeated() {
        const endboss = this.enemies.find(enemy => enemy instanceof Endboss);
        return !endboss || endboss.isDead;
    }

    endGame(isWin) {
        this.isGameOver = true;
        this.stop();
        this.stopGameAudio();
        this.playEndSound(isWin);
        if (typeof showEndScreen === "function") showEndScreen(isWin);
    }

    stopGameAudio() {
        if (typeof stopAllSounds === "function") stopAllSounds();
    }

    playEndSound(isWin) {
        if (typeof playSfx !== "function") return;
        playSfx(isWin ? "win" : "game-over", 0.45);
    }

    stop() {
        this.isStopped = true;
        this.stopMainInterval();
        this.stopAnimationFrame();
        this.stopThrowableObjects();
    }

    stopMainInterval() {
        if (!this.mainInterval) return;
        clearInterval(this.mainInterval);
        this.mainInterval = null;
    }

    stopAnimationFrame() {
        if (!this.animationFrameId) return;
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
    }

    stopThrowableObjects() {
        this.throwableObjects.forEach((bottle) => {
            if (typeof bottle.stop === "function") bottle.stop();
        });
        this.bottles.forEach((bottle) => {
            if (typeof bottle.stop === "function") bottle.stop();
        });
    }

    draw() {
        drawWorldFrame(this);
    }
}
