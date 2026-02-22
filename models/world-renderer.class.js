class WorldRenderer {
    static drawFrame(world) {
        if (world.isStopped) return;
        this.clearCanvas(world);
        this.drawScrollableWorld(world);
        this.drawHud(world);
        world.animationFrameId = requestAnimationFrame(() => world.draw());
    }

    static clearCanvas(world) {
        world.ctx.clearRect(0, 0, world.canves.width, world.canves.height);
    }

    static drawScrollableWorld(world) {
        world.ctx.translate(world.camera_x, 0);
        this.drawObjects(world, world.backgroundObjects);
        this.drawObject(world, world.character);
        this.drawObjects(world, world.enemies);
        this.drawObjects(world, world.clouds);
        this.drawObjects(world, world.coins);
        this.drawObjects(world, world.bottles);
        this.drawObjects(world, world.throwableObjects);
        world.ctx.translate(-world.camera_x, 0);
    }

    static drawHud(world) {
        this.drawObject(world, world.statusBar);
        this.drawObject(world, world.coinStatusBar);
        this.drawObject(world, world.bottleStatusBar);
    }

    static drawObjects(world, objects) {
        objects.forEach((object) => this.drawObject(world, object));
    }

    static drawObject(world, object) {
        if (object.otherDirection) this.flipImage(world, object);
        object.draw(world.ctx);
        if (world.showHitboxes) object.drawFrame(world.ctx);
        if (object.otherDirection) this.restoreImage(world, object);
    }

    static flipImage(world, object) {
        world.ctx.save();
        world.ctx.translate(object.width, 0);
        world.ctx.scale(-1, 1);
        object.x = object.x * -1;
    }

    static restoreImage(world, object) {
        object.x = object.x * -1;
        world.ctx.restore();
    }
}
