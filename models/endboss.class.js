class Endboss extends MovableObject {

    height = 350;
    width = 220;   
    y = 100;
    isDead = false;
    hitsTaken = 0;
    maxHits = 5;
    deadStartedAt = 0;
    deadFrameTime = 360;
    hurtFrameTime = 220;
    walkFrameTime = 180;
    walkCyclesBeforeDash = 2;
    walkCycleCount = 0;
    dashDistance = 220;
    dashStep = 2;
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

    constructor(){
        super().loadImage(this.images_Walking[0]);
        this.loadImages(this.images_Walking);
        this.loadImages(this.images_Hurt);
        this.loadImages(this.images_Dead);
        this.x = 1800;
        this.animate();    
    }

    animate(){
        setInterval(() => {
            if (this.world && this.world.isStopped) return;
            if (this.isDead) return;
            if (this.isPlayingHurtAnimation) return;
            this.playAnimation(this.images_Walking);
            if (!this.isDashing) this.handleWalkCycle();
        }, this.walkFrameTime);
    }

    handleWalkCycle() {
        if (!this.images_Walking.length) return;
        if (this.CurrentImage % this.images_Walking.length !== 0) return;
        this.walkCycleCount += 1;
        if (this.walkCycleCount < this.walkCyclesBeforeDash) return;
        this.walkCycleCount = 0;
        this.startDashSequence();
    }

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

    moveToX(targetX, onComplete) {
        this.stopDashMovement();
        this.dashInterval = setInterval(
            () => this.updateDashPosition(targetX, onComplete),
            this.dashIntervalTime
        );
    }

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

    shouldSkipDashUpdate() {
        if (this.isDead) {
            this.stopDashMovement();
            return true;
        }
        return this.world && this.world.isStopped;
    }

    getDashDirection(targetX) {
        return targetX > this.x ? 1 : -1;
    }

    getNextDashX(direction) {
        return this.x + direction * this.dashStep;
    }

    hasReachedDashTarget(targetX, nextX, direction) {
        return direction > 0 ? nextX >= targetX : nextX <= targetX;
    }

    finishDashMove(targetX, onComplete) {
        this.x = targetX;
        this.stopDashMovement();
        if (onComplete) onComplete();
    }

    resetWalkAnimation() {
        this.CurrentImage = 0;
        this.setCurrentImage(this.images_Walking[0]);
    }

    die() {
        if (this.isDead) return;
        this.stopHurtAnimation();
        this.stopDashMovement();
        this.isDashing = false;
        this.isDead = true;
        this.deadStartedAt = Date.now();
        this.playDeadAnimation();
    }

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

    getDeadAnimationDuration() {
        return this.images_Dead.length * this.deadFrameTime;
    }

    hit() {
        if (this.isDead) return;
        this.hitsTaken += 1;
        if (this.hitsTaken >= this.maxHits) {
            this.die();
            return;
        }
        this.playHurtAnimationOnce();
    }

    playHurtAnimationOnce() {
        if (!this.images_Hurt.length) return;
        this.stopHurtAnimation();
        this.isPlayingHurtAnimation = true;
        this.setCurrentImage(this.images_Hurt[0]);
        this.startHurtAnimationLoop(1);
    }

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

    shouldStopHurtAnimation(frame) {
        return this.isDead || frame >= this.images_Hurt.length;
    }

    setCurrentImage(path) {
        this.path = path;
        this.img = this.imageCache[path];
    }

    stopHurtAnimation() {
        if (this.hurtAnimationInterval) {
            clearInterval(this.hurtAnimationInterval);
            this.hurtAnimationInterval = null;
        }
        this.isPlayingHurtAnimation = false;
    }

    stopDashMovement() {
        if (this.dashInterval) {
            clearInterval(this.dashInterval);
            this.dashInterval = null;
        }
    }

}
