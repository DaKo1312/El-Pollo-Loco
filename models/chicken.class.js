import { Enemy } from "./enemy.class.js";
import { ImageHub } from '../helper/image_helper.class.js';

export class Chicken extends Enemy {
    // #region chicken properties
    imagesWalk = ImageHub.BIGCHICKEN.walk;
    imagesDead = ImageHub.BIGCHICKEN.dead;
    y = 350;
    height = 80;
    width = 70;
    currentImage = 0;
    groundY = 350;
    // #endregion

    constructor() {
        super();
        this.y = 350;
        this.loadImage(this.imagesWalk[0]);
        this.loadImages(this.imagesWalk);
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }
}