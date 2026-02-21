function drawWorldFrame(world) {
    if (world.isStopped) return;
    clearWorldCanvas(world);
    drawScrollableWorld(world);
    drawWorldHud(world);
    world.animationFrameId = requestAnimationFrame(() => world.draw());
}

function clearWorldCanvas(world) {
    world.ctx.clearRect(0, 0, world.canves.width, world.canves.height);
}

function drawScrollableWorld(world) {
    world.ctx.translate(world.camera_x, 0);
    drawWorldObjects(world, world.backgroundObjects);
    drawWorldObject(world, world.character);
    drawWorldObjects(world, world.enemies);
    drawWorldObjects(world, world.clouds);
    drawWorldObjects(world, world.coins);
    drawWorldObjects(world, world.bottles);
    drawWorldObjects(world, world.throwableObjects);
    world.ctx.translate(-world.camera_x, 0);
}

function drawWorldHud(world) {
    drawWorldObject(world, world.statusBar);
    drawWorldObject(world, world.coinStatusBar);
    drawWorldObject(world, world.bottleStatusBar);
}

function drawWorldObjects(world, objects) {
    objects.forEach((object) => drawWorldObject(world, object));
}

function drawWorldObject(world, object) {
    if (object.otherDirection) flipWorldImage(world, object);
    object.draw(world.ctx);
    if (world.showHitboxes) object.drawFrame(world.ctx);
    if (object.otherDirection) restoreWorldImage(world, object);
}

function flipWorldImage(world, object) {
    world.ctx.save();
    world.ctx.translate(object.width, 0);
    world.ctx.scale(-1, 1);
    object.x = object.x * -1;
}

function restoreWorldImage(world, object) {
    object.x = object.x * -1;
    world.ctx.restore();
}
