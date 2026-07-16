import { MovableObject } from "./movables_object.class.js";
import { ImageHub } from "../helper/image_helper.class.js";

/**
 * A collectable salsa bottle lying on the ground.
 *
 * Bottles are placed randomly along the level and are picked up by walking
 * into them. Collected bottles become the ammunition of the character and are
 * the only way to damage the endboss. The thrown bottle itself is a separate
 * object; this class only represents the collectable item.
 *
 * @class
 * @extends MovableObject
 *
 * @see Character#collectFlask
 */
export class Flask extends MovableObject {
    // #region flask properties
    /**
     * The two ground sprites of the bottle.
     *
     * One of them is picked at random per instance, so the bottles do not all
     * look identical.
     *
     * @type {string[]}
     */
    imagesGround = ImageHub.FLASK.onGround;

    /**
     * Rendered width in pixels.
     *
     * @type {number}
     */
    width = 80;

    /**
     * Rendered height in pixels.
     *
     * @type {number}
     */
    height = 80;

    /**
     * Vertical position; places the bottle on the ground.
     *
     * @type {number}
     */
    y = 340;

    /**
     * Debug flag: draws the collision frame when `true`.
     *
     * @type {boolean}
     */
    showFrame = false;

    /**
     * Insets of the collision box relative to the image bounds.
     *
     * Note that `top` and `bottom` add up to more than {@link Flask#height},
     * which makes the resulting box height negative.
     *
     * @type {{top: number, right: number, bottom: number, left: number}}
     */
    offset = {top: 80, right: 20, bottom: 80, left: 25};
    // #endregion

    /**
     * Creates a bottle at a random position with a random sprite.
     *
     * The x position spans the playable area from 200 up to about 5700, which
     * keeps the bottles clear of the start position and the boss zone.
     */
    constructor() {
        super();
        const imageIndex = Math.floor(Math.random() * this.imagesGround.length);
        this.loadImage(this.imagesGround[imageIndex]);
        this.x = 200 + Math.random() * 5500;
    }
}