class Endboss extends BaseEndboss {

    height = 350;
    width = 220;   
    y = 100;
    isDead = false;
    hitsTaken = 0;
    maxHits = 6;
    deadStartedAt = 0;
    deadFrameTime = 360;
    hurtFrameTime = 180;
    walkFrameTime = 165;
    walkCyclesBeforeDash = 2;
    walkCycleCount = 0;
    dashDistance = 250;
    dashStep = 2.4;
    dashIntervalTime = 1000 / 60;
    hurtAnimationInterval = null;
    dashInterval = null;
    isPlayingHurtAnimation = false;
    isDashing = false;

    images_Walking = [
        'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G13.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G14.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G15.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G16.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G17.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G18.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G19.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G20.png',
    ];
    images_Hurt = [
        'img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];
    images_Dead = [
        'img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G24.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G25.png',
        'img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /**
     * Creates an instance of Endboss.
     */
    constructor(){
        super().loadImage(this.images_Walking[0]);
        this.loadImages(this.images_Walking);
        this.loadImages(this.images_Hurt);
        this.loadImages(this.images_Dead);
        this.x = 1800;
        this.animate();    
    }

    /**
     * Runs walk animation and dash trigger logic.
     * @returns {void} - No return value.
     */
    animate(){
        setInterval(() => {
            if (this.world && this.world.isStopped) return;
            if (this.isDead) return;
            if (this.isPlayingHurtAnimation) return;
            this.playAnimation(this.images_Walking);
            if (!this.isDashing) this.handleWalkCycle();
        }, this.walkFrameTime);
    }

    /**
     * Counts completed walk cycles and triggers a dash sequence.
     * @returns {void} - No return value.
     */
    handleWalkCycle() {
        if (!this.images_Walking.length) return;
        if (this.CurrentImage % this.images_Walking.length !== 0) return;
        this.walkCycleCount += 1;
        if (this.walkCycleCount < this.walkCyclesBeforeDash) return;
        this.walkCycleCount = 0;
        this.startDashSequence();
    }

    /**
     * Starts dash sequence.
     * @returns {void} - No return value.
     */
    startDashSequence() {
        if (this.isDashing || this.isDead) return;
        this.isDashing = true;
        const startX = this.x;
        const forwardX = startX - this.dashDistance;
        this.moveToX(forwardX, () => {
            this.moveToX(startX, () => {
                this.isDashing = false;
                this.resetWalkAnimation();
            });
        });
    }

    /**
     * Moves to x.
     *
     * @param {number} targetX - Target x-coordinate in pixels.
     * @param {Function} onComplete - Callback fired when movement is finished.
     * @returns {void} - No return value.
     */
    moveToX(targetX, onComplete) {
        this.stopDashMovement();
        this.dashInterval = setInterval(
            () => this.updateDashPosition(targetX, onComplete),
            this.dashIntervalTime
        );
    }

    /**
     * Updates dash position.
     *
     * @param {number} targetX - Target x-coordinate in pixels.
     * @param {Function} onComplete - Callback fired when movement is finished.
     * @returns {void} - No return value.
     */
    updateDashPosition(targetX, onComplete) {
        if (this.shouldSkipDashUpdate()) return;
        const direction = this.getDashDirection(targetX);
        const nextX = this.getNextDashX(direction);
        if (this.hasReachedDashTarget(targetX, nextX, direction)) {
            this.finishDashMove(targetX, onComplete);
            return;
        }
        this.x = nextX;
    }

    /**
     * Determines whether skip dash update should run.
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    shouldSkipDashUpdate() {
        if (this.isDead) {
            this.stopDashMovement();
            return true;
        }
        return this.world && this.world.isStopped;
    }

    /**
     * Returns dash direction.
     *
     * @param {number} targetX - Target x-coordinate in pixels.
     * @returns {number} - Movement direction (`-1` for left, `1` for right).
     */
    getDashDirection(targetX) {
        return targetX > this.x ? 1 : -1;
    }

    /**
     * Returns next dash x.
     *
     * @param {number} direction - Movement direction (`-1` or `1`).
     * @returns {number} - Next x-position for the current dash step.
     */
    getNextDashX(direction) {
        return this.x + direction * this.dashStep;
    }

    /**
     * Checks whether reached dash target exists.
     *
     * @param {number} targetX - Target x-coordinate in pixels.
     * @param {number} nextX - Next x-coordinate candidate.
     * @param {number} direction - Movement direction (`-1` or `1`).
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    hasReachedDashTarget(targetX, nextX, direction) {
        return direction > 0 ? nextX >= targetX : nextX <= targetX;
    }

    /**
     * Handles finish dash move.
     *
     * @param {number} targetX - Target x-coordinate in pixels.
     * @param {Function} onComplete - Callback fired when movement is finished.
     * @returns {void} - No return value.
     */
    finishDashMove(targetX, onComplete) {
        this.x = targetX;
        this.stopDashMovement();
        if (onComplete) onComplete();
    }

    /**
     * Resets walk animation.
     * @returns {void} - No return value.
     */
    resetWalkAnimation() {
        this.CurrentImage = 0;
        this.setCurrentImage(this.images_Walking[0]);
    }

    /**
     * Switches the endboss to death state and starts death animation.
     * @returns {void} - No return value.
     */
    die() {
        if (this.isDead) return;
        this.stopHurtAnimation();
        this.stopDashMovement();
        this.isDashing = false;
        this.isDead = true;
        this.deadStartedAt = Date.now();
        this.playDeadAnimation();
    }

    /**
     * Plays dead animation.
     * @returns {void} - No return value.
     */
    playDeadAnimation() {
        let frame = 0;
        const interval = setInterval(() => {
            if (frame >= this.images_Dead.length) {
                clearInterval(interval);
                return;
            }
            this.path = this.images_Dead[frame];
            this.img = this.imageCache[this.path];
            frame += 1;
        }, this.deadFrameTime);
    }

    /**
     * Returns dead animation duration.
     * @returns {number} - Total dead animation duration in milliseconds.
     */
    getDeadAnimationDuration() {
        return this.images_Dead.length * this.deadFrameTime;
    }

    /**
     * Applies damage and triggers hurt or death behavior.
     * @returns {void} - No return value.
     */
    hit() {
        if (this.isDead) return;
        this.hitsTaken += 1;
        if (this.hitsTaken >= this.maxHits) {
            this.die();
            return;
        }
        this.playHurtAnimationOnce();
    }

    /**
     * Plays hurt animation once.
     * @returns {void} - No return value.
     */
    playHurtAnimationOnce() {
        if (!this.images_Hurt.length) return;
        this.stopHurtAnimation();
        this.isPlayingHurtAnimation = true;
        this.setCurrentImage(this.images_Hurt[0]);
        this.startHurtAnimationLoop(1);
    }

    /**
     * Starts hurt animation loop.
     *
     * @param {number} startFrame - First frame index to start from.
     * @returns {void} - No return value.
     */
    startHurtAnimationLoop(startFrame) {
        let frame = startFrame;
        this.hurtAnimationInterval = setInterval(() => {
            if (this.shouldStopHurtAnimation(frame)) {
                this.stopHurtAnimation();
                return;
            }
            this.setCurrentImage(this.images_Hurt[frame]);
            frame += 1;
        }, this.hurtFrameTime);
    }

    /**
     * Determines whether stop hurt animation should run.
     *
     * @param {number} frame - Current animation frame index.
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    shouldStopHurtAnimation(frame) {
        return this.isDead || frame >= this.images_Hurt.length;
    }

    /**
     * Sets current image.
     *
     * @param {string} path - Image path to load from cache.
     * @returns {void} - No return value.
     */
    setCurrentImage(path) {
        this.path = path;
        this.img = this.imageCache[path];
    }

    /**
     * Stops hurt animation.
     * @returns {void} - No return value.
     */
    stopHurtAnimation() {
        if (this.hurtAnimationInterval) {
            clearInterval(this.hurtAnimationInterval);
            this.hurtAnimationInterval = null;
        }
        this.isPlayingHurtAnimation = false;
    }

    /**
     * Stops dash movement.
     * @returns {void} - No return value.
     */
    stopDashMovement() {
        if (this.dashInterval) {
            clearInterval(this.dashInterval);
            this.dashInterval = null;
        }
    }

}
