import { Enemy } from "./enemy.class.js";
import { ImageHelper } from '../helper/image_helper.class.js';

export class SmallChicken extends Enemy {
    // #region small chicken properties
    imagesWalk = ImageHelper.SMALLCHICKEN.walk;
    imagesDead = ImageHelper.SMALLCHICKEN.dead;
    y = 370;
    height = 60;
    width = 40;
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