const endboss = new Endboss();
endboss.x = 719 * 3;

const level1 = new Level(
    [
        new Chicken(), 
        new Chicken(), 
        new Chicken(),
        endboss,
    ],
    [
        new Cloud(),
    ],
    [
        new BackgroundObject('img_pollo_locco/img/5_background/layers/air.png', -719 * 3, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/3_third_layer/full.png', -719 * 3, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/2_second_layer/full.png', -719 * 3, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/1_first_layer/full.png', -719 * 3, 0),    

        new BackgroundObject('img_pollo_locco/img/5_background/layers/air.png', -719 * 2, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/3_third_layer/full.png', -719 * 2, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/2_second_layer/full.png', -719 * 2, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/1_first_layer/full.png', -719 * 2, 0),

        new BackgroundObject('img_pollo_locco/img/5_background/layers/air.png', -719, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/3_third_layer/full.png', -719, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/2_second_layer/full.png', -719, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/1_first_layer/full.png', -719, 0),


        new BackgroundObject('img_pollo_locco/img/5_background/layers/air.png', 0, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/3_third_layer/full.png', 0, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/2_second_layer/full.png', 0, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/1_first_layer/full.png', 0, 0),

        new BackgroundObject('img_pollo_locco/img/5_background/layers/air.png', 719, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/3_third_layer/full.png', 719, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/2_second_layer/full.png', 719, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/1_first_layer/full.png', 719, 0),

        new BackgroundObject('img_pollo_locco/img/5_background/layers/air.png', 719 * 2, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/3_third_layer/full.png', 719 * 2, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/2_second_layer/full.png', 719 * 2, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/1_first_layer/full.png', 719 * 2, 0),

        new BackgroundObject('img_pollo_locco/img/5_background/layers/air.png', 719 * 3, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/3_third_layer/full.png', 719 * 3, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/2_second_layer/full.png', 719 * 3, 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/1_first_layer/full.png', 719 * 3, 0)
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
        new Bottle(1650, 360)
    ],
    719 * 3
);
