class Bottle extends MovableObject {

    height = 80;
    width = 70;

    images_OnGround = [
        'img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img_pollo_locco/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];
    animationInterval = null;

    constructor(x, y){
        super().loadImage(this.images_OnGround[0]);
        this.loadImages(this.images_OnGround);
        this.x = x;
        this.y = y;
        this.animate();
    }

    animate(){
        this.stop();
        this.animationInterval = setInterval(() => {
            if (this.world && this.world.isStopped) return;
            this.playAnimation(this.images_OnGround);
        }, 120);
    }

    stop() {
        if (!this.animationInterval) return;
        clearInterval(this.animationInterval);
        this.animationInterval = null;
    }
}
