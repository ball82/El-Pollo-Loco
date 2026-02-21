class MovableObject extends DrawableObject {
  speed = 0.25;
  otherDirection  = false;
  speedY = 0;
  acceleration = 0.42;
  energy = 100;
  lastHit = 0;
  

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

  stopGravity() {
    if (!this.gravityInterval) return;
    clearInterval(this.gravityInterval);
    this.gravityInterval = null;
  }

  isAboveGround() {
    if (this instanceof ThowableObject) {
      return true;
    } else {
      return this.y < 150;
    }
  }



  isColliding(mo){
    return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x + mo.width &&
            this.y < mo.y + mo.height;
  }
  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    } 
  }  

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; 
    timepassed = timepassed / 1000; 
    return timepassed < 1.2; 
   }


  isDead() {
    return this.energy == 0;
  } 

  playAnimation(images) {
    let i = this.CurrentImage % images.length;
    this.path = images[i];
    this.img = this.imageCache[this.path];
    this.CurrentImage++;
    }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
      this.x -= this.speed;
  }

  
}
