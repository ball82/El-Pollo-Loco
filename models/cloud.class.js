class Cloud extends MovableObject {

    y = 20;
    height = 150;
    width = 500;

    constructor(){
        super().loadImage('img_pollo_locco/img/5_background/layers/4_clouds/2.png');

        this.x = Math.random() * 500; // random position
        this.animate(); 
    }

    animate(){
        setInterval(() => {
            this.x -= 0.75;
            if(this.x < -500){
                this.x = 800; // reset position
            }
        }, 1000 / 60);
    }
}
