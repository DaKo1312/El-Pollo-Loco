import { MovableObject } from './movables_object.class.js';
import { ImageHelper } from '../helper/image_helper.class.js';
import { IntervalHub } from "../helper/interval_helper.class.js";

export class Character extends MovableObject {
    // #region character properties
    imagesIdle = ImageHelper.PEPE.idle;
    imagesIdleLong = ImageHelper.PEPE.idle_long;
    imagesWalk = ImageHelper.PEPE.walk;
    imagesJump = ImageHelper.PEPE.jump;
    imagesHurt = ImageHelper.PEPE.hurt;
    imagesDead = ImageHelper.PEPE.dead;
    height = 290;
    y = 145;
    speed = 10;
    currentImage = 0;
    // #endregion
    world;

    constructor() {
        super();
        this.loadImage(this.imagesWalk[0]);
        this.loadImages(this.imagesWalk);
        this.animate();
    }

    animate() {
        IntervalHub.startInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.x += this.speed;
                this.otherDirection = false;
            }
            if (this.world.keyboard.LEFT && this.x > -100) {
                this.x -= this.speed;
                this.otherDirection = true;
            }
            this.world.camera_x = -this.x +100;
        }, 1000/60);

        IntervalHub.startInterval(() => {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.imagesWalk);
        }}, 50);
    }

    jump() {
    }
}