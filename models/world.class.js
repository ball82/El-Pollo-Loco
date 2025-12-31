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

    constructor(canvas, keyboard){
        this.ctx = canvas.getContext("2d");
        this.canves = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.checkCollisions();
    }

    setWorld(){
        this.character.world = this;
    } 

    checkCollisions(){
        setInterval(() => {
            this.enemies.forEach((enemy) => {
                if(this.character.isColliding(enemy)){
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
                }
            });
        }, 1000);
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
