class ThowableObject extends MovableObject {

    /**
     * Creates an instance of ThowableObject.
     *
     * @param {number} x - Horizontal position in pixels.
     * @param {number} y - Vertical position in pixels.
     */
    constructor(x, y){
        super().loadImage('img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.images_Rotation = [
            'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
            'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
            'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
            'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
        ];
        this.images_Splash = [
            'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
            'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
            'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
            'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
            'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
            'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
        ];
        this.loadImages(this.images_Rotation);
        this.loadImages(this.images_Splash);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.hasHit = false;
        this.isSplashing = false;
        this.isMarkedForRemoval = false;
        this.trow();
        this.animateRotation();
    }

    /**
     * Starts the throw movement with gravity.
     * @returns {void} - No return value.
     */
    trow(){
        this.speedY = 12;
        this.applyGravity();
        this.throwInterval = setInterval(() => {
            if (this.world && this.world.isStopped) return;
            if (this.isMarkedForRemoval) return;
            this.x += 6.5;
        }, 16);
    }

    /**
     * Plays bottle rotation frames while flying.
     * @returns {void} - No return value.
     */
    animateRotation(){
        this.rotationInterval = setInterval(() => {
            if (this.world && this.world.isStopped) return;
            if (this.isSplashing) return;
            this.playAnimation(this.images_Rotation);
        }, 80);
    }

    /**
     * Starts splash state after impact.
     * @returns {void} - No return value.
     */
    splash(){
        if (this.isSplashing) return;
        this.isSplashing = true;
        this.hasHit = true;
        this.stopThrowMovement();
        this.speedY = 0;
        this.startSplashAnimation();
    }

    /**
     * Stops throw movement.
     * @returns {void} - No return value.
     */
    stopThrowMovement() {
        if (!this.throwInterval) return;
        clearInterval(this.throwInterval);
        this.throwInterval = null;
    }

    /**
     * Starts splash animation.
     * @returns {void} - No return value.
     */
    startSplashAnimation() {
        let frame = 0;
        this.splashInterval = setInterval(() => {
            if (this.world && this.world.isStopped) return;
            if (frame >= this.images_Splash.length) {
                this.markForRemoval();
                return;
            }
            this.path = this.images_Splash[frame];
            this.img = this.imageCache[this.path];
            frame += 1;
        }, 55);
    }

    /**
     * Marks the bottle for cleanup.
     * @returns {void} - No return value.
     */
    markForRemoval() {
        this.isMarkedForRemoval = true;
        if (this.splashInterval) {
            clearInterval(this.splashInterval);
            this.splashInterval = null;
        }
    }

    /**
     * Stops the process.
     * @returns {void} - No return value.
     */
    stop() {
        this.markForRemoval();
        this.stopThrowMovement();
        this.stopRotationAnimation();
        if (typeof this.stopGravity === "function") {
            this.stopGravity();
        }
    }

    /**
     * Stops rotation animation.
     * @returns {void} - No return value.
     */
    stopRotationAnimation() {
        if (!this.rotationInterval) return;
        clearInterval(this.rotationInterval);
        this.rotationInterval = null;
    }
 
}
