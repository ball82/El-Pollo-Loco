class Chicken extends MovableObject{

    y= 370;
    height= 60;
    width= 80;
    constructor(){
        super().loadImage('img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');

        this.x = 200 + Math.random() * 500; // random position
        this.animate(); 
        
    }

    animate(){
        setInterval(() => {
            this.moveRight();
        }, 1000 / 40);
    }   
}

