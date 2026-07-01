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
    speed = 1;
    damage = 20;
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
            if (this.isWalking) {
                this.x -= this.speed;
            }
        }, 1000 / 60);
        IntervalHub.startInterval(() => {
            if (this.isAlert) {
                this.playAnimation(this.imagesAlert);
            }
            if (this.isWalking) {
                this.playAnimation(this.imagesWalk);
            }
        }, 1000 / 8);
    }

    activate() {
        console.log("Boss aktiviert");
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

        setTimeout(() => {
            this.isAlert = false;
            this.isWalking = true;
            this.start();
        }, 1500);
    }

    start() {
        this.animate();
    }
}
