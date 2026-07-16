import { DrawableObject } from "./drawable_object.class.js";

/**
 * A status bar of the HUD.
 *
 * Generic bar used for health, coins and bottles alike, and for the endboss
 * health as well: the sprites, the position and the initial value are passed
 * in, so one class covers every bar of the game. Status bars are drawn in
 * screen space, not in world space — the camera offset is reset before they
 * are rendered, which keeps them fixed on screen.
 *
 * The bar shows six steps (0, 20, 40, 60, 80, 100 percent). Values in between
 * are rounded down to the next step by {@link StatusBar#resolveImageIndex}.
 *
 * @class
 * @extends DrawableObject
 *
 * @example
 * new StatusBar(ImageHub.STATUSBAR.health, 20, 0, 100);
 */
export class StatusBar extends DrawableObject {
    // #region statusbar
    /**
     * The six sprites of the bar, ordered from 0 to 100 percent.
     *
     * @type {string[]}
     */
    images = [];

    /**
     * Current fill level in percent.
     *
     * @type {number}
     */
    percentage = 100;

    /**
     * Rendered width in pixels.
     *
     * @type {number}
     */
    width = 180;

    /**
     * Rendered height in pixels.
     *
     * @type {number}
     */
    height = 60;
    // #endregion

    /**
     * Creates a status bar, preloads its sprites and sets its initial value.
     *
     * @param {string[]} images - The six sprites of the bar, from 0 to 100 percent.
     * @param {number} x - Horizontal position on the screen.
     * @param {number} y - Vertical position on the screen.
     * @param {number} percentage - Initial fill level in percent.
     */
    constructor(images, x, y, percentage) {
        super();
        this.images = images;
        this.loadImages(this.images);
        this.x = x;
        this.y = y;
        this.setPercentage(percentage);
    }

    /**
     * Sets the fill level and swaps the sprite accordingly.
     *
     * The sprite is taken from the image cache, so the bar updates without
     * any loading delay.
     *
     * @param {number} percentage - New fill level in percent (0–100).
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.images[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Maps the current fill level to a sprite index.
     *
     * Rounds down to the next of the six steps, so any value below 20 percent
     * shows the empty bar and only exactly 100 shows the full one.
     *
     * @returns {number} Index into {@link StatusBar#images} (0–5).
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}