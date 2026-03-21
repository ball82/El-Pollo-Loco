class Chicken extends BaseChicken{
    y= 370;
    groundY = 370;
    height= 60;
    width= 60;
    images_Walking = [
        'img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];
    
    deadImage = 'img_pollo_locco/img/3_enemies_chicken/chicken_normal/2_dead/dead.png';
    speedMin = 0.32;
    speedRange = 0.35;

    /**
     * Creates an instance of Chicken.
     */
    constructor(){
        super();
        this.initChicken();
    }
}
