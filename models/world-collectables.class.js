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
        if (this.character.bottles >= this.bottleCapacity) return;
        const collectedBottle = this.bottles[index];
        this.character.bottles = Math.min(this.bottleCapacity, this.character.bottles + 1);
        this.updateBottleStatusBar();
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
            const item = items[i];
            if (!this.isCollectableCollision(item)) continue;
            onCollect(i);
        }
    }

    /**
     * Checks reduced collision between Pepe and one collectable item.
     *
     * @param {MovableObject} item - Collectable item to process.
     * @returns {boolean} - True if reduced hitboxes overlap; otherwise false.
     */
    isCollectableCollision(item) {
        return this.isAdjustedColliding(
            this.character,
            { top: 8, right: 10, bottom: 8, left: 10 },
            item,
            this.getCollectableOffset(item)
        );
    }

    /**
     * Returns reduced hitbox offset for collectable item types.
     *
     * @param {MovableObject} item - Collectable item to process.
     * @returns {{top:number,right:number,bottom:number,left:number}} - Offset values.
     */
    getCollectableOffset(item) {
        if (item instanceof Coin) return { top: 16, right: 16, bottom: 16, left: 16 };
        if (item instanceof Bottle) return { top: 12, right: 14, bottom: 10, left: 14 };
        return { top: 0, right: 0, bottom: 0, left: 0 };
    }
}
