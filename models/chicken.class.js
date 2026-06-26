import { MovableObject } from './movables_object.class.js';
import { ImageHelper } from '../helper/image_helper.class.js';
import { IntervalHub } from "../helper/interval_helper.class.js";

export class Chicken extends MovableObject {
    // #region chicken properties
    imagesWalk = ImageHelper.BIGCHICKEN.walk;
    imagesDead = ImageHelper.BIGCHICKEN.dead;
    y = 350;
    height = 80;
    width = 50;
    currentImage = 0;
    // #endregion

    constructor() {
        super();
        this.loadImage(this.imagesWalk[0]);
        this.loadImages(this.imagesWalk);
        this.x = 200 + Math.random() * 4000;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

    animate() {
        this.moveLeft();

        IntervalHub.startInterval(() => {
        this.playAnimation(this.imagesWalk);
    }, 1000 / 5);
    }
}