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
    lastThrow = 0;

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
        this.coinStatusBar.setPercentage(0);
        this.bottleStatusBar.setPercentage(0);
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld(){
        this.character.world = this;
        this.enemies.forEach(enemy => enemy.world = this);
        this.coins.forEach(coin => coin.world = this);
        this.bottles.forEach(bottle => bottle.world = this);
    } 

    run(){
        this.mainInterval = setInterval(() => {
            if (this.isStopped) return;
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkCollectables();
            this.checkThrowableHits();
            this.checkGameEnd();
        }, 200);
    }

    checkThrowObjects() {
        if (!this.keyboard.D) return;
        if (!this.canThrowBottle()) return;
        let bottle = new ThowableObject(this.character.x + 100, this.character.y + 100);
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
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            let enemy = this.enemies[i];
            if (enemy.isDead) continue;
            if (!this.character.isColliding(enemy)) continue;

            if (this.isStompingEnemy(enemy)) {
                this.handleStomp(enemy, i);
            } else {
                this.handleCharacterHit();
            }
        }
    }

    isStompingEnemy(enemy) {
        let characterBottom = this.character.y + this.character.height;
        let enemyTop = enemy.y;
        return this.character.speedY < 0 && (characterBottom - enemyTop) < 40;
    }

    handleStomp(enemy, index) {
        if (enemy instanceof Endboss) {
            enemy.die();
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
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
        if (!wasHurt && typeof playSfx === "function") {
            playSfx("pepe-hurt", 0.4);
        }
    }

    checkCollectables(){
        this.collectFromArray(this.coins, (index) => {
            this.character.coins = Math.min(100, this.character.coins + 20);
            this.coinStatusBar.setPercentage(this.character.coins);
            this.coins.splice(index, 1);
        });
        this.collectFromArray(this.bottles, (index) => {
            this.character.bottles = Math.min(100, this.character.bottles + 20);
            this.bottleStatusBar.setPercentage(this.character.bottles);
            this.bottles.splice(index, 1);
        });
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
            const bottle = this.throwableObjects[i];
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                if (bottle.isColliding(enemy)) {
                    this.handleThrowableHit(enemy, j);
                    this.throwableObjects.splice(i, 1);
                    break;
                }
            }
        }
    }

    handleThrowableHit(enemy, enemyIndex){
        if (enemy instanceof Endboss) {
            enemy.hit();
            if (enemy.isDead) {
                this.enemies.splice(enemyIndex, 1);
            }
        } else {
            this.enemies.splice(enemyIndex, 1);
        }
    }

    checkGameEnd() {
        if (this.isGameOver) return;
        if (this.character.isDead()) {
            this.endGame(false);
            return;
        }
        if (this.isEndbossDefeated()) {
            this.endGame(true);
        }
    }

    isEndbossDefeated() {
        const endboss = this.enemies.find(enemy => enemy instanceof Endboss);
        return !endboss || endboss.isDead;
    }

    endGame(isWin) {
        this.isGameOver = true;
        this.isStopped = true;
        if (typeof showEndScreen === "function") {
            showEndScreen(isWin);
        }
    }

    stop() {
        this.isStopped = true;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canves.width, this.canves.height); // clear canvas

        this.ctx.translate(this.camera_x, 0) ;

        this.ctx.drawImage(this.character.img, this.character.x, this.character.y, this.character.width, this.character.height);
        this.addObject(this.backgroundObjects); 

        this.ctx.translate(-this.camera_x, 0);  
        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);
        this.ctx.translate(this.camera_x, 0) ;

        this.addToMap(this.character);
        this.addObject(this.enemies);
        this.addObject(this.clouds);
        this.addObject(this.coins);
        this.addObject(this.bottles);
        this.addObject(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);  

        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    addObject = function(objects){
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap (mo){
        
        if(mo.otherDirection){
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        if (this.showHitboxes) {
            mo.drawFrame(this.ctx);
        }

        if(mo.otherDirection){
            this.flipImageBack(mo);

        }   
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore(); 
    }



}
