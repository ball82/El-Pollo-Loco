class ThowableObject extends MovableObject {

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

    trow(){
        this.speedY = 12;
        this.applyGravity();
        this.throwInterval = setInterval(() => {
            this.x += 6.5;
        }, 16);
    }

    animateRotation(){
        setInterval(() => {
            if (this.isSplashing) return;
            this.playAnimation(this.images_Rotation);
        }, 80);
    }

    splash(){
        if (this.isSplashing) return;
        this.isSplashing = true;
        this.hasHit = true;
        if (this.throwInterval) {
            clearInterval(this.throwInterval);
            this.throwInterval = null;
        }
        this.speedY = 0;
        let frame = 0;
        const splashInterval = setInterval(() => {
            if (frame >= this.images_Splash.length) {
                clearInterval(splashInterval);
                this.isMarkedForRemoval = true;
                return;
            }
            this.path = this.images_Splash[frame];
            this.img = this.imageCache[this.path];
            frame += 1;
        }, 55);
    }
 
}
