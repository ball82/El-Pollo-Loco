class Cloud extends MovableObject {

    y = 20;
    height = 150;
    width = 500;

    constructor(){
        super().loadImage('img_pollo_locco/img/5_background/layers/4_clouds/2.png');

        this.x = Math.random() * 500; // random position

        this.moveLeft();
    
    }


}
