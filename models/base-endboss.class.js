class BaseEndboss extends MovableObject {
    /**
     * Checks whether a support chicken should be spawned at this moment.
     *
     * @param {number} lastSpawnAt - Timestamp of the last spawn.
     * @param {number} intervalMs - Minimum spawn interval in milliseconds.
     * @returns {boolean} - True if a new spawn is allowed; otherwise false.
     */
    shouldSpawnSupportChicken(lastSpawnAt, intervalMs) {
        if (this.isDead) return false;
        return Date.now() - lastSpawnAt >= intervalMs;
    }

    /**
     * Creates and launches one support chicken as a boss attack.
     *
     * @param {WorldCore} world - World instance used for references.
     * @returns {BaseChicken} - Spawned chicken instance.
     */
    createSupportChicken(world) {
        const chicken = Math.random() < 0.5 ? new SmallChicken() : new Chicken();
        chicken.world = world;
        chicken.launchFromEndboss(
            this.getChickenLaunchX(),
            this.getChickenLaunchY(),
            this.getGroundChickenY(chicken)
        );
        return chicken;
    }

    /**
     * Returns launch x-position for support chickens.
     *
     * @returns {number} - Launch x-position.
     */
    getChickenLaunchX() {
        return this.x + this.width * 0.35;
    }

    /**
     * Returns launch y-position for support chickens.
     *
     * @returns {number} - Launch y-position.
     */
    getChickenLaunchY() {
        return this.y + this.height * 0.4;
    }

    /**
     * Returns ground y-position for spawned support chickens.
     *
     * @param {BaseChicken} chicken - Chicken instance.
     * @returns {number} - Ground y-position.
     */
    getGroundChickenY(chicken) {
        if (chicken instanceof SmallChicken) return 370;
        return 370;
    }

    /**
     * Checks whether Pepe has entered the fight zone near the endboss.
     *
     * @param {Character} character - Pepe instance.
     * @returns {boolean} - True if Pepe is close enough; otherwise false.
     */
    hasCharacterReachedFightZone(character) {
        return character.x >= this.x - 280;
    }

    /**
     * Spawns refill bottles across level frames around the boss encounter.
     *
     * @param {WorldCore} world - World instance used for references.
     * @returns {void} - No return value.
     */
    spawnRefillBottles(world) {
        const positions = this.getRefillBottlePositions(world);
        positions.forEach((x) => {
            if (this.hasBottleNearX(world, x, 130)) return;
            const bottle = new Bottle(x, 360);
            bottle.world = world;
            world.bottles.push(bottle);
        });
    }

    /**
     * Returns refill bottle x-positions distributed across level frames.
     *
     * @param {WorldCore} world - World instance used for references.
     * @returns {Array<number>} - Target x-positions.
     */
    getRefillBottlePositions(world) {
        const frameWidth = world.canves?.width || 720;
        const levelEndX = world.level?.level_end_x || this.x;
        const frameCount = Math.max(1, Math.ceil(levelEndX / frameWidth));
        const positions = [];
        for (let frame = 0; frame < frameCount; frame++) {
            const frameCenter = frame * frameWidth + frameWidth * 0.5;
            const x = Math.min(levelEndX - 120, Math.max(120, frameCenter));
            positions.push(x);
        }
        const bossFrameX = Math.max(120, Math.min(levelEndX - 120, this.x - 220));
        positions.push(bossFrameX);
        return positions;
    }

    /**
     * Checks if a bottle already exists near a target x-position.
     *
     * @param {WorldCore} world - World instance used for references.
     * @param {number} targetX - Target x-position.
     * @param {number} minDistance - Minimum distance threshold.
     * @returns {boolean} - True if a nearby bottle exists; otherwise false.
     */
    hasBottleNearX(world, targetX, minDistance) {
        return world.bottles.some((bottle) => Math.abs(bottle.x - targetX) < minDistance);
    }

    /**
     * Applies bottle hit effects to endboss and splash positioning.
     *
     * @param {ThowableObject} bottle - Thrown bottle instance.
     * @returns {void} - No return value.
     */
    handleBottleHit(bottle) {
        this.hit();
        if (bottle) this.splashBottleOnHitSide(bottle);
    }

    /**
     * Repositions splash slightly based on impact side and starts splash animation.
     *
     * @param {ThowableObject} bottle - Thrown bottle instance.
     * @returns {void} - No return value.
     */
    splashBottleOnHitSide(bottle) {
        const bossCenter = this.x + this.width / 2;
        const bottleCenter = bottle.x + bottle.width / 2;
        bottle.x += bottleCenter < bossCenter ? 20 : -20;
        bottle.splash();
    }
}
