class MovableObject {
  x = 120;
  y = 280;
  img;
  height = 150;
  width = 100;
  imageCache = {};
  CurrentImage = 0;
  speed = 0.25;
  otherDirection  = false;
  speedY = 0;
  acceleration = 1;
  

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;  
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    return this.y < 150;
  }
   
  loadImage(path) {
      this.img = new Image();
      this.img.src = path;
  }

  draw(ctx) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "1";
        ctx.strokeStyle = "red";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
  }



  loadImages(arr) {
      arr.forEach((path) => {
          let img = new Image();
          img.src = path;
          img.style = "transition: scaleX(-1)";
          this.imageCache[path] = img;
      });
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

