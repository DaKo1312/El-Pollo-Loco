import { Character } from './character.class.js';
import { createLevel1 } from "../levels/level1.js";
import { IntervalHub } from '../helper/interval_helper.class.js';
import { StatusBar } from "./status_bar.class.js";
import { ImageHub } from "../helper/image_helper.class.js";
import { ThrowableObject } from "./throwable_object.class.js";
import { Endboss } from "./endboss.class.js";
import { SoundHub } from '../helper/sound_helper.class.js';

/**
 * The game world: renderer, collision system and game state in one.
 *
 * Owns the character, the level, the status bars and the thrown bottles,
 * connects them to each other and runs the two loops the game is built on:
 * the render loop, driven by `requestAnimationFrame` in {@link World#draw},
 * and a set of collision intervals registered with {@link IntervalHub}. It is
 * also the only game object that touches the DOM, namely to show the win and
 * the game over overlay.
 *
 * A world is created per run and discarded on restart, so its state
 * (`gameEnded`, `hasWon`, collected items) never has to be reset.
 *
 * @class
 */
export class World {
    // #region world properties
    /**
     * The playable character.
     *
     * @type {Character}
     */
    character = new Character();

    /**
     * The canvas the game is drawn on.
     *
     * @type {HTMLCanvasElement}
     */
    canvas;

    /**
     * Rendering context of the canvas.
     *
     * @type {CanvasRenderingContext2D}
     */
    ctx;

    /**
     * Shared keyboard state, read for the throw input.
     *
     * @type {import('./keyboard.class.js').GameKeyboard}
     */
    keyboard;

    /**
     * The level with all of its objects.
     *
     * Created fresh per world, so enemies and items are randomised again on
     * every restart.
     *
     * @type {import('./level.class.js').Level}
     */
    level = createLevel1();

    /**
     * Horizontal camera offset.
     *
     * Updated by the character and applied as a canvas translation, which
     * separates world space from screen space during drawing.
     *
     * @type {number}
     */
    camera_x = 0;

    /**
     * Health bar of the character.
     *
     * @type {StatusBar}
     */
    statusBar = new StatusBar(ImageHub.STATUSBAR.health, 20, 5);

    /**
     * Coin bar of the character.
     *
     * @type {StatusBar}
     */
    coinStatusBar = new StatusBar(ImageHub.STATUSBAR.coin, 20, 55);

    /**
     * Bottle bar of the character.
     *
     * @type {StatusBar}
     */
    flaskStatusBar = new StatusBar(ImageHub.STATUSBAR.flask, 20, 105);

    /**
     * Health bar of the endboss.
     *
     * Only drawn once the boss has been activated.
     *
     * @type {StatusBar}
     */
    endbossStatusBar = new StatusBar(ImageHub.BOSSBAR.health, 500, 15, 100);

    /**
     * The bottles currently in flight or splashing.
     *
     * Bottles add themselves on throw and remove themselves once their splash
     * animation has finished.
     *
     * @type {ThrowableObject[]}
     */
    throwableObjects = [];

    /**
     * The endboss of the level.
     *
     * Looked up from the enemy list in the constructor and kept as a
     * shortcut, since it is needed for activation, the win check and its
     * status bar.
     *
     * @type {Endboss|null}
     */
    endboss = null;

    /**
     * Whether the game has ended in a loss.
     *
     * Guards {@link World#gameOver} against running more than once.
     *
     * @type {boolean}
     */
    gameEnded = false;

    /**
     * Whether the game has been won.
     *
     * Guards the win handling against running more than once.
     *
     * @type {boolean}
     */
    hasWon = false;

    /**
     * Timestamp until which the "FULL HEALTH" text is shown.
     *
     * @type {number}
     */
    healthFullUntil = 0;

    /**
     * Timestamp at which the "FULL HEALTH" text appeared.
     *
     * @type {number}
     */
    healthFullStart = 0;
    // #endregion

    /**
     * Creates the world and starts rendering.
     *
     * Wires the objects together, caches the endboss, registers the collision
     * intervals and starts the render loop. The objects themselves are not
     * animated yet; that happens in {@link World#startGame}.
     *
     * @param {HTMLCanvasElement} canvas - The game canvas.
     * @param {import('./keyboard.class.js').GameKeyboard} keyboard - The shared keyboard state.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        /**
         * Whether the render loop is running.
         *
         * Set to `false` from the outside to tear the world down: the next
         * frame then returns early instead of scheduling another one.
         *
         * @type {boolean}
         */
        this.isRunning = true;
        this.setWorld();
        this.endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        this.checkCollisions();
        this.draw();
    }

    /**
     * Gives the character and every enemy a back reference to this world.
     *
     * They need it to read the keyboard, move the camera and update the
     * status bars.
     *
     * @returns {void}
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
    }

    /**
     * Registers every collision and game state interval.
     *
     * Note that this is called both from the constructor and from
     * {@link World#startGame}, so each of these intervals ends up running
     * twice per game.
     *
     * @returns {void}
     */
    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkCoinCollisions();
        this.checkFlaskCollisions();
        this.checkThrowableObjects();
        this.checkThrowableObjectCollisions();
        this.checkBossActivation();
        this.checkWin();
        this.statusBar.setPercentage(this.character.energy);
    }

    /**
     * Watches for contact between the character and the enemies (every 100 ms).
     *
     * Also runs the game over check, so a lethal hit is picked up in the same
     * tick.
     *
     * @returns {void}
     */
    checkEnemyCollisions() {
        IntervalHub.startInterval(() => {
            this.level.enemies.forEach((enemy) => {
                this.handleEnemyCollision(enemy);
            });
            this.checkGameOver();
        }, 100);
    }

    /**
     * Watches for collected coins (every 100 ms).
     *
     * Collected coins are filtered out of the level, which removes them from
     * both the drawing and the collision checks.
     *
     * @returns {void}
     */
    checkCoinCollisions() {
        IntervalHub.startInterval(() => {
            this.level.coins = this.level.coins.filter((coin) => {
                if (this.character.isColliding(coin)) {
                    if (this.character.coins < 5) {
                        this.character.collectCoin();
                        return false;
                    }
                }
                return true;
            });
        }, 100);
    }

    /**
     * Watches for collected bottles (every 100 ms).
     *
     * The inventory is capped at five bottles: once full, bottles stay in the
     * level and can be picked up later.
     *
     * @returns {void}
     */
    checkFlaskCollisions() {
        IntervalHub.startInterval(() => {
            this.level.flasks = this.level.flasks.filter((flask) => {
                if (this.character.isColliding(flask)) {
                    if (this.character.flasks < 5) {
                        this.character.collectFlask();
                        return false;
                    }
                }
                return true;
            });
        }, 100);
    }

    /**
     * Watches for the throw input (every 100 ms).
     *
     * Spawns a bottle slightly in front of the character, decreases the
     * inventory and clears the D flag, which forces the player to press the
     * key again for each throw.
     *
     * The bar is updated with a factor of 10 here, while
     * {@link Character#collectFlask} uses 20.
     *
     * @returns {void}
     */
    checkThrowableObjects() {
        IntervalHub.startInterval(() => {
            if (this.keyboard.D && this.character.flasks > 0) {
                this.throwableObjects.push(
                    new ThrowableObject(
                        this.character.x + 50,
                        this.character.y + 100,
                        this
                    )
                );
                this.character.flasks--;
                this.flaskStatusBar.setPercentage(this.character.flasks * 10);
                this.keyboard.D = false;
            }
        }, 100);
    }

    /**
     * Watches for bottle hits on enemies (60 FPS).
     *
     * Runs at frame rate rather than every 100 ms, because a flying bottle
     * would otherwise pass through an enemy between two checks.
     *
     * @returns {void}
     */
    checkThrowableObjectCollisions() {
        IntervalHub.startInterval(() => {
            this.throwableObjects.forEach((flask) => {
                this.checkThrowableObjectCollision(flask);
            });
        }, 1000 / 60);
    }

    /**
     * Checks a single bottle against every enemy.
     *
     * Splashing bottles are skipped, so one bottle can only ever hit once.
     *
     * @param {ThrowableObject} flask - The bottle to check.
     * @returns {void}
     */
    checkThrowableObjectCollision(flask) {
        if (flask.isSplashing) {
            return;
        }
        this.level.enemies.forEach((enemy) => {
            this.handleThrowableObjectHit(flask, enemy);
        });
    }

    /**
     * Handles a bottle hitting one specific enemy.
     *
     * Dead enemies and misses are ignored. On a hit the bottle switches to
     * its splash state, the breaking sound plays and the damage is applied.
     *
     * @param {ThrowableObject} flask - The bottle.
     * @param {import('./enemy.class.js').Enemy|Endboss} enemy - The enemy that was hit.
     * @returns {void}
     */
    handleThrowableObjectHit(flask, enemy) {
        if (enemy.isDead || !flask.isColliding(enemy)) {
            return;
        }
        flask.isSplashing = true;
        SoundHub.play(SoundHub.bottleBreak);
        this.damageEnemy(enemy);
    }

    /**
     * Applies bottle damage to an enemy.
     *
     * The endboss takes 20 damage per bottle and updates its status bar;
     * chickens die from a single hit.
     *
     * @param {import('./enemy.class.js').Enemy|Endboss} enemy - The enemy to damage.
     * @returns {void}
     */
    damageEnemy(enemy) {
        if (enemy instanceof Endboss) {
            enemy.hit(20);
            this.endbossStatusBar.setPercentage(enemy.energy);
            return;
        }
        enemy.hit();
        if (enemy.energy <= 0) {
            enemy.isDead = true;
        }
    }

    /**
     * Watches for the boss trigger zone (every 100 ms).
     *
     * Once the character passes x = 6450, the boss is activated and its
     * approach sound is played. The activation itself is guarded inside the
     * boss, so it can only happen once.
     *
     * @returns {void}
     */
    checkBossActivation() {
        IntervalHub.startInterval(() => {
            if (!this.endboss) return;
            if (!this.endboss.isActivated && this.character.x >= 6450) {
                this.endboss.activate();
                SoundHub.play(SoundHub.bossApproach);
                this.showBossStatusBar = true;
            }
        }, 100);
    }

    /**
     * Watches for the win condition (every 100 ms).
     *
     * The game is won once the boss is dead. Stops the music, plays the win
     * sound and shows the win overlay. The intervals are stopped two seconds
     * later, which lets the boss finish its death animation.
     *
     * @returns {void}
     */
    checkWin() {
        IntervalHub.startInterval(() => {
            if (this.hasWon) return;
            if (!this.endboss.isDead) return;
            this.hasWon = true;
            SoundHub.pause(SoundHub.backgroundMusic);
            SoundHub.play(SoundHub.winSound);
            document.getElementById("mobile_controls").classList.add("hidden");
            document.getElementById("win_screen").classList.remove("hidden");
            setTimeout(() => {
                IntervalHub.stopAllIntervals();
            }, 2000);
        }, 100);
    }

    /**
     * Renders one frame and schedules the next one.
     *
     * Draws in two passes: everything between the two camera translations
     * lives in world space and scrolls with the character, everything after
     * them is screen space and stays fixed, which is what the status bars
     * need. Within the world pass the order defines the depth, from the
     * background up to the thrown bottles.
     *
     * The loop ends as soon as {@link World#isRunning} is `false`.
     *
     * @returns {void}
     */
    draw() {
        if (!this.isRunning) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectToMap(this.level.backgroundObjects);
        this.addObjectToMap(this.level.clouds);
        this.addObjectToMap(this.level.coins);
        this.addObjectToMap(this.level.flasks);
        this.addObjectToMap(this.level.enemies);
        this.addToMap(this.character);
        this.drawHealthFull();
        this.addObjectToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.flaskStatusBar);
        if (this.endboss && this.endboss.isActivated) this.addToMap(this.endbossStatusBar);
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Draws a list of objects onto the canvas.
     *
     * @param {import('./drawable_object.class.js').DrawableObject[]} objects - The objects to draw.
     * @returns {void}
     */
    addObjectToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        })
    }

    /**
     * Draws a single object, mirroring it if it faces left.
     *
     * Mirroring flips the canvas horizontally, which requires inverting the
     * object's x position as well. Both the flip and the position are undone
     * afterwards, so the object keeps its real coordinates for the collision
     * checks.
     *
     * @param {import('./drawable_object.class.js').DrawableObject} mo - The object to draw.
     * @returns {void}
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1);
            mo.x = mo.x * -1;
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        if (mo.otherDirection) {
            mo.x = mo.x * -1;
            this.ctx.restore();
        }
    }

    /**
     * Starts the game.
     *
     * Animates the character, the walking enemies and the clouds. The endboss
     * is skipped on purpose: it starts itself once it is activated.
     *
     * @returns {void}
     */
    startGame() {
        this.character.start();
        this.level.enemies.forEach(enemy => {
            if (!(enemy instanceof Endboss)) {
                enemy.start();
            }
        });
        this.level.clouds.forEach(cloud => {
            cloud.start();
        });
        this.checkCollisions();
    }

    /**
     * Checks whether the character has run out of energy.
     *
     * @returns {void}
     */
    checkGameOver() {
        if (!this.gameEnded && this.character.energy <= 0) {
            this.gameEnded = true;
            this.gameOver();
        }
    }

    /**
     * Ends the game with a loss.
     *
     * Stops the music, plays the game over sound and shows the overlay two
     * seconds later, which leaves room for the death animation before the
     * intervals are stopped.
     *
     * @returns {void}
     */
    gameOver() {
        this.gameEnded = true;
        SoundHub.pause(SoundHub.backgroundMusic);
        SoundHub.play(SoundHub.gameOverSound);
        setTimeout(() => {
            IntervalHub.stopAllIntervals();
            document.getElementById("mobile_controls").classList.add("hidden");
            document.getElementById("game_over_screen").classList.remove("hidden");
        }, 2000);
    }

    /**
     * Handles the contact between the character and one enemy.
     *
     * The endboss always damages the character; chickens die when stomped
     * from above and damage the character otherwise. Dead enemies are
     * harmless.
     *
     * @param {import('./enemy.class.js').Enemy|Endboss} enemy - The enemy in contact.
     * @returns {void}
     */
    handleEnemyCollision(enemy) {
        if (enemy.isDead) {
            return;
        }
        if (!this.character.isColliding(enemy)) {
            return;
        }
        if (enemy instanceof Endboss) {
            this.character.hit(enemy.damage);
            return;
        }
        if (this.character.isJumpingOn(enemy)) {
            enemy.hit();
            this.character.bounce();
        } else {
            this.character.hit(enemy.damage);
        }
    }

    /**
     * Checks a single bottle against every enemy.
     *
     * Not called anywhere; superseded by
     * {@link World#checkThrowableObjectCollision}.
     *
     * @deprecated Unused duplicate. Kept for reference.
     * @param {ThrowableObject} flask - The bottle to check.
     * @returns {void}
     */
    checkFlaskCollision(flask) {
        if (flask.isSplashing) {
            return;
        }
        this.level.enemies.forEach((enemy) => {
            this.handleFlaskHit(flask, enemy);
        });
    }

    /**
     * Handles a bottle hitting one enemy.
     *
     * Not called anywhere; superseded by
     * {@link World#handleThrowableObjectHit}, which additionally plays the
     * breaking sound.
     *
     * @deprecated Unused duplicate. Kept for reference.
     * @param {ThrowableObject} flask - The bottle.
     * @param {import('./enemy.class.js').Enemy|Endboss} enemy - The enemy that was hit.
     * @returns {void}
     */
    handleFlaskHit(flask, enemy) {
        if (enemy.isDead || !flask.isColliding(enemy)) {
            return;
        }
        this.damageEnemy(enemy);
        flask.isSplashing = true;
    }

    /**
     * Damages the endboss and updates its status bar.
     *
     * Not called anywhere; {@link World#damageEnemy} covers this case.
     *
     * @deprecated Unused duplicate. Kept for reference.
     * @param {Endboss} enemy - The endboss.
     * @returns {void}
     */
    hitEndboss(enemy) {
        enemy.hit(20);
        this.endbossStatusBar.setPercentage(enemy.energy);
    }

    /**
     * Triggers the "FULL HEALTH" feedback above the character.
     *
     * Called by the character once five coins have restored its health.
     *
     * @returns {void}
     */
    showHealthFull() {
        this.healthFullStart = Date.now();
        this.healthFullUntil = this.healthFullStart + 1000;
    }

    /**
     * Draws the "FULL HEALTH" text above the character.
     *
     * The text floats upwards while fading out and is drawn in world space,
     * so it follows the character. Rendering is skipped once the display
     * window has passed.
     *
     * Note that the progress is divided by 2000 while the window lasts
     * 1000 ms, so the text disappears at about half its opacity.
     *
     * @returns {void}
     */
    drawHealthFull() {
        if (Date.now() > this.healthFullUntil) return;
        const progress = (Date.now() - this.healthFullStart) / 2000;
        const alpha = 1 - progress;
        const x = this.character.x + this.character.width / 2;
        const y = this.character.y + 140 - progress * 30;
        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        this.ctx.font = "20px Zabars";
        this.ctx.fillStyle = "#4CAF50";
        this.ctx.textAlign = "center";
        this.ctx.fillText("FULL HEALTH", x, y);
        this.ctx.restore();
    }
}