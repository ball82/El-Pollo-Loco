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



    constructor(canvas, keyboard){
        this.ctx = canvas.getContext("2d");
        this.canves = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
    }

    setWorld(){
        this.character.world = this;
    } 

    draw() {

        this.ctx.clearRect(0, 0, this.canves.width, this.canves.height); // clear canvas

        this.ctx.translate(this.camera_x, 0) ;

        this.ctx.drawImage(this.character.img, this.character.x, this.character.y, this.character.width, this.character.height);
        this.addObject(this.backgroundObjects); 
        this.addToMap(this.character);
        this.addObject(this.enemies);
        this.addObject(this.clouds);

        this.ctx.translate(-this.camera_x, 0);  

        //requestAnimationFrame(() => this.draw()); // Modernere
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
