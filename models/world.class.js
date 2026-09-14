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
 * Owns the character, level, status bars and thrown bottles, runs the render
 * loop and the collision intervals, and shows the win/game over overlays.
 *
 * @class
 */
export class World {
    // #region world properties
    /** The playable character. @type {Character} */
    character = new Character();

    /** The canvas the game is drawn on. @type {HTMLCanvasElement} */
    canvas;

    /** Rendering context of the canvas. @type {CanvasRenderingContext2D} */
    ctx;

    /** Shared keyboard state, read for the throw input. @type {GameKeyboard} */
    keyboard;

    /** The level with all of its objects (recreated per world). @type {Level} */
    level = new createLevel1();

    /** Horizontal camera offset, applied as a canvas translation. @type {number} */
    camera_x = 0;

    /** Health bar of the character. @type {StatusBar} */
    statusBar = new StatusBar(ImageHub.STATUSBAR.health, 20, 5);

    /** Coin bar of the character. @type {StatusBar} */
    coinStatusBar = new StatusBar(ImageHub.STATUSBAR.coin, 20, 55);

    /** Bottle bar of the character. @type {StatusBar} */
    flaskStatusBar = new StatusBar(ImageHub.STATUSBAR.flask, 20, 105);

    /** Health bar of the endboss (drawn once the boss is activated). @type {StatusBar} */
    endbossStatusBar = new StatusBar(ImageHub.BOSSBAR.health, 500, 15, 100);

    /** Bottles currently in flight or splashing. @type {ThrowableObject[]} */
    throwableObjects = [];

    /** The endboss of the level, cached from the enemy list. @type {Endboss|null} */
    endboss = null;

    /** Whether the game has ended in a loss (guards gameOver). @type {boolean} */
    gameEnded = false;

    /** Whether the game has been won (guards the win handling). @type {boolean} */
    hasWon = false;

    /** Timestamp until which the "FULL HEALTH" text is shown. @type {number} */
    healthFullUntil = 0;

    /** Timestamp at which the "FULL HEALTH" text appeared. @type {number} */
    healthFullStart = 0;

    /**
     * Character position that triggers the boss fight and its health bar.
     *
     * Chosen so the boss is just entering the right edge of the canvas when it
     * wakes up, which leaves the player the full alert animation to react.
     *
     * @type {number}
     */
    bossTriggerX = 6200;
    // #endregion

    /**
     * Creates the world, wires objects together and starts rendering.
     *
     * @param {HTMLCanvasElement} canvas - The game canvas.
     * @param {GameKeyboard} keyboard - The shared keyboard state.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        /** @type {boolean} Whether the render loop is running. */
        this.isRunning = true;
        this.setWorld();
        this.endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        this.checkCollisions();
        this.draw();
    }

    /**
     * Gives the character and every enemy a back reference to this world.
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
     * Called from the constructor and from startGame, so each interval ends
     * up running twice per game.
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
     * Watches for contact between the character and the enemies, and runs the
     * game over check in the same tick.
     *
     * @returns {void}
     */
    checkEnemyCollisions() {
        IntervalHub.startInterval(() => {
            this.level.enemies.forEach((enemy) => {
                this.handleEnemyCollision(enemy);
            });
            this.checkGameOver();
        }, 1000/60);
    }

    /**
     * Watches for collected coins and filters them out of the level.
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
     * Watches for collected bottles; the inventory is capped at five.
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
     * Watches for the throw input, spawns a bottle and clears the D flag so
     * the key must be pressed again for each throw.
     *
     * @returns {void}
     */
    checkThrowableObjects() {
        IntervalHub.startInterval(() => {
            if (this.keyboard.D && this.character.flasks > 0) {
                this.throwableObjects.push(this.createThrowableObject());
                this.character.flasks--;
                this.flaskStatusBar.setPercentage(this.character.flasks * 10);
                this.keyboard.D = false;
            }
        }, 100);
    }

    /**
     * Creates a bottle in front of the character, on the side it faces.
     *
     * The spawn position is mirrored around the character's center, so a
     * bottle thrown to the left starts at the same distance from the character
     * as one thrown to the right.
     *
     * @returns {ThrowableObject} The bottle to add to the world.
     */
    createThrowableObject() {
        const throwLeft = this.character.otherDirection;
        const x = throwLeft ? this.character.x - 10 : this.character.x + 50;
        return new ThrowableObject(x, this.character.y + 100, this, throwLeft);
    }

    /**
     * Watches for bottle hits on enemies at frame rate, so a fast bottle
     * cannot pass through an enemy between two checks.
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
     * Checks a single bottle against every enemy; splashing bottles are
     * skipped so one bottle only hits once.
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
     * Handles a bottle hitting one enemy: splash, breaking sound and damage.
     *
     * @param {ThrowableObject} flask - The bottle.
     * @param {Enemy|Endboss} enemy - The enemy that was hit.
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
     * Applies bottle damage: the endboss takes 20 per bottle, chickens die
     * from a single hit.
     *
     * @param {Enemy|Endboss} enemy - The enemy to damage.
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
     * Watches for the boss trigger zone; activates the boss once the
     * character passes {@link World#bossTriggerX}.
     *
     * @returns {void}
     */
    checkBossActivation() {
        IntervalHub.startInterval(() => {
            if (!this.endboss) return;
            if (!this.endboss.isActivated && this.character.x >= this.bossTriggerX) {
                this.endboss.activate();
                SoundHub.play(SoundHub.bossApproach);
                this.showBossStatusBar = true;
            }
        }, 100);
    }

    /**
     * Watches for the win condition (boss dead): stops music, plays the win
     * sound, shows the overlay and stops the intervals two seconds later.
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
     * Draws in two passes: world space (scrolls with the character) between
     * the camera translations, then screen space (fixed) for the status bars.
     * The loop ends as soon as isRunning is false.
     *
     * @returns {void}
     */
    draw() {
        if (!this.isRunning) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(Math.round(this.camera_x), 0);
        this.addObjectToMap(this.level.backgroundObjects);
        this.addObjectToMap(this.level.clouds);
        this.addObjectToMap(this.level.coins);
        this.addObjectToMap(this.level.flasks);
        this.addObjectToMap(this.level.enemies);
        this.addToMap(this.character);
        this.drawHealthFull();
        this.addObjectToMap(this.throwableObjects);
        this.ctx.translate(-Math.round(this.camera_x), 0);
        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.flaskStatusBar);
        if (this.endboss && this.endboss.isActivated) this.addToMap(this.endbossStatusBar);
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Draws a list of objects onto the canvas.
     *
     * @param {DrawableObject[]} objects - The objects to draw.
     * @returns {void}
     */
    addObjectToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        })
    }

    /**
     * Draws a single object, mirroring it (and its x) if it faces left, then
     * undoing the flip so collisions keep the real coordinates.
     *
     * @param {DrawableObject} mo - The object to draw.
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
     * Starts the game: animates the character, the walking enemies and the
     * clouds. The endboss starts itself once activated.
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
     * Ends the game with a loss: stops music, plays the game over sound and
     * shows the overlay two seconds later.
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
     * Handles the contact between the character and one enemy: the endboss
     * always damages, chickens die when stomped and damage otherwise.
     *
     * @param {Enemy|Endboss} enemy - The enemy in contact.
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
     * @deprecated Unused duplicate of checkThrowableObjectCollision.
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
     * @deprecated Unused duplicate of handleThrowableObjectHit.
     * @param {ThrowableObject} flask - The bottle.
     * @param {Enemy|Endboss} enemy - The enemy that was hit.
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
     * @deprecated Unused duplicate; damageEnemy covers this case.
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
     * @returns {void}
     */
    showHealthFull() {
        this.healthFullStart = Date.now();
        this.healthFullUntil = this.healthFullStart + 1000;
    }

    /**
     * Draws the "FULL HEALTH" text above the character while it floats up and
     * fades out. Skipped once the display window has passed.
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