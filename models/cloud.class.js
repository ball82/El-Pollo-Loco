class Cloud extends MovableObject {

    y = 20;
    height = 150;
    width = 500;

    /**
     * Creates an instance of Cloud.
     *
     * @param {number} x - Horizontal position in pixels.
     */
    constructor(x = 0){
        super().loadImage('img_pollo_locco/img/5_background/layers/4_clouds/2.png');
        this.x = x;
        this.y = 20 + Math.random() * 60;
        this.speed = 0.18 + Math.random() * 0.12;
        this.animate();
    }

    /**
     * Animates cloud movement and recycling.
     * @returns {void} - No return value.
     */
    animate() {
        setInterval(() => {
            if (this.world && this.world.isStopped) return;
            this.moveLeft();
            this.resetPositionIfOutOfView();
        }, 1000 / 60);
    }

    /**
     * Resets position if out of view.
     * @returns {void} - No return value.
     */
    resetPositionIfOutOfView() {
        if (!this.world || !this.world.canves) return;
        const cameraLeft = -this.world.camera_x;
        const outOfViewLeft = cameraLeft - this.width - 200;
        if (this.x < outOfViewLeft) {
            this.x = cameraLeft + this.world.canves.width + Math.random() * 500;
            this.y = 20 + Math.random() * 60;
        }
    }

}
