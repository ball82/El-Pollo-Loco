class LevelFactory {
    static placeEnemy(enemy, x) {
        enemy.x = x;
        return enemy;
    }

    static createLevel1() {
        const endboss = new Endboss();
        endboss.x = 720 * 3 + 450;

        return new Level(
            [
                this.placeEnemy(new SmallChicken(), 760),
                this.placeEnemy(new Chicken(), 900),
                this.placeEnemy(new SmallChicken(), 1040),
                this.placeEnemy(new Chicken(), 1180),
                this.placeEnemy(new SmallChicken(), 1320),
                this.placeEnemy(new Chicken(), 1460),
                this.placeEnemy(new SmallChicken(), 1600),
                this.placeEnemy(new Chicken(), 1740),
                this.placeEnemy(new SmallChicken(), 1880),
                this.placeEnemy(new Chicken(), 2020),
                this.placeEnemy(new SmallChicken(), 2160),
                endboss,
            ],
            [
                new Cloud(-720),
                new Cloud(-120),
                new Cloud(480),
                new Cloud(1080),
                new Cloud(1680),
                new Cloud(2280),
                new Cloud(2880),
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
            endboss.x - 120
        );
    }
}

let level1 = LevelFactory.createLevel1();
