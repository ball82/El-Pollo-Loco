class StatusBar extends DrawableObject {    
    percentage = 100;
    images_StatusBar = [];

    constructor(images, x, y){
        super();
        this.images_StatusBar = images;
        this.loadImages(this.images_StatusBar);
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    setPercentage(percentage){
        this.percentage = Math.max(0, Math.min(100, percentage));
        let path = this.images_StatusBar[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex(){
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }

}
