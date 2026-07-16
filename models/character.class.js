import { MovableObject } from './movables_object.class.js';
import { ImageHub } from '../helper/image_helper.class.js';
import { IntervalHub } from "../helper/interval_helper.class.js";
import { SoundHub } from '../helper/sound_helper.class.js';

/**
 * The playable character "Pepe".
 *
 * Handles movement, animation, sound and the collectables of the player.
 * Two intervals drive the character: {@link Character#animate} runs at 60 FPS
 * and applies the keyboard input and the camera offset, while
 * {@link Character#animateImages} runs at a lower rate and picks the
 * animation and the sounds matching the current state. Both are registered
 * through {@link IntervalHub}, so they are stopped together with the rest of
 * the game.
 *
 * The state is not stored explicitly: it is derived on every tick from
 * energy, vertical speed, keyboard input and the idle time since the last
 * action. The order of the checks in `animateImages` defines the priority
 * (dead â†’ hurt â†’ jumping â†’ walking â†’ long idle â†’ idle).
 *
 * @class
 * @extends MovableObject
 */
export class Character extends MovableObject {
    // #region character properties
    /**
     * Frames of the short idle animation.
     *
     * @type {string[]}
     */
    imagesIdle = ImageHub.PEPE.idle;

    /**
     * Frames of the long idle (sleeping) animation.
     *
     * @type {string[]}
     */
    imagesIdleLong = ImageHub.PEPE.idle_long;

    /**
     * Frames of the walk animation.
     *
     * @type {string[]}
     */
    imagesWalk = ImageHub.PEPE.walk;

    /**
     * Frames of the jump animation.
     *
     * @type {string[]}
     */
    imagesJump = ImageHub.PEPE.jump;

    /**
     * Frames of the hurt animation.
     *
     * @type {string[]}
     */
    imagesHurt = ImageHub.PEPE.hurt;

    /**
     * Frames of the death animation.
     *
     * @type {string[]}
     */
    imagesDead = ImageHub.PEPE.dead;

    /**
     * Rendered height of the character in pixels.
     *
     * @type {number}
     */
    height = 290;

    /**
     * Vertical start position on the canvas.
     *
     * @type {number}
     */
    y = 10;

    /**
     * Horizontal movement speed in pixels per tick.
     *
     * @type {number}
     */
    speed = 5.5;

    /**
     * Index of the currently displayed animation frame.
     *
     * Incremented by `playAnimation` of {@link MovableObject}.
     *
     * @type {number}
     */
    currentImage = 0;

    /**
     * Timestamp of the last player input, in milliseconds.
     *
     * Used to measure the idle time that triggers the idle and the long idle
     * animation.
     *
     * @type {number}
     */
    lastAction = Date.now();

    /**
     * Debug flag: draws the collision frame when `true`.
     *
     * @type {boolean}
     */
    showFrame = false;

    /**
     * Insets of the collision box relative to the image bounds.
     *
     * Compensates the transparent padding of the sprites, so collisions match
     * the visible character instead of the full image rectangle.
     *
     * @type {{top: number, right: number, bottom: number, left: number}}
     */
    offset = {top: 110, right: 20, bottom: 10, left: 25};

    /**
     * Number of currently collected coins.
     *
     * Reset to `0` once five coins have been collected and the health has
     * been restored.
     *
     * @type {number}
     */
    coins = 0;

    /**
     * Number of collected salsa bottles available to throw.
     *
     * @type {number}
     */
    flasks = 0;

    /**
     * Whether the looping snoring sound is currently playing.
     *
     * Prevents restarting the sound on every tick of the long idle animation.
     *
     * @type {boolean}
     */
    snoringPlayed = false;
    // #endregion

    /**
     * Back reference to the game world.
     *
     * Assigned by the world after construction and used to read the keyboard
     * state, to move the camera and to update the status bars.
     *
     * @type {World}
     */
    world;

    /**
     * Creates the character and preloads all of its sprites.
     *
     * Gravity is enabled right away, so the character falls onto the ground
     * before the game loop starts. The animation intervals are not started
     * here; call {@link Character#start} once the world is assigned.
     */
    constructor() {
        super();
        this.loadImage(this.imagesWalk[0]);
        this.loadImages(this.imagesWalk);
        this.loadImages(this.imagesIdle);
        this.loadImages(this.imagesIdleLong);
        this.loadImage(this.imagesJump[0]);
        this.loadImages(this.imagesJump);
        this.loadImages(this.imagesHurt);
        this.loadImages(this.imagesDead);
        this.applyGravity();
    }

    /**
     * Starts the movement and the animation loop of the character.
     *
     * Must be called after {@link Character#world} has been assigned, since
     * both loops read the keyboard state from the world.
     *
     * @returns {void}
     */
    start() {
        this.animate();
        this.animateImages();
    }

    /**
     * Starts the movement loop (60 FPS).
     *
     * Applies the keyboard input: moves right until the level end, left down
     * to `-100`, and jumps only while standing on the ground, which prevents
     * double jumps. Every movement refreshes {@link Character#lastAction}, so
     * the idle timer starts over. Finally the camera is moved with the
     * character, keeping it 100 pixels from the left edge.
     *
     * @returns {void}
     */
    animate() {
        IntervalHub.startInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.x += this.speed;
                this.otherDirection = false;
                this.lastAction = Date.now();
            }
            if (this.world.keyboard.LEFT && this.x > -100) {
                this.x -= this.speed;
                this.otherDirection = true;
                this.lastAction = Date.now();
            }
            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
            }
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);
    }

    /**
     * Starts the animation and sound loop (every 150 ms).
     *
     * Picks the animation for the current state, ordered by priority:
     * dead, hurt, in the air, walking, long idle (after 8 s) and idle
     * (after 3 s). The sound flags `runSoundPlaying`, `deathSoundPlayed` and
     * {@link Character#snoringPlayed} make sure looping and one shot sounds
     * are triggered once per state change instead of on every tick.
     *
     * @returns {void}
     */
    animateImages() {
        IntervalHub.startInterval(() => {
            let idleTime = Date.now() - this.lastAction;
            const isWalking = (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isAboveGround();
            if (!isWalking && this.runSoundPlaying) {
                SoundHub.pause(SoundHub.characterRun);
                this.runSoundPlaying = false;
            }
            if (this.isDead()) {
                if (!this.deathSoundPlayed) {
                    SoundHub.play(SoundHub.characterDead);
                    this.deathSoundPlayed = true;
                }
                SoundHub.pause(SoundHub.characterSnoring);
                this.snoringPlayed = false;
                this.playAnimation(this.imagesDead);
            } else if (this.isHurt()) {
                SoundHub.pause(SoundHub.characterSnoring);
                this.snoringPlayed = false;
                this.playAnimation(this.imagesHurt);
            } else if (this.isAboveGround()) {
                SoundHub.pause(SoundHub.characterSnoring);
                this.snoringPlayed = false;
                this.playAnimation(this.imagesJump);
            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                if (!this.runSoundPlaying) {
                    SoundHub.play(SoundHub.characterRun);
                    this.runSoundPlaying = true;
                } 
                this.playAnimation(this.imagesWalk);
            } else if (idleTime >= 8000) {
                if (!this.snoringPlayed) {
                    SoundHub.characterSnoring.loop = true;
                    SoundHub.play(SoundHub.characterSnoring);
                    this.snoringPlayed = true;
                }
                this.playAnimation(this.imagesIdleLong);
            } else if (idleTime >= 3000) {
                SoundHub.pause(SoundHub.characterSnoring);
                this.snoringPlayed = false;
                this.playAnimation(this.imagesIdle);
            }
        }, 150);
    }

    /**
     * Makes the character jump.
     *
     * Sets the upward speed and plays the jump sound. Gravity from
     * {@link MovableObject} pulls the character back down afterwards.
     *
     * @returns {void}
     */
    jump() {
        this.speedY = 25;
        SoundHub.play(SoundHub.characterJump);
    }

    /**
     * Collects a coin and updates the coin status bar.
     *
     * Every coin fills the bar by 20 percent. With the fifth coin the health
     * is fully restored, the coin counter and its bar are reset and the
     * health status bar and the "full health" feedback are shown.
     *
     * @returns {void}
     */
    collectCoin() {
        this.coins++;
        SoundHub.play(SoundHub.collectCoin);
        this.world.coinStatusBar.setPercentage(this.coins * 20);
        if (this.coins < 5) return;
        this.energy = 100;
        this.coins = 0;
        this.world.statusBar.setPercentage(100);
        this.world.coinStatusBar.setPercentage(0);
        SoundHub.play(SoundHub.fullHealth);
        this.world.showHealthFull();
    }

    /**
     * Collects a salsa bottle and updates the bottle status bar.
     *
     * Every bottle fills the bar by 20 percent.
     *
     * @returns {void}
     */
    collectFlask() {
        this.flasks++;
        SoundHub.play(SoundHub.collectBottle);
        this.world.flaskStatusBar.setPercentage(this.flasks * 20);
    }

    /**
     * Checks whether the character is landing on top of an enemy.
     *
     * Compares the previous and the current bottom edge against the top edge
     * of the enemy and requires a downward movement (`speedY < 0`). Using the
     * previous position prevents tunneling at high falling speeds, while the
     * tolerances keep the hit reliable at 60 FPS.
     *
     * @param {MovableObject} enemy - The enemy to test against.
     * @returns {boolean} `true` if the character stomps the enemy from above.
     */
    isJumpingOn(enemy) {
        const previousBottom = this.lastY + this.height - this.offset.bottom;
        const currentBottom = this.y + this.height - this.offset.bottom;
        const enemyTop = enemy.y + enemy.offset.top + 10;
        return (
            this.speedY < 0 &&
            previousBottom <= enemyTop &&
            currentBottom >= enemyTop - 30
        );
    }

    /**
     * Bounces the character upwards after stomping an enemy.
     *
     * Uses a lower speed than {@link Character#jump}, resulting in a shorter
     * hop.
     *
     * @returns {void}
     */
    bounce() {
        this.speedY = 15;
    }
}