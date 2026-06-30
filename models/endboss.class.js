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
    
    // # endregion

    constructor() {
        super();
        this.y = -40;
        this.loadImage(this.imagesAlert[0]);
        this.loadImages(this.imagesAlert);
        this.animate();
    }

    animate() {
        IntervalHub.startInterval(() => {
        this.playAnimation(this.imagesAlert);
    }, 1000 / 5);
    }
}