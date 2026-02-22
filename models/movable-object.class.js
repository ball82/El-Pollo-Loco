class MovableObject extends DrawableObject {
  speed = 0.25;
  otherDirection  = false;
  speedY = 0;
  acceleration = 0.42;
  energy = 100;
  lastHit = 0;
  

  /**
   * Applies gravity to vertical movement.
   * @returns {void} - No return value.
   */
  applyGravity() {
    this.stopGravity();
    this.gravityInterval = setInterval(() => {
      if (this.world && this.world.isStopped) return;
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;  
        this.speedY -= this.acceleration;
      }
    }, 1000 / 60);
  }

  /**
   * Stops gravity.
   * @returns {void} - No return value.
   */
  stopGravity() {
    if (!this.gravityInterval) return;
    clearInterval(this.gravityInterval);
    this.gravityInterval = null;
  }

  /**
   * Checks whether above ground is true.
   * @returns {boolean} - True if the condition is met; otherwise false.
   */
  isAboveGround() {
    if (this instanceof ThowableObject) {
      return true;
    } else {
      return this.y < 150;
    }
  }



  /**
   * Checks whether colliding is true.
   *
   * @param {MovableObject} mo - Other movable object to test collision against.
   * @returns {boolean} - True if the condition is met; otherwise false.
   */
  isColliding(mo){
    return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x + mo.width &&
            this.y < mo.y + mo.height;
  }
  /**
   * Reduces energy after receiving damage.
   * @returns {void} - No return value.
   */
  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    } 
  }  

  /**
   * Checks whether hurt is true.
   * @returns {boolean} - True if the condition is met; otherwise false.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; 
    timepassed = timepassed / 1000; 
    return timepassed < 1.2; 
   }


  /**
   * Checks whether dead is true.
   * @returns {boolean} - True if the condition is met; otherwise false.
   */
  isDead() {
    return this.energy == 0;
  } 

  /**
   * Plays animation.
   *
   * @param {Array<string>} images - Ordered image paths used for animation playback.
   * @returns {void} - No return value.
   */
  playAnimation(images) {
    let i = this.CurrentImage % images.length;
    this.path = images[i];
    this.img = this.imageCache[this.path];
    this.CurrentImage++;
    }

  /**
   * Moves right.
   * @returns {void} - No return value.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves left.
   * @returns {void} - No return value.
   */
  moveLeft() {
      this.x -= this.speed;
  }

  
}
