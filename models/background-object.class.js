class BackgroundObject extends MovableObject {

    width = 720;
    height = 480;
    
    /**
     * Creates an instance of BackgroundObject.
     *
     * @param {string} imagePath - Path of the image resource.
     * @param {number} x - Horizontal position in pixels.
     * @param {number} y - Vertical position in pixels.
     */
    constructor(imagePath, x, y, ){

        super().loadImage(imagePath);

        this.x = x;
        this.y = y;
    
    }



}