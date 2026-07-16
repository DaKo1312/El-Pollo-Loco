import {MovableObject} from './movables_object.class.js';

/**
 * A cloud drifting across the sky.
 *
 * Purely decorative: clouds have no collision and no state, they only move
 * slowly to the left to create depth. The level factory overrides the
 * position set in the constructor and lines the clouds up along the x axis
 * with a fixed gap.
 *
 * @class
 * @extends MovableObject
 */
export class Cloud extends MovableObject {
    // #region cloud properties
    /**
     * Vertical position on the canvas.
     *
     * Overridden by the level factory with a slightly randomised value.
     *
     * @type {number}
     */
    y = 5;

    /**
     * Rendered height in pixels.
     *
     * @type {number}
     */
    height = 450;

    /**
     * Rendered width in pixels.
     *
     * @type {number}
     */
    width = 1500;

    /**
     * Debug flag: draws the collision frame when `true`.
     *
     * @type {boolean}
     */
    showFrame = false;
    // #endregion

    /**
     * Creates a cloud and loads its image.
     *
     * The `super()` call returns the new instance, so `loadImage` can be
     * chained onto it. The random x position is a fallback; the level factory
     * assigns the final position afterwards.
     */
    constructor() {
        super().loadImage('assets/img/5_background/layers/4_clouds/full.png');
        this.x = Math.random() *500;
    }

    /**
     * Starts the movement of the cloud.
     *
     * Called by the world once the game starts.
     *
     * @returns {void}
     */
    start() {
        this.animate();
    }

    /**
     * Starts the continuous leftward drift.
     *
     * The interval itself is created inside `moveLeft` of
     * {@link MovableObject} and registered with the interval helper.
     *
     * @returns {void}
     */
    animate() {
        this.moveLeft();
    }
}