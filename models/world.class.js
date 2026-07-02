import { Character } from './character.class.js';
import { level1 } from "../levels/level1.js";
import { IntervalHub } from '../helper/interval_helper.class.js';
import { StatusBar } from "./status_bar.class.js";
import { ImageHub } from "../helper/image_helper.class.js";
import { ThrowableObject } from "./throwable_object.class.js";
import { Endboss } from "./endboss.class.js";

export class World {
    // #region world properties
    character = new Character();
    canvas;
    ctx;
    keyboard;
    level = level1;
    camera_x = 0;
    statusBar = new StatusBar(ImageHub.STATUSBAR.health, 20, 5);
    coinStatusBar = new StatusBar(ImageHub.STATUSBAR.coin, 20, 55);
    flaskStatusBar = new StatusBar(ImageHub.STATUSBAR.flask, 20, 105);  
    throwableObjects = [];
    endboss = null;
    gameEnded = false;
    // #endregion

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
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
        this.checkBossActivation();
        this.statusBar.setPercentage(this.character.energy);
    }

    checkEnemyCollisions() {
        IntervalHub.startInterval(() => {
            this.level.enemies.forEach((enemy) => {
                if (this.character.isColliding(enemy)) {
                    this.character.hit(enemy.damage);
                    this.checkGameOver();
                    }
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
    
    checkBossActivation() {
        IntervalHub.startInterval(() => {
            if (!this.endboss) {
                return;
            }
            if (!this.endboss.isActivated && this.character.x >= 6450) {
                this.endboss.activate();
            }
        }, 100);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectToMap(this.level.backgroundObjects);
        this.addObjectToMap(this.level.clouds);
        this.addObjectToMap(this.level.coins);
        this.addObjectToMap(this.level.flasks);
        this.addObjectToMap(this.level.enemies);
        this.addToMap(this.character);
        this.addObjectToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.flaskStatusBar);

        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
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
        setTimeout(() => {
            IntervalHub.stopAllIntervals();
            document
                .getElementById("game_over_screen")
                .classList.remove("hidden");
        }, 2000);
    }
}