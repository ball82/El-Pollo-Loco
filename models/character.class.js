class Character extends MovableObject{   

    height = 280;
    y = 80;
    speed = 17;
    width = 150;

    images_Walking   = [
        'img_pollo_locco/img/2_character_pepe/2_walk/W-21.png',
        'img_pollo_locco/img/2_character_pepe/2_walk/W-22.png',
        'img_pollo_locco/img/2_character_pepe/2_walk/W-23.png',
        'img_pollo_locco/img/2_character_pepe/2_walk/W-24.png',
        'img_pollo_locco/img/2_character_pepe/2_walk/W-25.png',
        'img_pollo_locco/img/2_character_pepe/2_walk/W-26.png', 
    ];

    images_Jupping = [
        'img_pollo_locco/img/2_character_pepe/3_jump/J-31.png',
        'img_pollo_locco/img/2_character_pepe/3_jump/J-32.png',
        'img_pollo_locco/img/2_character_pepe/3_jump/J-33.png',
        'img_pollo_locco/img/2_character_pepe/3_jump/J-34.png',
        'img_pollo_locco/img/2_character_pepe/3_jump/J-35.png',
        'img_pollo_locco/img/2_character_pepe/3_jump/J-36.png',
        'img_pollo_locco/img/2_character_pepe/3_jump/J-37.png',
        'img_pollo_locco/img/2_character_pepe/3_jump/J-38.png',
        'img_pollo_locco/img/2_character_pepe/3_jump/J-39.png',      
    ];

    world;

    constructor(){
        super().loadImage('img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.images_Walking);
        this.loadImages(this.images_Jupping);
        this.applyGravity();
        this.animate();
    }

    animate(){

        setInterval(() => {
            if(this.world.keyboard.right && this.x < this.world.level.level_end_x ){
                this.moveRight();
                this.otherDirection = false;
            }
            if(this.world.keyboard.left && this.x > 0 ){
                this.moveLeft();
                this.otherDirection = true;
             }
            if(this.world.keyboard.space){
                this.jump(); 
            }

            this.world.camera_x = -this.x + 80;
        }, 1000/60);

        setInterval(() => {

            if(this.isAboveGround()){
                this.playAnimation(this.images_Jupping);
            } else{
                if(this.world.keyboard.right || this.world.keyboard.left){
                    this.playAnimation(this.images_Walking);
                    }
                }
        }, 50);
    }

    jump() {
        if(!this.isAboveGround())
        this.speedY = 15;
        } 

}
