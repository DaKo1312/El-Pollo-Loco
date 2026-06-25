import {Character} from './character.class.js';
import {Cloud} from './cloud.class.js';
import {Chicken} from './chicken.class.js';
import {BackgroundObject} from './background_object.class.js';
import {ImageHelper} from '../helper/image_helper.class.js';

export class World {
    character = new Character();
    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken(),
    ];
    clouds = [
        new Cloud()
    ];
    
    backgroundObjects = [
        new BackgroundObject(ImageHelper.BACKGROUND.air, 0),
        new BackgroundObject(ImageHelper.BACKGROUND.thirdLayer[0], 0),
        new BackgroundObject(ImageHelper.BACKGROUND.secondLayer[0], 0),
        new BackgroundObject(ImageHelper.BACKGROUND.firstLayer[0], 0),
    ];
    canvas;
    ctx;

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.addObjectToMap(this.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectToMap(this.clouds);
        this.addObjectToMap(this.enemies);

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
    this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
}
}