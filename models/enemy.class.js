import { MovableObject } from "./movables_object.class.js";
import { IntervalHub } from "../helper/interval_helper.class.js";

export class Enemy extends MovableObject {
    currentImage = 0;

    constructor() {
        super();
        this.x = 200 + Math.random() * 6000;
        this.y = 80 + Math.random() * 180;
    }

    animate() {
        this.moveLeft();
        IntervalHub.startInterval(() => {
            this.playAnimation(this.imagesWalk);
        }, 1000 / 5);
    }
}