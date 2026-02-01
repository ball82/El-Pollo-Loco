function createLevel1(){
    const endboss = new Endboss();
    endboss.x = 720 * 3 + 450;

    return new Level(
        [
            new Chicken(), 
            new Chicken(), 
            new Chicken(),
            new SmallChicken(),
            new SmallChicken(720, 0),
            new Chicken(720, 0),
            new SmallChicken(),
            new Chicken(),
            endboss,
        ],
        [
            new Cloud(),
        ],
        [
        new BackgroundObject('img_pollo_locco/img/5_background/layers/air.png', -720 * 3, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/3_third_layer/full.png', -720 * 3, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/2_second_layer/full.png', -720 * 3, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/1_first_layer/full.png', -720 * 3, 0),    

        new BackgroundObject('img_pollo_locco/img/5_background/layers/air.png', -720 * 2, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/3_third_layer/full.png', -720 * 2, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/2_second_layer/full.png', -720 * 2, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/1_first_layer/full.png', -720 * 2, 0),

        new BackgroundObject('img_pollo_locco/img/5_background/layers/air.png', -720, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/3_third_layer/full.png', -720, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/2_second_layer/full.png', -720, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/1_first_layer/full.png', -720, 0),


        new BackgroundObject('img_pollo_locco/img/5_background/layers/air.png', 0, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/3_third_layer/full.png', 0, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/2_second_layer/full.png', 0, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/1_first_layer/full.png', 0, 0),

        new BackgroundObject('img_pollo_locco/img/5_background/layers/air.png', 720, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/3_third_layer/full.png', 720, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/2_second_layer/full.png', 720, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/1_first_layer/full.png', 720, 0),

        new BackgroundObject('img_pollo_locco/img/5_background/layers/air.png', 720 * 2, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/3_third_layer/full.png', 720 * 2, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/2_second_layer/full.png', 720 * 2, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/1_first_layer/full.png', 720 * 2, 0),

        new BackgroundObject('img_pollo_locco/img/5_background/layers/air.png', 720 * 3, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/3_third_layer/full.png', 720 * 3, 0),
            new BackgroundObject('img_pollo_locco/img/5_background/layers/2_second_layer/full.png', 720 * 3, 0),
            new BackgroundObject('img_pollo_locco/img/5_background/layers/1_first_layer/full.png', 720 * 3, 0)
        ],
        [
            new Coin(300, 330),
            new Coin(450, 280),
            new Coin(700, 330),
            new Coin(950, 280),
            new Coin(1200, 330),
            new Coin(1500, 280)
        ],
        [
            new Bottle(350, 360),
            new Bottle(650, 360),
            new Bottle(900, 360),
            new Bottle(1250, 360),
            new Bottle(1650, 360),
            new Bottle(1950, 360),
            new Bottle(2200, 360),
        ],
        720 * 3 + 70
    );
}

let level1 = createLevel1();
