import { Character } from './character.class.js';
import { level1 } from "../levels/level1.js";
import { IntervalHub } from '../helper/interval_helper.class.js';
import { StatusBar } from "./status_bar.class.js";
import { ImageHelper } from "../helper/image_helper.class.js";

export class World {
    // #region world properties
    character = new Character();
    canvas;
    ctx;
    keyboard;
    level = level1;
    camera_x = 0;
    statusBar = new StatusBar(ImageHelper.STATUSBAR.health, 20, 5);
    coinStatusBar = new StatusBar(ImageHelper.STATUSBAR.coin, 20, 55);
    flaskStatusBar = new StatusBar(ImageHelper.STATUSBAR.flask, 20, 105);  
    // #endregion

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
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
        this.statusBar.setPercentage(this.character.energy);
    }

    checkEnemyCollisions() {
        IntervalHub.startInterval(() => {
            this.level.enemies.forEach((enemy) => {
                if (this.character.isColliding(enemy)) {
                    this.character.hit();
                }
            });
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

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectToMap(this.level.backgroundObjects);
        this.addObjectToMap(this.level.clouds);
        this.addObjectToMap(this.level.coins);
        this.addObjectToMap(this.level.flasks);
        this.addToMap(this.character);
        this.addObjectToMap(this.level.enemies);
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
}