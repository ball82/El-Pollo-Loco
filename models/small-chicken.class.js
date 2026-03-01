class SmallChicken extends BaseChicken {
    y = 370;
    height = 45;
    width = 45;
    images_Walking = [
        'img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];
    deadImage = 'img_pollo_locco/img/3_enemies_chicken/chicken_small/2_dead/dead.png';
    speedMin = 0.4;
    speedRange = 0.45;

    /**
     * Creates an instance of SmallChicken.
     */
    constructor() {
        super();
        this.initChicken();
    }
}
