import { ImageHub } from '../helper/image_helper.class.js';
import { IntervalHub } from "../helper/interval_helper.class.js";
import { DrawableObject } from './drawable_object.class.js';
import { SoundHub } from '../helper/sound_helper.class.js';

/**
 * Base class of every object that moves or collides.
 *
 * Extends {@link DrawableObject} with gravity, collision detection, health
 * handling and animation playback. Characters, enemies, items, clouds and
 * background tiles inherit from it and override the properties they need
 * (sprites, dimensions, `groundY`, `offset`).
 *
 * State is derived rather than stored: {@link MovableObject#isHurt} and
 * {@link MovableObject#isDead} are computed from the last hit and the
 * remaining energy on every call. Note that {@link Enemy} and {@link Endboss}
 * shadow both with boolean fields of the same name.
 *
 * @class
 * @extends DrawableObject
 */
export class MovableObject extends DrawableObject {
    // #region movableObjects properties
    /**
     * Horizontal movement speed in pixels per tick.
     *
     * @type {number}
     */
    speed = 0.2;

    /**
     * Whether the sprite is mirrored horizontally (facing left).
     *
     * @type {boolean}
     */
    otherDirection = false;

    /**
     * Current vertical speed.
     *
     * Positive means moving up, negative means falling. Set by
     * {@link MovableObject#jump} and reduced by gravity.
     *
     * @type {number}
     */
    speedY = 0;

    /**
     * Gravity applied per gravity tick.
     *
     * @type {number}
     */
    acceleration = 2.5;

    /**
     * Debug flag: draws the collision frame when `true`.
     *
     * @type {boolean}
     */
    showFrame = false;

    /**
     * Ground level of the object; the y position it falls back to.
     *
     * @type {number}
     */
    groundY = 145;

    /**
     * Vertical position of the previous gravity tick.
     *
     * Used for the stomp check, which needs the movement between two frames
     * instead of just the current position.
     *
     * @type {number}
     */
    lastY = 0;

    /**
     * Remaining health, from `100` down to `0`.
     *
     * @type {number}
     */
    energy = 100;

    /**
     * Timestamp of the last hit taken, in milliseconds.
     *
     * @type {number}
     */
    lastHit = 0;

    /**
     * Insets of the collision box relative to the image bounds.
     *
     * Zero by default; subclasses override this to match their sprite
     * padding.
     *
     * @type {{top: number, right: number, bottom: number, left: number}}
     */
    offset = {top: 0, right: 0, bottom: 0, left: 0};
    // #endregion

    /**
     * Starts the gravity loop (25 FPS).
     *
     * Stores the previous y position, moves the object while it is airborne
     * or still rising, and clamps it to the ground level once it lands. The
     * check for `speedY > 0` makes sure a jump starts even from the ground.
     *
     * @returns {void}
     */
    applyGravity() {
        IntervalHub.startInterval(() => {
            this.lastY = this.y;
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
            if (this.y > this.groundY) {
                this.y = this.groundY;
                this.speedY = 0;
            }
        }, 1000 / 25);
    }

    /**
     * Checks whether the object is currently airborne.
     *
     * @returns {boolean} `true` if the object is above its ground level.
     */
    isAboveGround() {
            return this.y < this.groundY;
        }   

    /**
     * Checks whether this object overlaps another one.
     *
     * Compares the two collision boxes, each shrunk by its own `offset`, so
     * the transparent padding of the sprites does not trigger hits.
     *
     * @param {MovableObject} mo - The object to test against.
     * @returns {boolean} `true` if both boxes overlap.
     */
    isColliding(mo) {
    return (
        this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
        this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
        this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
        this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
    }

    /**
     * Applies damage to the object.
     *
     * Ignored while the object is still in its hurt window, which acts as the
     * invulnerability period after a hit. Lowers the energy without dropping
     * below zero, restarts the animation, updates the health status bar and
     * plays the damage sound.
     *
     * Requires a `world` reference on the instance for the status bar update,
     * so in practice this is only called on the character.
     *
     * @param {number} damage - Amount of damage to apply.
     * @returns {void}
     */
    hit(damage) {
        if (!this.isHurt()) {
            this.energy -= damage;
            if (this.energy < 0) this.energy = 0;
            this.currentImage = 0;
            this.lastHit = Date.now();
            this.world.statusBar.setPercentage(this.energy);
            SoundHub.play(SoundHub.characterDamage);
        }
    }

    /**
     * Checks whether the object was hit within the last second.
     *
     * Doubles as the invulnerability window: while `true`, further hits are
     * ignored and the hurt animation is shown.
     *
     * @returns {boolean} `true` if the last hit is less than 1000 ms ago.
     */
    isHurt() {
        let timePassed = Date.now() - this.lastHit;
        return timePassed < 1000;
    }

    /**
     * Checks whether the object has run out of energy.
     *
     * @returns {boolean} `true` if the energy is depleted.
     */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * Starts a continuous leftward movement (60 FPS).
     *
     * The interval is registered with {@link IntervalHub} and runs until the
     * game stops all intervals.
     *
     * @returns {void}
     */
    moveLeft() {
        IntervalHub.startInterval(() => {
        this.x -= this.speed;
        }, 1000 / 60);
    }

    /**
     * Makes the object jump by setting its upward speed.
     *
     * Gravity pulls it back down afterwards. {@link Character} overrides this
     * with its own jump height and sound.
     *
     * @returns {void}
     */
    jump() {
    this.speedY = 18;
    }

    /**
     * Advances a looping animation by one frame.
     *
     * The modulo wraps the frame index, so the animation restarts from the
     * beginning once the last frame is reached. Reads from the image cache,
     * so the frames must have been preloaded.
     *
     * @param {string[]} images - Frames of the animation.
     * @returns {void}
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Advances a one shot animation by one frame.
     *
     * Unlike {@link MovableObject#playAnimation} the animation does not loop:
     * it stops on the last frame and reports completion, which is what death
     * animations need. Reset `currentImage` to `0` before replaying.
     *
     * @param {string[]} images - Frames of the animation.
     * @returns {boolean} `true` once the animation has finished.
     */
    playAnimationOnce(images) {
        if (this.currentImage >= images.length) {
            return true;
        }
        this.img = this.imageCache[images[this.currentImage]];
        this.currentImage++;
        return false;
    }
}