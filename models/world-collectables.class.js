class WorldCollectables extends WorldCombat {
    
    /**
     * Checks collectables.
     * @returns {void} - No return value.
     */
    checkCollectables() {
        this.collectCoins();
        this.collectBottles();
    }

    /**
     * Collects coins.
     * @returns {void} - No return value.
     */
    collectCoins() {
        this.collectFromArray(this.coins, (index) => this.onCoinCollected(index));
    }

    /**
     * Handles on coin collected.
     *
     * @param {number} index - Index in the related collection.
     * @returns {void} - No return value.
     */
    onCoinCollected(index) {
        this.character.coins = Math.min(100, this.character.coins + 20);
        this.coinStatusBar.setPercentage(this.character.coins);
        this.coins.splice(index, 1);
        AudioManager.playSfx('coin_insert', 0.15);
    }

    /**
     * Collects bottles.
     * @returns {void} - No return value.
     */
    collectBottles() {
        this.collectFromArray(this.bottles, (index) => this.onBottleCollected(index));
    }

    /**
     * Handles on bottle collected.
     *
     * @param {number} index - Index in the related collection.
     * @returns {void} - No return value.
     */
    onBottleCollected(index) {
        const collectedBottle = this.bottles[index];
        this.character.bottles = Math.min(100, this.character.bottles + 20);
        this.bottleStatusBar.setPercentage(this.character.bottles);
        if (collectedBottle && typeof collectedBottle.stop === 'function') {
            collectedBottle.stop();
        }
        this.bottles.splice(index, 1);
        AudioManager.playSfx('retract_bottles', 0.15);
    }

    /**
     * Collects from array.
     *
     * @param {Array<*>} items - Collection of collectible objects.
     * @param {Function} onCollect - Callback fired when an item is collected.
     * @returns {void} - No return value.
     */
    collectFromArray(items, onCollect) {
        for (let i = items.length - 1; i >= 0; i--) {
            if (this.character.isColliding(items[i])) {
                onCollect(i);
            }
        }
    }
}
