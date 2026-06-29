import { ImageHelper } from '../helper/image_helper.class.js';
import { IntervalHub } from "../helper/interval_helper.class.js";
import { DrawableObject } from './drawable_object.class.js';

export class MovableObject extends DrawableObject {
    // #region movableObjects properties
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
        console.log('HIT, energy', this.energy);
        this.lastHit = Date.now();
        this.world.statusBar.setPercentage(this.energy);
        }
    }

    isHurt() {
        let timePassed = Date.now() - this.lastHit;
        return timePassed < 1000;
    }

    isDead() {
        return this.energy <= 0;
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