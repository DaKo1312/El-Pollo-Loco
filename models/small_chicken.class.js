import { Enemy } from "./enemy.class.js";
import { ImageHub } from '../helper/image_helper.class.js';
import { IntervalHub } from "../helper/interval_helper.class.js";

/**
 * The small chicken enemy.
 *
 * Smaller and lower to the ground than {@link Chicken}, and the only walking
 * enemy that jumps: gravity is enabled and a hop is triggered every two
 * seconds, which makes it harder to stomp. Movement, animation and the death
 * handling come from {@link Enemy}.
 *
 * @class
 * @extends Enemy
 *
 * @see Chicken
 */
export class SmallChicken extends Enemy {
    // #region small chicken properties
    /**
     * Frames of the walk animation.
     *
     * @type {string[]}
     */
    imagesWalk = ImageHub.SMALLCHICKEN.walk;

    /**
     * Frames of the death animation (single frame, shown as a still image).
     *
     * @type {string[]}
     */
    imagesDead = ImageHub.SMALLCHICKEN.dead;

    /**
     * Vertical position on the canvas.
     *
     * @type {number}
     */
    y = 370;

    /**
     * Rendered height in pixels.
     *
     * @type {number}
     */
    height = 60;

    /**
     * Rendered width in pixels.
     *
     * @type {number}
     */
    width = 50;

    /**
     * Index of the currently displayed animation frame.
     *
     * @type {number}
     */
    currentImage = 0;

    /**
     * Ground level of the chicken; the y position it lands back on after a hop.
     *
     * @type {number}
     */
    groundY = 370;
    // #endregion

    /**
     * Creates a small chicken, preloads its sprites and starts hopping.
     *
     * The speed varies between roughly `0.15` and `0.65` pixels per tick.
     * Gravity must be enabled before the jump loop, otherwise the chicken
     * would rise without ever coming back down. The horizontal start position
     * is randomised by {@link Enemy}.
     */
    constructor() {
        super();
        // this.y = 370;
        this.loadImage(this.imagesWalk[0]);
        this.loadImages(this.imagesWalk);
        this.speed = 0.15 + Math.random() * 0.5;
        this.applyGravity();
        this.startJumping();
    }

    /**
     * Starts the jump loop of the chicken.
     *
     * Every two seconds a hop is triggered, but only while the chicken is
     * alive and standing on the ground, which prevents mid-air double jumps.
     * The jump height comes from {@link MovableObject#jump}.
     *
     * @returns {void}
     */
    startJumping() {
        IntervalHub.startInterval(() => {
            if (!this.isDead && !this.isAboveGround()) {
                this.jump();
            }
        }, 2000);
    }
}