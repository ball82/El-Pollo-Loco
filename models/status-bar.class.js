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
        if (this.percentage === 100) return 5;
        return Math.max(0, Math.ceil(this.percentage / 20) - 1);
    }

}
