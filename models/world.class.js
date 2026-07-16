import { Character } from './character.class.js';
import { createLevel1 } from "../levels/level1.js";
import { IntervalHub } from '../helper/interval_helper.class.js';
import { StatusBar } from "./status_bar.class.js";
import { ImageHub } from "../helper/image_helper.class.js";
import { ThrowableObject } from "./throwable_object.class.js";
import { Endboss } from "./endboss.class.js";
import { SoundHub } from '../helper/sound_helper.class.js';

export class World {
    // #region world properties
    character = new Character();
    canvas;
    ctx;
    keyboard;
    level = createLevel1();
    camera_x = 0;
    statusBar = new StatusBar(ImageHub.STATUSBAR.health, 20, 5);
    coinStatusBar = new StatusBar(ImageHub.STATUSBAR.coin, 20, 55);
    flaskStatusBar = new StatusBar(ImageHub.STATUSBAR.flask, 20, 105);
    endbossStatusBar = new StatusBar(ImageHub.BOSSBAR.health, 500, 15, 100);
    throwableObjects = [];
    endboss = null;
    gameEnded = false;
    hasWon = false;
    healthFullUntil = 0;
    healthFullStart = 0;
    // #endregion

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.isRunning = true;
        this.setWorld();
        this.endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        this.checkCollisions();
        this.draw();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
    }

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

    checkEnemyCollisions() {
        IntervalHub.startInterval(() => {
            this.level.enemies.forEach((enemy) => {
                this.handleEnemyCollision(enemy);
            });
            this.checkGameOver();
        }, 100);
    }

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

    checkThrowableObjectCollisions() {
        IntervalHub.startInterval(() => {
            this.throwableObjects.forEach((flask) => {
                this.checkThrowableObjectCollision(flask);
            });
        }, 1000 / 60);
    }

    checkThrowableObjectCollision(flask) {
        if (flask.isSplashing) {
            return;
        }
        this.level.enemies.forEach((enemy) => {
            this.handleThrowableObjectHit(flask, enemy);
        });
    }

    handleThrowableObjectHit(flask, enemy) {
        if (enemy.isDead || !flask.isColliding(enemy)) {
            return;
        }
        flask.isSplashing = true;
        SoundHub.play(SoundHub.bottleBreak);
        this.damageEnemy(enemy);
    }

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

    addObjectToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        })
    }

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

    checkGameOver() {
        if (!this.gameEnded && this.character.energy <= 0) {
            this.gameEnded = true;
            this.gameOver();
        }
    }

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

    checkFlaskCollision(flask) {
        if (flask.isSplashing) {
            return;
        }
        this.level.enemies.forEach((enemy) => {
            this.handleFlaskHit(flask, enemy);
        });
    }

    handleFlaskHit(flask, enemy) {
        if (enemy.isDead || !flask.isColliding(enemy)) {
            return;
        }
        this.damageEnemy(enemy);
        flask.isSplashing = true;
    }

    hitEndboss(enemy) {
        enemy.hit(20);
        this.endbossStatusBar.setPercentage(enemy.energy);
    }

    showHealthFull() {
        this.healthFullStart = Date.now();
        this.healthFullUntil = this.healthFullStart + 1000;
    }

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