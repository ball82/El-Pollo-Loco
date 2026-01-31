class BaseChicken extends MovableObject {
    isDead = false;
    deadAt = 0;
    images_Walking = [];
    deadImage = '';
    startXMin = 900;
    startXRange = 900;
    speedMin = 0.15;
    speedRange = 0.25;
    moveInterval = 1000 / 60;
    walkInterval = 200;

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

    animate() {
        this.startMovement();
        this.startWalkAnimation();
    }

    startMovement() {
        setInterval(() => {
            if (this.shouldPause()) return;
            this.moveLeft();
        }, this.moveInterval);
    }

    startWalkAnimation() {
        setInterval(() => {
            if (this.shouldPause()) return;
            this.playAnimation(this.images_Walking);

            if (this.CurrentImage >= this.images_Walking.length) {
                this.CurrentImage = 0;
            }
        }, this.walkInterval);
    }

    shouldPause() {
        return (this.world && this.world.isStopped) || this.isDead;
    }

    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.deadAt = Date.now();
        if (this.deadImage) {
            this.loadImage(this.deadImage);
        }
    }
}
