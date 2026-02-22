class BaseChicken extends MovableObject {
    isDead = false;
    deadAt = 0;
    images_Walking = [];
    deadImage = '';
    startXMin = 900;
    startXRange = 900;
    speedMin = 0.28;
    speedRange = 0.35;
    moveInterval = 1000 / 60;
    walkInterval = 110;

    /**
     * Initializes chicken.
     * @returns {void} - No return value.
     */
    initChicken() {
        const firstImage = this.images_Walking[0];
        if (firstImage) {
            this.loadImage(firstImage);
            this.loadImages(this.images_Walking);
        }
        this.x = this.startXMin + Math.random() * this.startXRange; // keep early area safe
        this.speed = this.speedMin + Math.random() * this.speedRange;
        this.animate();
    }

    /**
     * Starts movement and walk animation loops.
     * @returns {void} - No return value.
     */
    animate() {
        this.startMovement();
        this.startWalkAnimation();
    }

    /**
     * Starts movement.
     * @returns {void} - No return value.
     */
    startMovement() {
        setInterval(() => {
            if (this.shouldPause()) return;
            this.moveLeft();
        }, this.moveInterval);
    }

    /**
     * Starts walk animation.
     * @returns {void} - No return value.
     */
    startWalkAnimation() {
        setInterval(() => {
            if (this.shouldPause()) return;
            this.playAnimation(this.images_Walking);

            if (this.CurrentImage >= this.images_Walking.length) {
                this.CurrentImage = 0;
            }
        }, this.walkInterval);
    }

    /**
     * Determines whether pause should run.
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    shouldPause() {
        return (this.world && this.world.isStopped) || this.isDead;
    }

    /**
     * Marks the chicken as dead and switches to the dead sprite.
     * @returns {void} - No return value.
     */
    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.deadAt = Date.now();
        if (this.deadImage) {
            this.loadImage(this.deadImage);
        }
    }
}
