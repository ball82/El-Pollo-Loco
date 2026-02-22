class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    level_end_x;

    /**
     * Creates an instance of Level.
     *
     * @param {Array<MovableObject>} enemies - Enemy instances used in this level.
     * @param {Array<Cloud>} clouds - Cloud objects rendered in the background.
     * @param {Array<BackgroundObject>} backgroundObjects - Parallax background layers for the level.
     * @param {Array<Coin>} coins - Collectible coin objects.
     * @param {Array<Bottle>} bottles - Collectible bottle objects.
     * @param {number} level_end_x - X position where the level ends.
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottles, level_end_x){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
        this.level_end_x = level_end_x;
    }
} 
