class BaseChicken extends MovableObject {
    isDead = false;
    deadAt = 0;
    isAirborneAttack = false;
    airborneGravity = 0.42;
    airborneSpeedY = 0;
    airborneInterval = null;
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
     * Launches chicken from the endboss and starts normal walking after landing.
     *
     * @param {number} startX - Start x-position in pixels.
     * @param {number} startY - Start y-position in pixels.
     * @param {number} groundY - Ground y-position where the chicken should land.
     * @returns {void} - No return value.
     */
    launchFromEndboss(startX, startY, groundY) {
        this.stopAirborneAttack();
        this.x = startX;
        this.y = startY;
        this.isAirborneAttack = true;
        this.airborneSpeedY = 10 + Math.random() * 2.5;
        const horizontalSpeed = -(3.4 + Math.random() * 1.2);
        this.airborneInterval = setInterval(() => {
            this.updateAirborneAttack(horizontalSpeed, groundY);
        }, this.moveInterval);
    }

    /**
     * Updates airborne movement until ground contact.
     *
     * @param {number} horizontalSpeed - Horizontal speed for throw movement.
     * @param {number} groundY - Ground y-position where the chicken should land.
     * @returns {void} - No return value.
     */
    updateAirborneAttack(horizontalSpeed, groundY) {
        if (this.world && this.world.isStopped) return;
        if (this.isDead) return;
        this.x += horizontalSpeed;
        this.y -= this.airborneSpeedY;
        this.airborneSpeedY -= this.airborneGravity;
        if (this.y < groundY) return;
        this.y = groundY;
        this.isAirborneAttack = false;
        this.stopAirborneAttack();
    }

    /**
     * Stops airborne attack interval.
     * @returns {void} - No return value.
     */
    stopAirborneAttack() {
        if (!this.airborneInterval) return;
        clearInterval(this.airborneInterval);
        this.airborneInterval = null;
    }

    /**
     * Determines whether pause should run.
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    shouldPause() {
        return (this.world && this.world.isStopped) || this.isDead || this.isAirborneAttack;
    }

    /**
     * Marks the chicken as dead and switches to the dead sprite.
     * @returns {void} - No return value.
     */
    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.isAirborneAttack = false;
        this.stopAirborneAttack();
        this.deadAt = Date.now();
        if (this.deadImage) this.loadImage(this.deadImage);
        if (this.groundY && this.y < this.groundY) this.fallToGround();
    }

    fallToGround() {
        let speedY = 0;
        this.airborneInterval = setInterval(() => {
            speedY -= this.airborneGravity;
            this.y -= speedY;
            if (this.y >= this.groundY) {
                this.y = this.groundY;
                this.stopAirborneAttack();
            }
        }, this.moveInterval);
    }
}
