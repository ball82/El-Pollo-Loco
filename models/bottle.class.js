class Bottle extends MovableObject {

    height = 80;
    width = 70;

    images_OnGround = [
        'img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img_pollo_locco/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];
    animationInterval = null;

    /**
     * Creates an instance of Bottle.
     *
     * @param {number} x - Horizontal position in pixels.
     * @param {number} y - Vertical position in pixels.
     */
    constructor(x, y){
        super().loadImage(this.images_OnGround[0]);
        this.loadImages(this.images_OnGround);
        this.x = x;
        this.y = y;
        this.animate();
    }

    /**
     * Loops the idle bottle animation.
     * @returns {void} - No return value.
     */
    animate(){
        this.stop();
        this.animationInterval = setInterval(() => {
            if (this.world && this.world.isStopped) return;
            this.playAnimation(this.images_OnGround);
        }, 120);
    }

    /**
     * Stops the process.
     * @returns {void} - No return value.
     */
    stop() {
        if (!this.animationInterval) return;
        clearInterval(this.animationInterval);
        this.animationInterval = null;
    }
}
