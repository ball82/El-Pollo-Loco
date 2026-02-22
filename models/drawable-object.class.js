class DrawableObject {
    img;
    imageCache = {};
    CurrentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;

      /**
       * Loads image.
       *
       * @param {string} path - Image path to load from cache.
       * @returns {void} - No return value.
       */
      loadImage(path) {
      this.img = new Image();
      this.img.src = path;
  }
  /**
   * Draws the object.
   *
   * @param {CanvasRenderingContext2D} ctx - 2D rendering context of the canvas.
   * @returns {void} - No return value.
   */
  draw(ctx) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
  
  /**
   * Draws frame.
   *
   * @param {CanvasRenderingContext2D} ctx - 2D rendering context of the canvas.
   * @returns {void} - No return value.
   */
  drawFrame(ctx) {
    if(this instanceof Character || this instanceof Chicken || this instanceof SmallChicken ){
    ctx.beginPath();
    ctx.lineWidth = "1";
        ctx.strokeStyle = "red";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }
  }
   
  /**
   * Loads images.
   *
   * @param {Array<*>} arr - Array of image paths.
   * @returns {void} - No return value.
   */
  loadImages(arr) {
      arr.forEach((path) => {
          let img = new Image();
          img.src = path;
          img.style = "transition: scaleX(-1)";
          this.imageCache[path] = img;
      });
  }



}
