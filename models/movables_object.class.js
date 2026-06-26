import { ImageHelper } from '../helper/image_helper.class.js';
import { IntervalHub } from "../helper/interval_helper.class.js";

export class MovableObject {
    // #region movableObjects properties
    x = 20;
    y = 285;
    height = 150;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;
    speed = 0.2;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    // #endregion

    applyGravity() {
        setInterval(() => {
            if(this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000/25);
    }

    isAboveGround() {
        return this.y < 145;
    }

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
    arr.forEach((path) => {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
    });
}

    moveLeft() {
        IntervalHub.startInterval(() => {
        this.x -= this.speed;
        }, 1000 / 60);
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}