import { MovableObject } from './movables_object.class.js';
import { ImageHub } from '../helper/image_helper.class.js';
import { IntervalHub } from "../helper/interval_helper.class.js";

export class Character extends MovableObject {
    // #region character properties
    imagesIdle = ImageHub.PEPE.idle;
    imagesIdleLong = ImageHub.PEPE.idle_long;
    imagesWalk = ImageHub.PEPE.walk;
    imagesJump = ImageHub.PEPE.jump;
    imagesHurt = ImageHub.PEPE.hurt;
    imagesDead = ImageHub.PEPE.dead;
    height = 290;
    y = 10;
    speed = 5.5;
    currentImage = 0;
    lastAction = Date.now();
    showFrame = false;
    offset = {top: 110, right: 20, bottom: 10, left: 25};
    coins = 0;
    flasks = 0;
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
    }
    
    start() {
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

    collectCoin() {
        this.coins++;
        this.world.coinStatusBar.setPercentage(this.coins * 20);
    }

    collectFlask() {
        this.flasks++;
        this.world.flaskStatusBar.setPercentage(this.flasks * 20);
    }
}

