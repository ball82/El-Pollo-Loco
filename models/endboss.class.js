class Endboss extends MovableObject {

    height = 350;
    width = 220;   
    y = 100;
    isDead = false;
    hitsTaken = 0;
    maxHits = 5;
    deadStartedAt = 0;
    deadFrameTime = 180;


    images_Walking = [
        'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G13.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G14.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G15.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G16.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G17.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G18.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G19.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    constructor(){
        super().loadImage(this.images_Walking[0]);
        this.loadImages(this.images_Walking);
        this.images_Dead = [
            'img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G24.png',
            'img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G25.png',
            'img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G26.png'
        ];
        this.loadImages(this.images_Dead);
        this.x = 1800;
        this.animate();
        
    }

    animate(){
        setInterval(() => {
            if (this.world && this.world.isStopped) return;
            if (this.isDead) return;
            this.playAnimation(this.images_Walking);
        }, 90);
    }

    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.deadStartedAt = Date.now();
        this.playDeadAnimation();
    }

    playDeadAnimation() {
        let frame = 0;
        const interval = setInterval(() => {
            if (frame >= this.images_Dead.length) {
                clearInterval(interval);
                return;
            }
            this.path = this.images_Dead[frame];
            this.img = this.imageCache[this.path];
            frame += 1;
        }, this.deadFrameTime);
    }

    getDeadAnimationDuration() {
        return this.images_Dead.length * this.deadFrameTime;
    }

    hit() {
        if (this.isDead) return;
        this.hitsTaken += 1;
        if (this.hitsTaken >= this.maxHits) {
            this.die();
        }
    }

}
