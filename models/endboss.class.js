import { MovableObject } from "./movables_object.class.js";
import { ImageHub } from '../helper/image_helper.class.js';
import { IntervalHub } from "../helper/interval_helper.class.js";

export class Endboss extends MovableObject {
    // #region endbosss properties
    imagesWalk = ImageHub.ENDBOSS.walk;
    imagesAlert = ImageHub.ENDBOSS.alert;
    imagesAttack = ImageHub.ENDBOSS.attack;
    imagesHurt = ImageHub.ENDBOSS.hurt;
    imagesDead = ImageHub.ENDBOSS.dead;
    y = -40;
    x = 6750;
    height = 500;
    width = 350;
    currentImage = 0;
    showFrame = false;
    groundY = -40;
    isActivated = false;
    isAlert = false;
    isWalking = false;
    isAttacking = false;
    speed = 1;
    damage = 20;
    energy = 100;
    isHurt = false;
    isDead = false;
    deadAnimationFinished = false;
    deadImage = 0;
    // # endregion

    constructor() {
        super();
        this.loadImage(this.imagesAlert[0]);
        this.loadImages(this.imagesAlert);
        this.loadImages(this.imagesWalk);
        this.loadImages(this.imagesAttack);
        this.loadImages(this.imagesHurt);
        this.loadImages(this.imagesDead);
        this.animate();
    }

    animate() {
        IntervalHub.startInterval(() => {
            if (this.isWalking && !this.isDead) {
                this.x -= this.speed;
            }
        }, 1000 / 60);
        IntervalHub.startInterval(() => {
            if (!this.isDead) {
                this.playCurrentAnimation();
            }
        }, 1000 / 8);
        IntervalHub.startInterval(() => {
            if (this.isDead) {
                this.playDeadAnimation();
            }
        }, 500);
    }

    playCurrentAnimation() {
        if (this.isHurt) return this.playAnimation(this.imagesHurt);
        if (this.isAttacking) return this.playAnimation(this.imagesAttack);
        if (this.isAlert) return this.playAnimation(this.imagesAlert);
        if (this.isWalking) this.playAnimation(this.imagesWalk);
    }

    playDeadAnimation() {
        if (this.deadAnimationFinished) {
            return;
        }
        this.img = this.imageCache[this.imagesDead[this.deadImage]];
        if (this.deadImage < this.imagesDead.length - 1) {
            this.deadImage++;
        } else {
            this.deadAnimationFinished = true;
        }
    }

    playAnimationFrame() {
        this.loadImage(this.imagesDead[this.currentImage]);
        if (this.currentImage < this.imagesDead.length - 1) {
            setTimeout(() => this.currentImage++, 500);
        } else {
            this.deadAnimationFinished = true;
        }
    }

    activate() {
        if (this.isActivated) {
            return;
        }
        this.isActivated = true;
        this.isAlert = true;
        setTimeout(() => {
            this.isAlert = false;
            this.isWalking = true;
            this.start();
        }, 1500);
    }

    start() {
        this.animate();
        this.startAttacking();
    }

    startAttacking() {
        IntervalHub.startInterval(() => {
            if (!this.isWalking || this.isDead || this.isAttacking) {
                return;
            }
            this.attack();
        }, 2500);
    }

    attack() {
        this.currentImage = 0;
        this.isAttacking = true;
        setTimeout(() => {
            this.currentImage = 0;
            this.isAttacking = false;
        }, 800);
    }

    hit(damage) {
        if (this.isDead) {
            return;
        }
        this.energy = Math.max(0, this.energy - damage);
        this.isHurt = true;
        setTimeout(() => {
            this.isHurt = false;
        }, 300);
        if (this.energy === 0) {
            console.log("BOSS TOT");
            this.deadImage = 0;
            this.isDead = true;
        }
    }
}
