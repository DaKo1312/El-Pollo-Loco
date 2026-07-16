import {MovableObject} from './movables_object.class.js';

/**
 * A single background tile of the parallax background.
 *
 * Each instance covers exactly one screen segment and is anchored to the
 * bottom of the canvas. Instances are created by the level factory, which
 * lines them up along the x axis and pushes them in drawing order (back to
 * front). The class inherits the movement and drawing logic from
 * {@link MovableObject}; the horizontal parallax offset itself is applied by
 * the camera during rendering.
 *
 * @class
 * @extends MovableObject
 *
 * @example
 * new BackgroundObject(ImageHub.BACKGROUND.air, 720);
 */
export class BackgroundObject extends MovableObject {
    /**
     * Width of the tile in pixels; matches the canvas width.
     *
     * @type {number}
     */
    width = 720;

    /**
     * Height of the tile in pixels; matches the canvas height.
     *
     * @type {number}
     */
    height = 480;

    /**
     * Creates a background tile and loads its image.
     *
     * The `super()` call returns the newly created instance, so `loadImage`
     * can be chained directly onto it. The y position is derived from the
     * canvas height, which places the tile flush with the bottom edge.
     *
     * @param {string} imagePath - Path of the tile image.
     * @param {number} x - Horizontal position of the tile in the level.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}