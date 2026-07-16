import { MovableObject } from "./movables_object.class.js";
import { ImageHub } from "../helper/image_helper.class.js";

/**
 * A collectable coin.
 *
 * Coins are placed randomly across the level and are collected by walking or
 * jumping into them. Five coins restore the character's health to full; the
 * counting itself is handled by the character. The class is static in
 * practice: it only carries its position and collision box, all movement
 * logic is inherited but unused.
 *
 * @class
 * @extends MovableObject
 *
 * @see Character#collectCoin
 */
export class Coin extends MovableObject {
    // #region coin properties
    /**
     * Sprite set of the coin.
     *
     * Only the first frame is used; the array shape allows adding a spin
     * animation later without touching the consumers.
     *
     * @type {string[]}
     */
    image = ImageHub.COINS.coin;

    /**
     * Rendered width in pixels.
     *
     * @type {number}
     */
    width = 120;

    /**
     * Rendered height in pixels.
     *
     * Overridden by the randomised value in the constructor.
     *
     * @type {number}
     */
    height = 120;

    /**
     * Vertical position on the canvas.
     *
     * @type {number}
     */
    y = 120;

    /**
     * Debug flag: draws the collision frame when `true`.
     *
     * @type {boolean}
     */
    showFrame = false;

    /**
     * Insets of the collision box relative to the image bounds.
     *
     * The generous insets shrink the 120Ã—120 image down to the visible coin,
     * so the player has to touch the coin itself and not its transparent
     * padding.
     *
     * @type {{top: number, right: number, bottom: number, left: number}}
     */
    offset = {top: 40, right: 40, bottom: 40, left: 40};
    // #endregion

    /**
     * Creates a coin at a random position in the level.
     *
     * The x position spans the playable area from 200 up to about 5700, the
     * y position ranges from 80 to about 300, which places the coins between
     * ground level and jump height.
     */
    constructor() {
        super();
        this.loadImage(this.image[0]);
        this.x = 200 + Math.random() * 5500;
        this.y = 80 + Math.random() * 220;
    }

}