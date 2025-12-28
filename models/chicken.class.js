class Chicken extends MovableObject{

    y= 370;
    height= 60;
    width= 60;
    images_Walking = [
        'img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];
 



    constructor(){
        super().loadImage('img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 200 + Math.random() * 500; // random position
        this.loadImages(this.images_Walking);
        this.speed = 0.15 + Math.random() * 0.25; // random speed between 0.15 and 0.4

        this.animate(); 
        
    }

    animate(){
        this.moveLeft();
        setInterval(() => {
            
            this.playAnimation(this.images_Walking);
             
            if(this.CurrentImage >= this.images_Walking.length){
                this.CurrentImage = 0;
            }
        }, 200);
        
    }


}

