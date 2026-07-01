import { MovableObject } from "./movables_object.class.js";
import { IntervalHub } from "../helper/interval_helper.class.js";

export class Enemy extends MovableObject {
    currentImage = 0;
    showFrame = false;
    damage = 5;

    constructor() {
        super();
        this.x = 200 + Math.random() * 6000;
    }

    animate() {
        this.moveLeft();
        IntervalHub.startInterval(() => {
            this.playAnimation(this.imagesWalk);
        }, 1000 / 5);
    }

    start() {
        this.animate();
        }
}