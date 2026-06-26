import { MovableObject } from "./movables_object.class.js";
import { ImageHelper } from '../helper/image_helper.class.js';
import { IntervalHub } from "../helper/interval_helper.class.js";

export class Endboss extends MovableObject {
    // #region endbosss properties
    imagesWalk = ImageHelper.ENDBOSS.walk;
    imagesAlert = ImageHelper.ENDBOSS.alert;
    imagesAttack = ImageHelper.ENDBOSS.attack;
    imagesHurt = ImageHelper.ENDBOSS.hurt;
    imagesDead = ImageHelper.ENDBOSS.dead;
    y = -40;
    x = 6750;
    height = 500;
    width = 350;
    currentImage = 0;
    // # endregion

    constructor() {
        super();
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