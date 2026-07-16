import { MovableObject } from "./movables_object.class.js";
import { ImageHub } from '../helper/image_helper.class.js';
import { IntervalHub } from "../helper/interval_helper.class.js";

/**
 * The endboss chicken at the end of the level.
 *
 * The boss stays idle until the character reaches its trigger zone and
 * {@link Endboss#activate} is called. It then plays its alert animation,
 * starts walking towards the character and attacks in a fixed rhythm. It can
 * only be damaged by thrown bottles.
 *
 * Unlike {@link MovableObject}, this class does not derive its state from
 * energy and position: it keeps explicit boolean flags (`isAlert`,
 * `isWalking`, `isAttacking`, `isHurt`, `isDead`) that are evaluated in a
 * fixed priority order by {@link Endboss#playCurrentAnimation}. Note that
 * `isHurt` and `isDead` are fields here and therefore shadow the inherited
 * methods of the same name â€” inside this class they must be read as
 * properties, never called.
 *
 * @class
 * @extends MovableObject
 */
export class Endboss extends MovableObject {
    // #region endbosss properties
    /**
     * Frames of the walk animation.
     *
     * @type {string[]}
     */
    imagesWalk = ImageHub.ENDBOSS.walk;

    /**
     * Frames of the alert animation played when the boss is triggered.
     *
     * @type {string[]}
     */
    imagesAlert = ImageHub.ENDBOSS.alert;

    /**
     * Frames of the attack animation.
     *
     * @type {string[]}
     */
    imagesAttack = ImageHub.ENDBOSS.attack;

    /**
     * Frames of the hurt animation.
     *
     * @type {string[]}
     */
    imagesHurt = ImageHub.ENDBOSS.hurt;

    /**
     * Frames of the death animation.
     *
     * @type {string[]}
     */
    imagesDead = ImageHub.ENDBOSS.dead;

    /**
     * Vertical position on the canvas.
     *
     * Negative, because the sprite contains transparent padding at the top.
     *
     * @type {number}
     */
    y = -40;

    /**
     * Horizontal start position at the end of the level.
     *
     * @type {number}
     */
    x = 6750;

    /**
     * Rendered height in pixels.
     *
     * @type {number}
     */
    height = 500;

    /**
     * Rendered width in pixels.
     *
     * @type {number}
     */
    width = 350;

    /**
     * Index of the currently displayed animation frame.
     *
     * @type {number}
     */
    currentImage = 0;

    /**
     * Debug flag: draws the collision frame when `true`.
     *
     * @type {boolean}
     */
    showFrame = false;

    /**
     * Ground level of the boss; the y position it returns to.
     *
     * @type {number}
     */
    groundY = -40;

    /**
     * Whether the boss has already been triggered.
     *
     * Guards {@link Endboss#activate} against running more than once.
     *
     * @type {boolean}
     */
    isActivated = false;

    /**
     * Whether the alert animation is currently playing.
     *
     * @type {boolean}
     */
    isAlert = false;

    /**
     * Whether the boss is walking towards the character.
     *
     * @type {boolean}
     */
    isWalking = false;

    /**
     * Whether an attack is currently running.
     *
     * @type {boolean}
     */
    isAttacking = false;

    /**
     * Movement speed in pixels per tick.
     *
     * @type {number}
     */
    speed = 1;

    /**
     * Damage the boss deals to the character on contact.
     *
     * @type {number}
     */
    damage = 20;

    /**
     * Remaining health, from `100` down to `0`.
     *
     * @type {number}
     */
    energy = 100;

    /**
     * Whether the boss is in its hurt state.
     *
     * Field, not the inherited method: read as a property inside this class.
     *
     * @type {boolean}
     */
    isHurt = false;

    /**
     * Whether the boss is defeated.
     *
     * Field, not the inherited method: read as a property inside this class.
     *
     * @type {boolean}
     */
    isDead = false;

    /**
     * Whether the death animation has reached its last frame.
     *
     * Freezes the animation on that frame instead of looping it.
     *
     * @type {boolean}
     */
    deadAnimationFinished = false;

    /**
     * Frame index of the death animation.
     *
     * Counted separately from {@link Endboss#currentImage}, because the death
     * animation is played once instead of looping.
     *
     * @type {number}
     */
    deadImage = 0;
    // # endregion

    /**
     * Creates the boss and preloads all of its sprites.
     *
     * The animation intervals are started right away, but stay idle until the
     * state flags are set by {@link Endboss#activate}.
     */
    constructor() {
        super();
        this.loadImage(this.imagesAlert[0]);
        this.loadImages(this.imagesAlert);
        this.loadImages(this.imagesWalk);
        this.loadImages(this.imagesAttack);
        this.loadImages(this.imagesHurt);
        this.loadImages(this.imagesDead);
        this.animate();
    }

    /**
     * Starts the three loops of the boss.
     *
     * Movement runs at 60 FPS, the state animation at 8 FPS and the death
     * animation every 500 ms, which gives the death its slow, staged look.
     *
     * @returns {void}
     */
    animate() {
        IntervalHub.startInterval(() => {
            if (this.isWalking && !this.isDead) {
                this.x -= this.speed;
            }
        }, 1000 / 60);
        IntervalHub.startInterval(() => {
            if (!this.isDead) {
                this.playCurrentAnimation();
            }
        }, 1000 / 8);
        IntervalHub.startInterval(() => {
            if (this.isDead) {
                this.playDeadAnimation();
            }
        }, 500);
    }

    /**
     * Plays the animation matching the current state.
     *
     * The order of the checks defines the priority: hurt beats attacking,
     * attacking beats alert, alert beats walking.
     *
     * @returns {void}
     */
    playCurrentAnimation() {
        if (this.isHurt) return this.playAnimation(this.imagesHurt);
        if (this.isAttacking) return this.playAnimation(this.imagesAttack);
        if (this.isAlert) return this.playAnimation(this.imagesAlert);
        if (this.isWalking) this.playAnimation(this.imagesWalk);
    }

    /**
     * Advances the death animation by one frame.
     *
     * Reads directly from the image cache and stops on the last frame, so the
     * defeated boss stays visible instead of restarting the animation.
     *
     * @returns {void}
     */
    playDeadAnimation() {
        if (this.deadAnimationFinished) {
            return;
        }
        this.img = this.imageCache[this.imagesDead[this.deadImage]];
        if (this.deadImage < this.imagesDead.length - 1) {
            this.deadImage++;
        } else {
            this.deadAnimationFinished = true;
        }
    }

    /**
     * Alternative, timeout based single frame step of the death animation.
     *
     * Not called anywhere; superseded by {@link Endboss#playDeadAnimation},
     * which is driven by an interval and uses the image cache instead of
     * reloading the image.
     *
     * @deprecated Unused. Kept for reference.
     * @returns {void}
     */
    playAnimationFrame() {
        this.loadImage(this.imagesDead[this.currentImage]);
        if (this.currentImage < this.imagesDead.length - 1) {
            setTimeout(() => this.currentImage++, 500);
        } else {
            this.deadAnimationFinished = true;
        }
    }

    /**
     * Triggers the boss fight.
     *
     * Called once the character reaches the boss. Plays the alert animation
     * for 1.5 seconds and only then starts walking and attacking, which gives
     * the player time to react. Repeated calls are ignored.
     *
     * @returns {void}
     */
    activate() {
        if (this.isActivated) {
            return;
        }
        this.isActivated = true;
        this.isAlert = true;
        setTimeout(() => {
            this.isAlert = false;
            this.isWalking = true;
            this.start();
        }, 1500);
    }

    /**
     * Starts the fight loops of the boss.
     *
     * Note that {@link Endboss#animate} has already been called in the
     * constructor, so this adds a second set of the same intervals.
     *
     * @returns {void}
     */
    start() {
        this.animate();
        this.startAttacking();
    }

    /**
     * Starts the attack loop.
     *
     * Every 2.5 seconds an attack is triggered, as long as the boss is
     * walking, alive and not already attacking.
     *
     * @returns {void}
     */
    startAttacking() {
        IntervalHub.startInterval(() => {
            if (!this.isWalking || this.isDead || this.isAttacking) {
                return;
            }
            this.attack();
        }, 2500);
    }

    /**
     * Runs a single attack.
     *
     * Resets the frame index so the attack animation starts from its first
     * frame, and ends the attack state after 800 ms.
     *
     * @returns {void}
     */
    attack() {
        this.currentImage = 0;
        this.isAttacking = true;
        setTimeout(() => {
            this.currentImage = 0;
            this.isAttacking = false;
        }, 800);
    }

    /**
     * Applies damage to the boss.
     *
     * Lowers the energy without dropping below zero, shows the hurt animation
     * for 300 ms and marks the boss as dead once the energy is depleted,
     * which hands over to the death animation loop.
     *
     * @param {number} damage - Amount of damage to apply.
     * @returns {void}
     */
    hit(damage) {
        if (this.isDead) {
            return;
        }
        this.energy = Math.max(0, this.energy - damage);
        this.isHurt = true;
        setTimeout(() => {
            this.isHurt = false;
        }, 300);
        if (this.energy === 0) {
            this.deadImage = 0;
            this.isDead = true;
        }
    }
}