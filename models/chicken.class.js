import {MovableObject} from './movables_object.class.js';
import {ImageHelper} from '../helper/image_helper.class.js';

export class Chicken extends MovableObject {
    // #region chicken properties
    y = 350;
    height = 80;
    width = 50;
    // #endregion

    currentImage = 0;
    imagesWalk = ImageHelper.BIGCHICKEN.walk;

    constructor() {
        super();
        this.loadImage(this.imagesWalk[0]);
        this.loadImages(this.imagesWalk);
        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

    animate() {
        this.moveLeft();

        setInterval(() => {
            let i = this.currentImage % this.imagesWalk.length;
            let path = this.imagesWalk[i];
            this.img = this.imageCache[path];
            this.currentImage ++;
        }, 1000/10);
    }
}