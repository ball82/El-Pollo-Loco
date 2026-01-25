class Coin extends MovableObject {

    height = 80;
    width = 80;

    images_Spinning = [
        'img_pollo_locco/img/8_coin/coin_1.png',
        'img_pollo_locco/img/8_coin/coin_2.png'
    ];

    constructor(x, y){
        super().loadImage(this.images_Spinning[0]);
        this.loadImages(this.images_Spinning);
        this.x = x;
        this.y = y;
        this.animate();
    }

    animate(){
        setInterval(() => {
            if (this.world && this.world.isStopped) return;
            this.playAnimation(this.images_Spinning);
        }, 200);
    }
}
