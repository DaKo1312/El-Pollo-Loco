import { MovableObject } from "./movables_object.class.js";
import { IntervalHub } from "../helper/interval_helper.class.js";
import { SoundHub } from '../helper/sound_helper.class.js';

/**
 * Base class of the walking chicken enemies.
 *
 * Provides the random start position, the movement and animation loops and
 * the death handling shared by {@link Chicken} and {@link SmallChicken}.
 * Subclasses only supply their sprites (`imagesWalk`, `imagesDead`), their
 * dimensions and their speed. The endboss does not inherit from this class;
 * it brings its own, more complex state machine.
 *
 * @class
 * @extends MovableObject
 */
export class Enemy extends MovableObject {
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
     * Damage dealt to the character on contact.
     *
     * @type {number}
     */
    damage = 10;

    /**
     * Whether the enemy has been defeated.
     *
     * Field, not the inherited method: read as a property inside this class.
     * Stops movement and animation and freezes the death sprite.
     *
     * @type {boolean}
     */
    isDead = false;

    /**
     * Whether the enemy is currently walking.
     *
     * @type {boolean}
     */
    isWalking = true;

    /**
     * Reserved flag for a looping enemy sound.
     *
     * Currently unused; the death sound is a one shot triggered in
     * {@link Enemy#hit}.
     *
     * @type {boolean}
     */
    runSoundPlaying = false;

    /**
     * Creates an enemy at a random position in the level.
     *
     * The x position spans roughly 200 to 6200, so the enemies are spread
     * across the whole level but never spawn on top of the character.
     * Sprites and speed are set by the subclasses.
     */
    constructor() {
        super();
        this.x = 200 + Math.random() * 6000;
    }

    /**
     * Starts the movement and the animation loop.
     *
     * Movement runs at 60 FPS, the walk animation at 8 FPS. Both loops idle
     * once the enemy is dead, which freezes it in place on its death sprite.
     *
     * @returns {void}
     */
    animate() {
        IntervalHub.startInterval(() => {
            if (!this.isDead && this.isWalking) {
                this.x -= this.speed;
            }
        }, 1000 / 60);
        IntervalHub.startInterval(() => {
            if (!this.isDead && this.isWalking) {
                this.playAnimation(this.imagesWalk);
            }
        }, 1000 / 8);
    }

    /**
     * Starts the enemy.
     *
     * Called by the world once the game starts.
     *
     * @returns {void}
     */
    start() {
        this.animate();
        }

    /**
     * Defeats the enemy.
     *
     * Called when the character stomps it or hits it with a bottle. Marks the
     * enemy as dead, plays the death sound and switches to the death sprite.
     * Repeated calls are ignored, so the sound cannot stack. Removing the
     * enemy from the level is up to the world.
     *
     * @returns {void}
     */
    hit() {
        if (this.isDead) return;

        this.isDead = true;
        SoundHub.play(SoundHub.chickenDead);
        this.loadImage(this.imagesDead[0]);
    }
}