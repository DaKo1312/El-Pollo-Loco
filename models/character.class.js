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
    y = 10;
    speed = 5.5;
    currentImage = 0;
    lastAction = Date.now();
    showFrame = true;
    offset = {top: 110, right: 20, bottom: 10, left: 25};
    // #endregion

    world;

    constructor() {
        super();
        this.loadImage(this.imagesWalk[0]);
        this.loadImages(this.imagesWalk);
        this.loadImages(this.imagesIdle);
        this.loadImages(this.imagesIdleLong);
        this.loadImage(this.imagesJump[0]);
        this.loadImages(this.imagesJump);
        this.loadImages(this.imagesHurt);
        this.loadImages(this.imagesDead);
        this.applyGravity();
        this.animate();
    }

    animate() {

    IntervalHub.startInterval(() => {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.x += this.speed;
            this.otherDirection = false;
            this.lastAction = Date.now();
        }
        if (this.world.keyboard.LEFT && this.x > -100) {
            this.x -= this.speed;
            this.otherDirection = true;
            this.lastAction = Date.now();
        }
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.speedY = 25;
        }
        this.world.camera_x = -this.x + 100;
    }, 1000 / 60);

    IntervalHub.startInterval(() => {
        let idleTime = Date.now() - this.lastAction;
        if (this.isDead()) { 
            this.playAnimation(this.imagesDead);
        } else if (this.isHurt()) {
            this.playAnimation(this.imagesHurt);
        }   else if (this.isAboveGround()) {
            this.playAnimation(this.imagesJump);
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.imagesWalk);
        } else if (idleTime >= 8000) {
            this.playAnimation(this.imagesIdleLong);
        } else if (idleTime >= 3000) {
            this.playAnimation(this.imagesIdle);
        }
    }, 150);
}

    jump() {
    }
}

