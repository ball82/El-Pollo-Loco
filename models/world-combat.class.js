/**
 * Combat, throw and hit-detection logic for the game world.
 * Extends the core world with enemy interactions and bottle handling.
 */
class WorldCombat extends WorldCore {
    /**
     * Tries to throw a bottle when the throw key is pressed.
     * Creates and registers a throwable object if all throw conditions are met.
     *
     * @returns {void} - No return value.
     */
    checkThrowObjects() {
        if (!this.keyboard.D) return;
        if (!this.canThrowBottle()) return;
        const bottle = new ThowableObject(this.character.x + 100, this.character.y + 100);
        bottle.world = this;
        this.throwableObjects.push(bottle);
        this.consumeBottle();
        AudioManager.playSfx('bottle-throw', 0.35);
    }

    /**
     * Checks whether Pepe is allowed to throw a new bottle.
     *
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    canThrowBottle() {
        const timepassed = new Date().getTime() - this.lastThrow;
        return this.character.bottles >= 20 &&
            timepassed > 400 &&
            !this.hasFlyingThrowableBottle();
    }

    /**
     * Detects if there is currently an active bottle in the air.
     *
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    hasFlyingThrowableBottle() {
        return this.throwableObjects.some((bottle) => this.isThrowableBottleInAir(bottle));
    }

    /**
     * Checks whether a throwable bottle is still flying.
     *
     * @param {ThowableObject | null | undefined} bottle - Thrown bottle instance.
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    isThrowableBottleInAir(bottle) {
        if (!bottle) return false;
        return !bottle.hasHit && !bottle.isMarkedForRemoval;
    }

    /**
     * Consumes one bottle charge from Pepe and updates the status bar.
     *
     * @returns {void} - No return value.
     */
    consumeBottle() {
        this.lastThrow = new Date().getTime();
        this.character.bottles = Math.max(0, this.character.bottles - 20);
        this.bottleStatusBar.setPercentage(this.character.bottles);
    }

    /**
     * Runs collision checks between Pepe and enemies.
     *
     * @returns {void} - No return value.
     */
    checkCollisions() {
        if (this.character.isDead()) return;
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.processEnemyCollision(this.enemies[i], i);
        }
    }

    /**
     * Handles a single enemy collision case.
     *
     * @param {MovableObject} enemy - Enemy instance to process.
     * @param {number} index - Index in the related collection.
     * @returns {void} - No return value.
     */
    processEnemyCollision(enemy, index) {
        if (enemy.isDead) return;
        if (!this.isCharacterEnemyColliding(enemy)) return;
        if (this.isStompingEnemy(enemy)) {
            this.handleStomp(enemy, index);
            return;
        }
        this.handleCharacterHit();
    }

    /**
     * Checks whether Pepe is stomping the enemy from above.
     *
     * @param {MovableObject} enemy - Enemy instance to process.
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    isStompingEnemy(enemy) {
        const characterBottom = this.character.y + this.character.height;
        const enemyTop = enemy.y;
        return (
            this.character.speedY < 0 &&
            this.character.y < enemy.y &&
            characterBottom <= enemyTop + 40
        );
    }

    /**
     * Collision check with adjusted hitboxes for character and enemy types.
     *
     * @param {MovableObject} enemy - Enemy instance to process.
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    isCharacterEnemyColliding(enemy) {
        const characterBox = this.getAdjustedBox(this.character, {
            top: 10,
            right: 18,
            bottom: 10,
            left: 18
        });
        const enemyOffset = enemy instanceof Endboss
            ? { top: 30, right: 35, bottom: 25, left: 35 }
            : { top: 6, right: 8, bottom: 4, left: 8 };
        const enemyBox = this.getAdjustedBox(enemy, enemyOffset);
        return this.boxesOverlap(characterBox, enemyBox);
    }

    /**
     * Builds a reduced collision box from an object and offset values.
     *
     * @param {MovableObject} object - World object to process.
     * @param {{top:number,right:number,bottom:number,left:number}} offset
     * @returns {{left:number,top:number,right:number,bottom:number}}
     */
    getAdjustedBox(object, offset) {
        const width = Math.max(1, object.width - offset.left - offset.right);
        const height = Math.max(1, object.height - offset.top - offset.bottom);
        return {
            left: object.x + offset.left,
            top: object.y + offset.top,
            right: object.x + offset.left + width,
            bottom: object.y + offset.top + height
        };
    }

    /**
     * Axis-aligned bounding-box overlap test.
     *
     * @param {{left:number,top:number,right:number,bottom:number}} a
     * @param {{left:number,top:number,right:number,bottom:number}} b
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    boxesOverlap(a, b) {
        return (
            a.right > b.left &&
            a.bottom > b.top &&
            a.left < b.right &&
            a.top < b.bottom
        );
    }

    /**
     * Handles stomp results for different enemy types.
     *
     * @param {MovableObject} enemy - Enemy instance to process.
     * @param {number} index - Index in the related collection.
     * @returns {void} - No return value.
     */
    handleStomp(enemy, index) {
        if (enemy instanceof Endboss) {
            enemy.hit();
        } else if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
            this.killChicken(enemy);
        } else {
            this.enemies.splice(index, 1);
        }
        this.character.speedY = 10;
    }

    /**
     * Kills a chicken and removes it after a delay.
     *
     * @param {BaseChicken} enemy - Enemy instance to process.
     * @returns {void} - No return value.
     */
    killChicken(enemy) {
        enemy.die();
        setTimeout(() => {
            const index = this.enemies.indexOf(enemy);
            if (index !== -1) this.enemies.splice(index, 1);
        }, 2000);
    }

    /**
     * Applies damage to Pepe if he is not in the hurt cooldown.
     *
     * @returns {void} - No return value.
     */
    handleCharacterHit() {
        const wasHurt = this.character.isHurt();
        if (wasHurt) return;
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
        if (!wasHurt) {
            AudioManager.playSfx('pepe-hurt', 0.4);
        }
    }

    /**
     * Processes all active throwable bottle interactions.
     *
     * @returns {void} - No return value.
     */
    checkThrowableHits() {
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            this.processThrowableObject(i);
        }
    }

    /**
     * Spawns new enemies near the endboss in a fixed interval.
     *
     * @returns {void} - No return value.
     */
    checkEndbossSpawn() {
        const endboss = this.getEndboss();
        if (!endboss || endboss.isDead) return;
        const now = Date.now();
        if (now - this.lastEndbossSpawn < this.endbossSpawnInterval) return;
        this.spawnChickenFromEndboss(endboss);
        this.lastEndbossSpawn = now;
    }

    /**
     * Spawns a random chicken type close to the endboss.
     *
     * @param {Endboss} endboss - Endboss instance.
     * @returns {void} - No return value.
     */
    spawnChickenFromEndboss(endboss) {
        const chicken = Math.random() < 0.5 ? new SmallChicken() : new Chicken();
        chicken.x = endboss.x + 30 + Math.random() * 110;
        chicken.y = this.getGroundChickenY(chicken);
        chicken.world = this;
        this.enemies.push(chicken);
    }

    /**
     * Returns the ground Y position for a spawned chicken type.
     *
     * @param {BaseChicken} chicken - Chicken instance.
     * @returns {number} - Ground y-position for the given chicken type.
     */
    getGroundChickenY(chicken) {
        if (chicken instanceof SmallChicken) return 400;
        return 370;
    }

    /**
     * Handles one throwable object lifecycle step.
     *
     * @param {number} index - Index in the related collection.
     * @returns {void} - No return value.
     */
    processThrowableObject(index) {
        const bottle = this.throwableObjects[index];
        this.handleMissedBottle(bottle);
        if (this.removeMarkedBottle(index, bottle)) return;
        if (bottle.hasHit) return;
        this.checkBottleEnemyCollisions(index, bottle);
    }

    /**
     * Removes bottle from world when marked for removal.
     *
     * @param {number} index - Index in the related collection.
     * @param {ThowableObject} bottle - Thrown bottle instance.
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    removeMarkedBottle(index, bottle) {
        if (!bottle.isMarkedForRemoval) return false;
        this.removeThrowableObject(index);
        return true;
    }

    /**
     * Checks collisions between one bottle and all enemies.
     *
     * @param {number} bottleIndex - Index of the bottle in the throwable array.
     * @param {ThowableObject} bottle - Thrown bottle instance.
     * @returns {void} - No return value.
     */
    checkBottleEnemyCollisions(bottleIndex, bottle) {
        for (let enemyIndex = this.enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
            const enemy = this.enemies[enemyIndex];
            if (!bottle.isColliding(enemy)) continue;
            this.handleThrowableHit(enemy, enemyIndex, bottle);
            if (!(enemy instanceof Endboss)) this.removeThrowableObject(bottleIndex);
            break;
        }
    }

    /**
     * Handles bottles that hit the ground or leave the valid area.
     *
     * @param {ThowableObject} bottle - Thrown bottle instance.
     * @returns {void} - No return value.
     */
    handleMissedBottle(bottle) {
        if (bottle.hasHit) return;
        if (bottle.y >= 360) {
            bottle.splash();
            return;
        }
        const outOfLevelRight = bottle.x > this.level.level_end_x + 500;
        const outOfScreenBottom = bottle.y > this.canves.height + 300;
        if (outOfLevelRight || outOfScreenBottom) {
            bottle.markForRemoval();
        }
    }

    /**
     * Removes a throwable bottle instance from the world.
     *
     * @param {number} index - Index in the related collection.
     * @returns {void} - No return value.
     */
    removeThrowableObject(index) {
        const bottle = this.throwableObjects[index];
        if (bottle && typeof bottle.stop === 'function') {
            bottle.stop();
        }
        this.throwableObjects.splice(index, 1);
    }

    /**
     * Applies bottle hit logic for normal enemies and endboss.
     *
     * @param {MovableObject} enemy - Enemy instance to process.
     * @param {number} enemyIndex - Index of the enemy in the enemies array.
     * @param {ThowableObject} bottle - Thrown bottle instance.
     * @returns {void} - No return value.
     */
    handleThrowableHit(enemy, enemyIndex, bottle) {
        if (enemy instanceof Endboss) return this.handleEndbossHit(enemy, bottle);
        this.enemies.splice(enemyIndex, 1);
    }

    /**
     * Handles hit effects when a bottle hits the endboss.
     *
     * @param {Endboss} enemy - Enemy instance to process.
     * @param {ThowableObject} bottle - Thrown bottle instance.
     * @returns {void} - No return value.
     */
    handleEndbossHit(enemy, bottle) {
        enemy.hit();
        if (bottle) this.splashBottleOnBoss(enemy, bottle);
        AudioManager.playSfx('bottle-hit', 0.45);
    }

    /**
     * Repositions splash slightly based on impact side and starts splash animation.
     *
     * @param {Endboss} enemy - Enemy instance to process.
     * @param {ThowableObject} bottle - Thrown bottle instance.
     * @returns {void} - No return value.
     */
    splashBottleOnBoss(enemy, bottle) {
        const bossCenter = enemy.x + enemy.width / 2;
        const bottleCenter = bottle.x + bottle.width / 2;
        bottle.x += bottleCenter < bossCenter ? 20 : -20;
        bottle.splash();
    }
}
