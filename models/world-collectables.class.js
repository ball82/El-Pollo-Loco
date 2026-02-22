class WorldCollectables extends WorldCombat {
    
    checkCollectables() {
        this.collectCoins();
        this.collectBottles();
    }

    collectCoins() {
        this.collectFromArray(this.coins, (index) => this.onCoinCollected(index));
    }

    onCoinCollected(index) {
        this.character.coins = Math.min(100, this.character.coins + 20);
        this.coinStatusBar.setPercentage(this.character.coins);
        this.coins.splice(index, 1);
        AudioManager.playSfx('coin_insert', 0.15);
    }

    collectBottles() {
        this.collectFromArray(this.bottles, (index) => this.onBottleCollected(index));
    }

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

    collectFromArray(items, onCollect) {
        for (let i = items.length - 1; i >= 0; i--) {
            if (this.character.isColliding(items[i])) {
                onCollect(i);
            }
        }
    }
}
