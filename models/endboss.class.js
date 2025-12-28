class Endboss extends MovableObject {

    height = 350;
    width = 220;   
    y = 100;


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
        this.x = 700;
        this.animate();
        
    }

    animate(){
        setInterval(() => {
            this.playAnimation(this.images_Walking);
        }, 160);
    }

}