import {Character} from './character.class.js';
import {Cloud} from './cloud.class.js';
import {Chicken} from './chicken.class.js';
import {BackgroundObject} from './background_object.class.js';
import {ImageHelper} from '../helper/image_helper.class.js';

export class World {
    // #region world properties
    character = new Character();
    enemies = [];
    clouds = [new Cloud()];
    backgroundObjects = [];
    background_width = 720;
    bigChickenAmount = 3;
    smallChickenAmount = 3;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    // #endregion

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.createBackground();
        this.createEnemies();
        this.draw();
        this.setWorld();
    }

    setWorld() {
        this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectToMap(this.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectToMap(this.clouds);
        this.addObjectToMap(this.enemies);
        this.ctx.translate(-this.camera_x, 0);

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
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        if (mo.otherDirection) {
            mo.x = mo.x * -1;
            this.ctx.restore();
        }
    }

    createBackground() {
        for (let i = 0; i < 6; i++) {
            let x = i * this.background_width;
            let imageIndex = i % 2;
            this.backgroundObjects.push(
                new BackgroundObject(ImageHelper.BACKGROUND.air, x),
                new BackgroundObject(ImageHelper.BACKGROUND.thirdLayer[imageIndex], x),
                new BackgroundObject(ImageHelper.BACKGROUND.secondLayer[imageIndex], x),
                new BackgroundObject(ImageHelper.BACKGROUND.firstLayer[imageIndex], x)
            );
        }
    }

    createEnemies() {
        for (let i = 0; i < this.bigChickenAmount; i++) {
            this.enemies.push(new Chicken());
        }

        // for (let i = 0; i < this.smallChickenAmount; i++) {
        //     this.enemies.push(new Chicken());
        // }
    }
}