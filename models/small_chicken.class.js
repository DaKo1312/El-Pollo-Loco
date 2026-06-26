import { Enemy } from "./enemy.class.js";
import { ImageHelper } from '../helper/image_helper.class.js';
import { IntervalHub } from "../helper/interval_helper.class.js";

export class SmallChicken extends Enemy {
    // #region small chicken properties
    imagesWalk = ImageHelper.SMALLCHICKEN.walk;
    imagesDead = ImageHelper.SMALLCHICKEN.dead;
    y = 370;
    height = 60;
    width = 50;
    currentImage = 0;
    groundY = 370;
    // #endregion

    constructor() {
        super();
        this.y = 370;
        this.loadImage(this.imagesWalk[0]);
        this.loadImages(this.imagesWalk);
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
        this.applyGravity();
        this.startJumping();

        IntervalHub.startInterval(() => {
            if (!this.isAboveGround()) {
                this.jump();
            }
        }, 2000 + Math.random() * 2000);
    }

    startJumping() {
        IntervalHub.startInterval(() => {
            if (!this.isAboveGround()) {
                this.jump();
            }
        }, 2000 + Math.random() * 2000);
    }
}