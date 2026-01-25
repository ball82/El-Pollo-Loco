class World {   
    character = new Character();
    level = level1;
    enemies = level1.enemies;
    clouds = level1.clouds;
    backgroundObjects = level1.backgroundObjects;
    canves;
    ctx;    
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    throwableObjects = [];
    isStopped = false;
    isGameOver = false;
    mainInterval;

    constructor(canvas, keyboard){
        this.ctx = canvas.getContext("2d");
        this.canves = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld(){
        this.character.world = this;
        this.enemies.forEach(enemy => enemy.world = this);
    } 

    run(){
        this.mainInterval = setInterval(() => {
            if (this.isStopped) return;
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkGameEnd();
        }, 200);
    }

    checkThrowObjects() {
        if (this.keyboard.D) {
            let bottle = new ThowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
        }
    }

    checkCollisions() {
        this.enemies.forEach((enemy) => {
            if(this.character.isColliding(enemy)){
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        });
    }

    checkGameEnd() {
        if (this.isGameOver) return;
        if (this.character.isDead()) {
            this.endGame(false);
            return;
        }
        if (this.character.x >= this.level.level_end_x) {
            this.endGame(true);
        }
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
        this.ctx.translate(this.camera_x, 0) ;

        this.addToMap(this.character);
        this.addObject(this.enemies);
        this.addObject(this.clouds);
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
        mo.drawFrame(this.ctx);

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
