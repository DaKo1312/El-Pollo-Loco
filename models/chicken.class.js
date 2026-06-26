import { Enemy } from "./enemy.class.js";
import { ImageHelper } from '../helper/image_helper.class.js';

export class Chicken extends Enemy {
    // #region chicken properties
    imagesWalk = ImageHelper.BIGCHICKEN.walk;
    imagesDead = ImageHelper.BIGCHICKEN.dead;
    y = 350;
    height = 80;
    width = 70;
    currentImage = 0;
    // #endregion

    constructor() {
        super();
        this.loadImage(this.imagesWalk[0]);
        this.loadImages(this.imagesWalk);
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }
}