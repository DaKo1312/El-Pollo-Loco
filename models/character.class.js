import { MovableObject } from './movables_object.class.js';
import { ImageHub } from '../helper/image_helper.class.js';
import { IntervalHub } from "../helper/interval_helper.class.js";
import { SoundHub } from '../helper/sound_helper.class.js';

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
    snoringPlayed = false;
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
        this.animateImages();
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
                this.jump();
            }
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);
    }

    animateImages() {
        IntervalHub.startInterval(() => {
            let idleTime = Date.now() - this.lastAction;
            const isWalking = (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isAboveGround();
            if (!isWalking && this.runSoundPlaying) {
                SoundHub.pause(SoundHub.characterRun);
                this.runSoundPlaying = false;
            }
            if (this.isDead()) {
                if (!this.deathSoundPlayed) {
                    SoundHub.play(SoundHub.characterDead);
                    this.deathSoundPlayed = true;
                }
                SoundHub.pause(SoundHub.characterSnoring);
                this.snoringPlayed = false;
                this.playAnimation(this.imagesDead);
            } else if (this.isHurt()) {
                SoundHub.pause(SoundHub.characterSnoring);
                this.snoringPlayed = false;
                this.playAnimation(this.imagesHurt);
            } else if (this.isAboveGround()) {
                SoundHub.pause(SoundHub.characterSnoring);
                this.snoringPlayed = false;
                this.playAnimation(this.imagesJump);
            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                if (!this.runSoundPlaying) {
                    SoundHub.play(SoundHub.characterRun);
                    this.runSoundPlaying = true;
                } 
                this.playAnimation(this.imagesWalk);
            } else if (idleTime >= 8000) {
                if (!this.snoringPlayed) {
                    SoundHub.characterSnoring.loop = true;
                    SoundHub.play(SoundHub.characterSnoring);
                    this.snoringPlayed = true;
                }
                this.playAnimation(this.imagesIdleLong);
            } else if (idleTime >= 3000) {
                SoundHub.pause(SoundHub.characterSnoring);
                this.snoringPlayed = false;
                this.playAnimation(this.imagesIdle);
            }
        }, 150);
    }

    jump() {
        this.speedY = 25;
        SoundHub.play(SoundHub.characterJump);
    }

    collectCoin() {
        this.coins++;
        SoundHub.play(SoundHub.collectCoin);
        this.world.coinStatusBar.setPercentage(this.coins * 20);
        if (this.coins < 5) return;
        this.energy = 100;
        this.coins = 0;
        this.world.statusBar.setPercentage(100);
        this.world.coinStatusBar.setPercentage(0);
        this.world.showHealthFull();
    }

    collectFlask() {
        this.flasks++;
        SoundHub.play(SoundHub.collectBottle);
        this.world.flaskStatusBar.setPercentage(this.flasks * 20);
    }

    isJumpingOn(enemy) {
        const previousBottom = this.lastY + this.height - this.offset.bottom;
        const currentBottom = this.y + this.height - this.offset.bottom;
        const enemyTop = enemy.y + enemy.offset.top + 10;
        return (
            this.speedY < 0 &&
            previousBottom <= enemyTop &&
            currentBottom >= enemyTop - 30
        );
    }

    bounce() {
        this.speedY = 15;
    }
}

