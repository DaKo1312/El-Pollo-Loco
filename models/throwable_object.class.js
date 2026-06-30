import { ImageHub } from "../helper/image_helper.class.js";
import { IntervalHub } from "../helper/interval_helper.class.js";
import { MovableObject } from "./movables_object.class.js";

export class ThrowableObject extends MovableObject {
    // #region throwableobject
    imagesRotate = ImageHub.ROTATE.flask;
    imagesSplash = ImageHub.SPLASH.flask;
    isSplashing = false;

    // #endregion

    constructor(x, y, world) {
        super();
        this.world = world;
        this.loadImage(this.imagesRotate[0]);
        this.loadImages(this.imagesRotate);
        this.loadImages(this.imagesSplash);
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.groundY = 360;
        this.throw();
        this.checkSplash();
        this.playSplashAnimation();
    }

    throw() {
        this.speedY = 20;
        this.applyGravity();
        IntervalHub.startInterval(() => {
            if (!this.isSplashing) {
                this.x += 8;
            }
        }, 1000 / 60);
        IntervalHub.startInterval(() => {
            if (!this.isSplashing) {
                this.playAnimation(this.imagesRotate);
            }
        }, 100);
    }

    checkSplash() {
        IntervalHub.startInterval(() => {
            if (!this.isSplashing && this.y >= this.groundY) {
                this.isSplashing = true;
            }
        }, 1000 / 60);
    }

    playSplashAnimation() {
        let currentImage = 0;
        IntervalHub.startInterval(() => {
            if (!this.isSplashing) return;
            if (currentImage < this.imagesSplash.length) {
                let path = this.imagesSplash[currentImage];
                this.img = this.imageCache[path];
                currentImage++;
            } else {
                let index = this.world.throwableObjects.indexOf(this);
                if (index > -1) {
                    this.world.throwableObjects.splice(index, 1);
                }
            }
        }, 100);
    }
}