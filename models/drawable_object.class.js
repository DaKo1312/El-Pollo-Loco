/**
 * Base class of every object that is drawn onto the canvas.
 *
 * Provides image loading, the image cache used by the animations and the
 * drawing itself. It is never instantiated directly: characters, enemies,
 * items, background tiles and status bars inherit from it, either directly
 * or through {@link MovableObject}.
 *
 * @class
 */
export class DrawableObject {
    // #region drawable properties
    /**
     * The image currently drawn.
     *
     * Set by {@link DrawableObject#loadImage} and swapped by the animation
     * logic of the subclasses.
     *
     * @type {HTMLImageElement|undefined}
     */
    img;

    /**
     * Cache of all preloaded images, keyed by their path.
     *
     * Filled by {@link DrawableObject#loadImages}. The animations read from
     * this cache, so no image has to be loaded during the running game, which
     * would cause flickering.
     *
     * @type {Object<string, HTMLImageElement>}
     */
    imageCache = {};

    /**
     * Index of the currently displayed animation frame.
     *
     * @type {number}
     */
    currentImage = 0;

    /**
     * Horizontal position on the canvas.
     *
     * @type {number}
     */
    x = 20;

    /**
     * Vertical position on the canvas.
     *
     * @type {number}
     */
    y = 285;

    /**
     * Rendered height in pixels.
     *
     * @type {number}
     */
    height = 150;

    /**
     * Rendered width in pixels.
     *
     * @type {number}
     */
    width = 100;
    // #endregion

    /**
     * Loads a single image and sets it as the current one.
     *
     * Loading is asynchronous: the image is drawn only once the browser has
     * finished loading it.
     *
     * @param {string} path - Path of the image.
     * @returns {void}
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Preloads a set of images into the image cache.
     *
     * Call this for every animation of an object during construction, so the
     * frames are available when the animation starts.
     *
     * @param {string[]} arr - Paths of the images to preload.
     * @returns {void}
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the current image onto the canvas.
     *
     * The image is scaled to {@link DrawableObject#width} and
     * {@link DrawableObject#height}.
     *
     * @param {CanvasRenderingContext2D} ctx - Rendering context of the canvas.
     * @returns {void}
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Draws the collision box as a blue frame (debug helper).
     *
     * Does nothing unless the object sets `showFrame` to `true`. Requires an
     * `offset` object on the instance, which is provided by the subclasses
     * that use collisions.
     *
     * @param {CanvasRenderingContext2D} ctx - Rendering context of the canvas.
     * @returns {void}
     */
    drawFrame(ctx) {
        if (!this.showFrame) return;
        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.strokeStyle = "blue";
        ctx.rect(
            this.x + this.offset.left,
            this.y + this.offset.top,
            this.width - this.offset.left - this.offset.right,
            this.height - this.offset.top - this.offset.bottom
        );
        ctx.stroke();
    }
}