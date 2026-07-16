import { Enemy } from "./enemy.class.js";
import { ImageHub } from '../helper/image_helper.class.js';

/**
 * The normal sized chicken enemy.
 *
 * Walks along the ground towards the character and can be defeated either by
 * a thrown bottle or by being stomped from above. Movement, animation and
 * the random start position are inherited from {@link Enemy}; this class only
 * provides the sprites, the dimensions and its own randomised speed.
 *
 * @class
 * @extends Enemy
 *
 * @see SmallChicken
 */
export class Chicken extends Enemy {
    // #region chicken properties
    /**
     * Frames of the walk animation.
     *
     * @type {string[]}
     */
    imagesWalk = ImageHub.BIGCHICKEN.walk;

    /**
     * Frames of the death animation (single frame, shown as a still image).
     *
     * @type {string[]}
     */
    imagesDead = ImageHub.BIGCHICKEN.dead;

    /**
     * Vertical position on the canvas.
     *
     * @type {number}
     */
    y = 350;

    /**
     * Rendered height in pixels.
     *
     * @type {number}
     */
    height = 80;

    /**
     * Rendered width in pixels.
     *
     * @type {number}
     */
    width = 70;

    /**
     * Index of the currently displayed animation frame.
     *
     * @type {number}
     */
    currentImage = 0;

    /**
     * Ground level of the chicken; the y position it returns to.
     *
     * @type {number}
     */
    groundY = 350;
    // #endregion

    /**
     * Creates a chicken, preloads its sprites and randomises its speed.
     *
     * The speed varies between roughly `0.15` and `0.65` pixels per tick, so
     * the chickens spread out over the level instead of moving as a block.
     * The horizontal start position is randomised by {@link Enemy}.
     */
    constructor() {
        super();
        this.y = 350;
        this.loadImage(this.imagesWalk[0]);
        this.loadImages(this.imagesWalk);
        this.speed = 0.15 + Math.random() * 0.5;
    }
}