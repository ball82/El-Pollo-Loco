class Character extends MovableObject{   

    height = 280;
    y = 160;
    speed = 17;




    images_walking   = [
        'img_pollo_locco/img/2_character_pepe/2_walk/W-21.png',
        'img_pollo_locco/img/2_character_pepe/2_walk/W-22.png',
        'img_pollo_locco/img/2_character_pepe/2_walk/W-23.png',
        'img_pollo_locco/img/2_character_pepe/2_walk/W-24.png',
        'img_pollo_locco/img/2_character_pepe/2_walk/W-25.png',
        'img_pollo_locco/img/2_character_pepe/2_walk/W-26.png', 
    ];
    world;

    constructor(){

        super().loadImage('img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.images_walking);

        this.animate();
    }

        animate(){

            setInterval(() => {
                if(this.world.keyboard.right){
                    this.x += this.speed;
                    this.otherDirection = false;
                }
                if(this.world.keyboard.left){
                    this.x -= this.speed;
                    this.otherDirection = true;
                }
                this.world.camera_x = -this.x + 100;
            }, 1000/60);

            setInterval(() => {

                if(this.world.keyboard.right || this.world.keyboard.left){
                    let i = this.CurrentImage % this.images_walking.length;
                    this.path = this.images_walking[i];
                    this.img = this.imageCache[this.path];
                    this.CurrentImage++;
                }
            }, 50);
    }

    jump() {
        //Character jump logic
        console.log("Jumping");
    }



}