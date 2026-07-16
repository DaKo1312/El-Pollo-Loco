import { ImageHub } from "../helper/image_helper.class.js";
import { IntervalHub } from "../helper/interval_helper.class.js";
import { MovableObject } from "./movables_object.class.js";
import { SoundHub } from '../helper/sound_helper.class.js';

/**
 * A salsa bottle thrown by the character.
 *
 * Created the moment the player throws and removed from the world once its
 * splash animation has finished, so it is the only short lived object of the
 * game. It flies in an arc — a constant horizontal speed combined with the
 * gravity of {@link MovableObject} — rotates while flying and splashes on
 * impact. Bottles are the only way to damage the endboss.
 *
 * All loops are started right from the constructor and are driven by the
 * `isSplashing` flag, which switches the object from its flying to its
 * splashing state.
 *
 * @class
 * @extends MovableObject
 */
export class ThrowableObject extends MovableObject {
    // #region throwableobject
    /**
     * Frames of the rotation animation while flying.
     *
     * @type {string[]}
     */
    imagesRotate = ImageHub.ROTATE.flask;

    /**
     * Frames of the splash animation on impact.
     *
     * @type {string[]}
     */
    imagesSplash = ImageHub.SPLASH.flask;

    /**
     * Whether the bottle has hit the ground and is splashing.
     *
     * Acts as the state switch of the object: it stops the flight, the
     * rotation and any further collision, and starts the splash animation.
     *
     * @type {boolean}
     */
    isSplashing = false;

    /**
     * Debug flag: draws the collision frame when `true`.
     *
     * @type {boolean}
     */
    showFrame = false;

    /**
     * Insets of the collision box relative to the image bounds.
     *
     * @type {{top: number, right: number, bottom: number, left: number}}
     */
    offset = {top: 50, right: 20, bottom: 50, left: 25};
    // #endregion

    /**
     * Creates a bottle and throws it immediately.
     *
     * Unlike the other objects this one is fully self starting: flight,
     * impact check and splash animation all begin here, because the bottle
     * exists only for the duration of a single throw.
     *
     * @param {number} x - Horizontal start position, usually the character's.
     * @param {number} y - Vertical start position, usually the character's.
     * @param {import('./world.class.js').World} world - The world, needed to remove the bottle after the splash.
     */
    constructor(x, y, world) {
        super();
        this.world = world;
        this.loadImage(this.imagesRotate[0]);
        this.loadImages(this.imagesRotate);
        this.loadImages(this.imagesSplash);
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.groundY = 360;
        this.throw();
        this.checkSplash();
        this.playSplashAnimation();
    }

    /**
     * Starts the flight of the bottle.
     *
     * Sets the initial upward speed and enables gravity, which together
     * produce the throwing arc. The horizontal movement runs at 60 FPS, the
     * rotation at 10 FPS. Both stop once the bottle splashes.
     *
     * The bottle always flies to the right; the facing direction of the
     * character is not taken into account.
     *
     * @returns {void}
     */
    throw() {
        this.speedY = 15;
        this.applyGravity();
        IntervalHub.startInterval(() => {
            if (!this.isSplashing) {
                this.x += 8;
            }
        }, 1000 / 60);
        IntervalHub.startInterval(() => {
            if (!this.isSplashing) {
                this.playAnimation(this.imagesRotate);
            }
        }, 100);
    }

    /**
     * Watches for the ground impact (60 FPS).
     *
     * Once the bottle reaches its ground level, the splash state is entered
     * and the breaking sound is played. Hits on enemies are detected by the
     * world instead, not here.
     *
     * @returns {void}
     */
    checkSplash() {
        IntervalHub.startInterval(() => {
            if (!this.isSplashing && this.y >= this.groundY) {
                this.isSplashing = true;
                SoundHub.play(SoundHub.bottleBreak);
            }
        }, 1000 / 60);
    }

    /**
     * Plays the splash animation once and removes the bottle afterwards.
     *
     * The frame counter is a local variable rather than `currentImage`, so
     * the rotation animation cannot interfere with it. After the last frame
     * the bottle removes itself from the world's list of throwable objects,
     * which stops it from being drawn.
     *
     * @returns {void}
     */
    playSplashAnimation() {
        let currentImage = 0;
        IntervalHub.startInterval(() => {
            if (!this.isSplashing) return;
            if (currentImage < this.imagesSplash.length) {
                let path = this.imagesSplash[currentImage];
                this.img = this.imageCache[path];
                currentImage++;
            } else {
                let index = this.world.throwableObjects.indexOf(this);
                if (index > -1) {
                    this.world.throwableObjects.splice(index, 1);
                }
            }
        }, 100);
    }
}