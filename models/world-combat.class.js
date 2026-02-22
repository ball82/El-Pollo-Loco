class WorldCombat extends WorldCore {
    
    checkThrowObjects() {
        if (!this.keyboard.D) return;
        if (!this.canThrowBottle()) return;
        const bottle = new ThowableObject(this.character.x + 100, this.character.y + 100);
        bottle.world = this;
        this.throwableObjects.push(bottle);
        this.consumeBottle();
        AudioManager.playSfx('bottle-throw', 0.35);
    }

    canThrowBottle() {
        const timepassed = new Date().getTime() - this.lastThrow;
        return this.character.bottles >= 20 && timepassed > 400;
    }

    consumeBottle() {
        this.lastThrow = new Date().getTime();
        this.character.bottles = Math.max(0, this.character.bottles - 20);
        this.bottleStatusBar.setPercentage(this.character.bottles);
    }

    checkCollisions() {
        if (this.character.isDead()) return;
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.processEnemyCollision(this.enemies[i], i);
        }
    }

    processEnemyCollision(enemy, index) {
        if (enemy.isDead) return;
        if (!this.isCharacterEnemyColliding(enemy)) return;
        if (this.isStompingEnemy(enemy)) {
            this.handleStomp(enemy, index);
            return;
        }
        this.handleCharacterHit();
    }

    isStompingEnemy(enemy) {
        const characterBottom = this.character.y + this.character.height;
        const enemyTop = enemy.y;
        return (
            this.character.speedY < 0 &&
            this.character.y < enemy.y &&
            characterBottom <= enemyTop + 40
        );
    }

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

    boxesOverlap(a, b) {
        return (
            a.right > b.left &&
            a.bottom > b.top &&
            a.left < b.right &&
            a.top < b.bottom
        );
    }

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

    killChicken(enemy) {
        enemy.die();
        setTimeout(() => {
            const index = this.enemies.indexOf(enemy);
            if (index !== -1) this.enemies.splice(index, 1);
        }, 2000);
    }

    handleCharacterHit() {
        const wasHurt = this.character.isHurt();
        if (wasHurt) return;
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
        if (!wasHurt) {
            AudioManager.playSfx('pepe-hurt', 0.4);
        }
    }

    checkThrowableHits() {
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            this.processThrowableObject(i);
        }
    }

    checkEndbossSpawn() {
        const endboss = this.getEndboss();
        if (!endboss || endboss.isDead) return;
        const now = Date.now();
        if (now - this.lastEndbossSpawn < this.endbossSpawnInterval) return;
        this.spawnChickenFromEndboss(endboss);
        this.lastEndbossSpawn = now;
    }

    spawnChickenFromEndboss(endboss) {
        const chicken = Math.random() < 0.5 ? new SmallChicken() : new Chicken();
        chicken.x = endboss.x + 30 + Math.random() * 110;
        chicken.y = this.getGroundChickenY(chicken);
        chicken.world = this;
        this.enemies.push(chicken);
    }

    getGroundChickenY(chicken) {
        if (chicken instanceof SmallChicken) return 400;
        return 370;
    }

    processThrowableObject(index) {
        const bottle = this.throwableObjects[index];
        this.handleMissedBottle(bottle);
        if (this.removeMarkedBottle(index, bottle)) return;
        if (bottle.hasHit) return;
        this.checkBottleEnemyCollisions(index, bottle);
    }

    removeMarkedBottle(index, bottle) {
        if (!bottle.isMarkedForRemoval) return false;
        this.removeThrowableObject(index);
        return true;
    }

    checkBottleEnemyCollisions(bottleIndex, bottle) {
        for (let enemyIndex = this.enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
            const enemy = this.enemies[enemyIndex];
            if (!bottle.isColliding(enemy)) continue;
            this.handleThrowableHit(enemy, enemyIndex, bottle);
            if (!(enemy instanceof Endboss)) this.removeThrowableObject(bottleIndex);
            break;
        }
    }

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

    removeThrowableObject(index) {
        const bottle = this.throwableObjects[index];
        if (bottle && typeof bottle.stop === 'function') {
            bottle.stop();
        }
        this.throwableObjects.splice(index, 1);
    }

    handleThrowableHit(enemy, enemyIndex, bottle) {
        if (enemy instanceof Endboss) return this.handleEndbossHit(enemy, bottle);
        this.enemies.splice(enemyIndex, 1);
    }

    handleEndbossHit(enemy, bottle) {
        enemy.hit();
        if (bottle) this.splashBottleOnBoss(enemy, bottle);
        AudioManager.playSfx('bottle-hit', 0.45);
    }

    splashBottleOnBoss(enemy, bottle) {
        const bossCenter = enemy.x + enemy.width / 2;
        const bottleCenter = bottle.x + bottle.width / 2;
        bottle.x += bottleCenter < bossCenter ? 20 : -20;
        bottle.splash();
    }
}
