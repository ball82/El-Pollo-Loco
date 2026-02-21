class Character extends MovableObject{   

    height = 280;
    y = 80;
    speed = 17;
    hitDamage = 20;
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
    

    animate(){
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    startMovementLoop(){
        setInterval(() => this.updateMovement(), 1000 / 60);
    }

    updateMovement(){
        if (this.shouldPauseMovement()) return;
        this.handleHorizontalMovement();
        this.handleJumpInput();
        this.world.camera_x = -this.x + 80;
    }

    shouldPauseMovement(){
        return (this.world && this.world.isStopped) || this.isDead();
    }

    handleHorizontalMovement(){
        if (this.canMoveRight()) this.moveRightWithDirection(false);
        if (this.canMoveLeft()) this.moveRightWithDirection(true);
    }

    canMoveRight(){
        return this.world.keyboard.right && this.x < this.world.level.level_end_x;
    }

    canMoveLeft(){
        return this.world.keyboard.left && this.x > 0;
    }

    moveRightWithDirection(otherDirection){
        if (otherDirection) {
            this.moveLeft();
        } else {
            this.moveRight();
        }
        this.otherDirection = otherDirection;
        this.registerAction();
    }

    handleJumpInput(){
        if (!this.world.keyboard.space) return;
        this.jump();
        this.registerAction();
    }

    startAnimationLoop(){
        setInterval(() => this.updateAnimationState(), 35);
    }

    updateAnimationState(){
        if (this.world && this.world.isStopped) return;
        if (this.playDeathAnimation()) return;
        if (this.playHurtAnimation()) return;
        if (this.playJumpAnimation()) return;
        this.playGroundAnimation();
    }

    playDeathAnimation(){
        if (!this.isDead()) return false;
        this.playAnimation(this.images_Dead);
        return true;
    }

    playHurtAnimation(){
        if (!this.isHurt()) return false;
        this.playAnimation(this.images_Hurt);
        this.registerAction();
        return true;
    }

    playJumpAnimation(){
        if (!this.isAboveGround()) return false;
        this.playAnimation(this.images_Jupping);
        return true;
    }

    playGroundAnimation(){
        if (this.isWalking()) {
            this.playAnimation(this.images_Walking);
            return;
        }
        this.playAnimation(this.isSleeping() ? this.images_Sleep : this.images_Idle);
    }

    isWalking(){
        return this.world.keyboard.right || this.world.keyboard.left;
    }

    jump() {
        if (this.isDead()) return;
        if (!this.isAboveGround()) {
            this.speedY = 15;
            if (typeof playSfx === "function") {
                playSfx("pepe-jump", 0.35);
            }
        }
    } 

    registerAction(){
        this.lastAction = new Date().getTime();
    }

    isSleeping(){
        let timepassed = new Date().getTime() - this.lastAction;
        return timepassed > 15000;
    }

    hit() {
        this.energy -= this.hitDamage;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

}
