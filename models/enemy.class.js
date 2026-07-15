import { MovableObject } from "./movables_object.class.js";
import { IntervalHub } from "../helper/interval_helper.class.js";
import { SoundHub } from '../helper/sound_helper.class.js';

export class Enemy extends MovableObject {
    currentImage = 0;
    showFrame = false;
    damage = 10;
    isDead = false;
    isWalking = true;
    runSoundPlaying = false;

    constructor() {
        super();
        this.x = 200 + Math.random() * 6000;
    }

    animate() {
        IntervalHub.startInterval(() => {
            if (!this.isDead && this.isWalking) {
                this.x -= this.speed;
            }
        }, 1000 / 60);
        IntervalHub.startInterval(() => {
            if (!this.isDead && this.isWalking) {
                this.playAnimation(this.imagesWalk);
            }
        }, 1000 / 8);
    }

    start() {
        this.animate();
        }

    hit() {
        if (this.isDead) return;

        this.isDead = true;
        SoundHub.play(SoundHub.chickenDead);
        this.loadImage(this.imagesDead[0]);
    }
}