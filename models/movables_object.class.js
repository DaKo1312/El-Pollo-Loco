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
    showFrame = false;
    groundY = 145;
    energy = 100;
    lastHit = 0;
    offset = {top: 0, right: 0, bottom: 0, left: 0};
    // #endregion

    applyGravity() {
        IntervalHub.startInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000/25);
    }

    isAboveGround() {
        return this.y < this.groundY;
    }

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        if (!this.showFrame) return;
        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.strokeStyle = "blue";
        ctx.rect(
            this.x + this.offset.left,
            this.y + this.offset.top,
            this.width - this.offset.left - this.offset.right,
            this.height - this.offset.top - this.offset.bottom
        );
        ctx.stroke();
    }

    isColliding(mo) {
    return (
        this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
        this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
        this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
        this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
    }

    hit() {
    if (!this.isHurt()) {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        }
        this.lastHit = Date.now();
        }
    }

    isHurt() {
        let timePassed = Date.now() - this.lastHit;
        return timePassed < 1000;
    }

    isDead() {
        return this.energy <= 0;
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

    jump() {
    this.speedY = 20;
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}