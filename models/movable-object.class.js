class MovableObject {
    x = 120;
    y = 280;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    CurrentImage = 0;
    speed = 0.25;
    
    
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    moveRight() {
        this.x += 1;  
        if(this.x > 800  ){
          this.x = -170; // reset position
        }
    }

        moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000/60);
    }

}

