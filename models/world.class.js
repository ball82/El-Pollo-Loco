class World {   
    character = new Character();
    enemies = [
        new Chicken(), 
        new Chicken(), 
        new Chicken()
    ];
    canves;

    clouds = [
        new Cloud()
    ];
    backgroundObjects = [
        new BackgroundObject('img_pollo_locco/img/5_background/layers/air.png', 0, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/3_third_layer/full.png', 0, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/2_second_layer/full.png', 0, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/1_first_layer/full.png', 0, 0),
    ];
    ctx;    
    keyboard;



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

        this.ctx.drawImage(this.character.img, this.character.x, this.character.y, this.character.width, this.character.height);
        this.addObject(this.backgroundObjects); 
        this.addToMap(this.character);
        this.addObject(this.enemies);
        this.addObject(this.clouds);

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

    addToMap = function(mo){
        
        if(mo.otherDirection){
            this.ctx.save();
            this.ctx.translate(mo.x + mo.width, 0);
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(mo.img, 0, mo.y, mo.width, mo.height);
            this.ctx.restore();
            return;
        }
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        }

}