class WorldRenderer {
    /**
     * Draws frame.
     *
     * @param {World} world - Current world instance.
     * @returns {void} - No return value.
     */
    static drawFrame(world) {
        if (world.isStopped) return;
        this.clearCanvas(world);
        this.drawScrollableWorld(world);
        this.drawHud(world);
        this.drawCharacterForeground(world);
        world.animationFrameId = requestAnimationFrame(() => world.draw());
    }

    /**
     * Handles clear canvas.
     *
     * @param {World} world - Current world instance.
     * @returns {void} - No return value.
     */
    static clearCanvas(world) {
        world.ctx.clearRect(0, 0, world.canves.width, world.canves.height);
    }

    /**
     * Draws scrollable world.
     *
     * @param {World} world - Current world instance.
     * @returns {void} - No return value.
     */
    static drawScrollableWorld(world) {
        world.ctx.translate(world.camera_x, 0);
        this.drawObjects(world, world.backgroundObjects);
        this.drawObjects(world, world.enemies);
        this.drawObjects(world, world.clouds);
        this.drawObjects(world, world.coins);
        this.drawObjects(world, world.bottles);
        this.drawObjects(world, world.throwableObjects);
        world.ctx.translate(-world.camera_x, 0);
    }

    /**
     * Draws hud.
     *
     * @param {World} world - Current world instance.
     * @returns {void} - No return value.
     */
    static drawHud(world) {
        this.drawObject(world, world.statusBar);
        this.drawObject(world, world.coinStatusBar);
        this.drawObject(world, world.bottleStatusBar);
    }

    /**
     * Draws character foreground.
     *
     * @param {World} world - Current world instance.
     * @returns {void} - No return value.
     */
    static drawCharacterForeground(world) {
        world.ctx.translate(world.camera_x, 0);
        this.drawObject(world, world.character);
        world.ctx.translate(-world.camera_x, 0);
    }

    /**
     * Draws objects.
     *
     * @param {World} world - Current world instance.
     * @param {Array<*>} objects - Collection of world objects.
     * @returns {void} - No return value.
     */
    static drawObjects(world, objects) {
        objects.forEach((object) => this.drawObject(world, object));
    }

    /**
     * Draws object.
     *
     * @param {World} world - Current world instance.
     * @param {MovableObject | DrawableObject} object - World object to process.
     * @returns {void} - No return value.
     */
    static drawObject(world, object) {
        if (object.otherDirection) this.flipImage(world, object);
        object.draw(world.ctx);
        if (world.showHitboxes) object.drawFrame(world.ctx);
        if (object.otherDirection) this.restoreImage(world, object);
    }

    /**
     * Handles flip image.
     *
     * @param {World} world - Current world instance.
     * @param {MovableObject | DrawableObject} object - World object to process.
     * @returns {void} - No return value.
     */
    static flipImage(world, object) {
        world.ctx.save();
        world.ctx.translate(object.width, 0);
        world.ctx.scale(-1, 1);
        object.x = object.x * -1;
    }

    /**
     * Handles restore image.
     *
     * @param {World} world - Current world instance.
     * @param {MovableObject | DrawableObject} object - World object to process.
     * @returns {void} - No return value.
     */
    static restoreImage(world, object) {
        object.x = object.x * -1;
        world.ctx.restore();
    }
}
