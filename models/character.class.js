class Character extends MovableObject{   

    height = 280;
    y = 80;
    speed = 8;
    hitDamage = 20;
    groundLevel = 160;
    jumpAnimationInterval = 180;
    lastJumpAnimationUpdate = 0;
    jumpFrame = 0;
    wasInAir = false;
    idleAnimationInterval = 180;
    lastIdleAnimationUpdate = 0;
    width = 150;
    coins = 0;
    bottles = 0;

    images_Walking   = [
        'img_pollo_locco/img/2_character_pepe/2_walk/W-21.png',
        'img_pollo_locco/img/2_character_pepe/2_walk/W-22.png',
        'img_pollo_locco/img/2_character_pepe/2_walk/W-23.png',
        'img_pollo_locco/img/2_character_pepe/2_walk/W-24.png',
        'img_pollo_locco/img/2_character_pepe/2_walk/W-25.png',
        'img_pollo_locco/img/2_character_pepe/2_walk/W-26.png' 
    ];

    images_Jupping = [
        'img_pollo_locco/img/2_character_pepe/3_jump/J-31.png',
        'img_pollo_locco/img/2_character_pepe/3_jump/J-32.png',
        'img_pollo_locco/img/2_character_pepe/3_jump/J-33.png',
        'img_pollo_locco/img/2_character_pepe/3_jump/J-34.png',
        'img_pollo_locco/img/2_character_pepe/3_jump/J-35.png',
        'img_pollo_locco/img/2_character_pepe/3_jump/J-36.png',
        'img_pollo_locco/img/2_character_pepe/3_jump/J-37.png',
        'img_pollo_locco/img/2_character_pepe/3_jump/J-38.png',
        'img_pollo_locco/img/2_character_pepe/3_jump/J-39.png'      
    ];

    images_Idle = [
        'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png',
        'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-2.png',
        'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-3.png',
        'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-4.png',
        'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-5.png',
        'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-6.png',
        'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-7.png',
        'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-8.png',
        'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-9.png',
        'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    images_Sleep = [
        'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    images_Dead = [
        'img_pollo_locco/img/2_character_pepe/5_dead/D-51.png',
        'img_pollo_locco/img/2_character_pepe/5_dead/D-52.png',
        'img_pollo_locco/img/2_character_pepe/5_dead/D-53.png',
        'img_pollo_locco/img/2_character_pepe/5_dead/D-54.png',
        'img_pollo_locco/img/2_character_pepe/5_dead/D-55.png',
        'img_pollo_locco/img/2_character_pepe/5_dead/D-56.png',
        'img_pollo_locco/img/2_character_pepe/5_dead/D-57.png'
    ];
    images_Hurt = [
        'img_pollo_locco/img/2_character_pepe/4_hurt/H-41.png',
        'img_pollo_locco/img/2_character_pepe/4_hurt/H-42.png',
        'img_pollo_locco/img/2_character_pepe/4_hurt/H-43.png'
    ];

    

    world;
    lastAction = new Date().getTime();

    /**
     * Creates an instance of Character.
     */
    constructor(){
        super().loadImage('img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.images_Walking);
        this.loadImages(this.images_Jupping);
        this.loadImages(this.images_Idle);
        this.loadImages(this.images_Sleep);
        this.loadImages(this.images_Dead);
        this.loadImages(this.images_Hurt);
        this.applyGravity();
        this.animate();
    }
    

    /**
     * Starts character movement and animation loops.
     * @returns {void} - No return value.
     */
    animate(){
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    /**
     * Starts movement loop.
     * @returns {void} - No return value.
     */
    startMovementLoop(){
        setInterval(() => this.updateMovement(), 1000 / 60);
    }

    /**
     * Updates movement.
     * @returns {void} - No return value.
     */
    updateMovement(){
        if (this.shouldPauseMovement()) return;
        this.handleHorizontalMovement();
        this.handleJumpInput();
        this.world.camera_x = this.getClampedCameraX();
    }

    /**
     * Returns clamped camera x.
     * @returns {number} - Camera x-position clamped to level boundaries.
     */
    getClampedCameraX() {
        const desiredCameraX = -this.x + 80;
        const minCameraX = this.getMinCameraX();
        return Math.min(0, Math.max(minCameraX, desiredCameraX));
    }

    /**
     * Returns min camera x.
     * @returns {number} - Left-most camera x-position allowed by the background width.
     */
    getMinCameraX() {
        const rightEdge = this.getBackgroundRightEdge();
        const canvasWidth = this.world?.canves?.width || 720;
        return Math.min(0, -(rightEdge - canvasWidth));
    }

    /**
     * Returns background right edge.
     * @returns {number} - Rightmost x-position of all background objects.
     */
    getBackgroundRightEdge() {
        const backgrounds = this.world?.backgroundObjects || [];
        if (!backgrounds.length) return 720;
        return Math.max(...backgrounds.map((object) => object.x + object.width));
    }

    /**
     * Determines whether pause movement should run.
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    shouldPauseMovement(){
        return (this.world && this.world.isStopped) || this.isDead();
    }

    /**
     * Processes horizontal input and movement direction.
     * @returns {void} - No return value.
     */
    handleHorizontalMovement(){
        if (this.canMoveRight()) this.moveRightWithDirection(false);
        if (this.canMoveLeft()) this.moveRightWithDirection(true);
    }

    /**
     * Checks whether move right is possible.
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    canMoveRight(){
        return this.world.keyboard.right && this.x < this.world.level.level_end_x;
    }

    /**
     * Checks whether move left is possible.
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    canMoveLeft(){
        return this.world.keyboard.left && this.x > 0;
    }

    /**
     * Moves right with direction.
     *
     * @param {boolean} otherDirection - Whether the character should move left (`true`) or right (`false`).
     * @returns {void} - No return value.
     */
    moveRightWithDirection(otherDirection){
        if (otherDirection) {
            this.moveLeft();
        } else {
            this.moveRight();
        }
        this.otherDirection = otherDirection;
        this.registerAction();
    }

    /**
     * Triggers jump when jump input is active.
     * @returns {void} - No return value.
     */
    handleJumpInput(){
        if (!this.world.keyboard.space) return;
        this.jump();
        this.registerAction();
    }

    /**
     * Starts animation loop.
     * @returns {void} - No return value.
     */
    startAnimationLoop(){
        setInterval(() => this.updateAnimationState(), 70);
    }

    /**
     * Updates animation state.
     * @returns {void} - No return value.
     */
    updateAnimationState(){
        if (this.world && this.world.isStopped) return;
        if (this.playDeathAnimation()) return;
        if (this.playHurtAnimation()) return;
        if (this.playJumpAnimation()) return;
        this.playGroundAnimation();
    }

    /**
     * Plays death animation.
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    playDeathAnimation(){
        if (!this.isDead()) return false;
        this.playAnimation(this.images_Dead);
        return true;
    }

    /**
     * Plays hurt animation.
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    playHurtAnimation(){
        if (!this.isHurt()) return false;
        this.playAnimation(this.images_Hurt);
        this.registerAction();
        return true;
    }

    /**
     * Plays jump animation.
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    playJumpAnimation(){
        if (!this.isAboveGround()) {
            this.wasInAir = false;
            return false;
        }
        if (!this.wasInAir) {
            this.jumpFrame = 0;
            this.wasInAir = true;
        }
        this.tickJumpFrame();
        return true;
    }

    tickJumpFrame(){
        const now = Date.now();
        if (now - this.lastJumpAnimationUpdate < this.jumpAnimationInterval) return;
        this.lastJumpAnimationUpdate = now;
        this.showJumpFrame();
        if (this.jumpFrame < this.images_Jupping.length - 1) this.jumpFrame++;
    }

    showJumpFrame(){
        const frame = Math.min(this.jumpFrame, this.images_Jupping.length - 1);
        this.path = this.images_Jupping[frame];
        this.img = this.imageCache[this.path];
    }

    resetJumpAnimation(){
        this.jumpFrame = 0;
        this.wasInAir = false;
    }

    /**
     * Plays ground animation.
     * @returns {void} - No return value.
     */
    playGroundAnimation(){
        if (this.isWalking()) {
            this.playAnimation(this.images_Walking);
            return;
        }
        const now = Date.now();
        if (now - this.lastIdleAnimationUpdate < this.idleAnimationInterval) return;
        this.lastIdleAnimationUpdate = now;
        this.playAnimation(this.isSleeping() ? this.images_Sleep : this.images_Idle);
    }

    /**
     * Checks whether walking is true.
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    isWalking(){
        return this.world.keyboard.right || this.world.keyboard.left;
    }

    /**
     * Applies jump impulse if the character is grounded.
     * @returns {void} - No return value.
     */
    jump() {
        if (this.isDead()) return;
        if (!this.isAboveGround()) {
            this.speedY = 12;
            AudioManager.playSfx("pepe-jump", 0.35);
        }
    } 

    /**
     * Stores the timestamp of the last player action.
     * @returns {void} - No return value.
     */
    registerAction(){
        this.lastAction = new Date().getTime();
    }

    /**
     * Checks whether sleeping is true.
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    isSleeping(){
        let timepassed = new Date().getTime() - this.lastAction;
        return timepassed > 10000;
    }

    /**
     * Reduces character energy when taking damage.
     * @returns {void} - No return value.
     */
    hit() {
        this.energy -= this.hitDamage;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

}
