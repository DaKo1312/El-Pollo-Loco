import {MovableObject} from './movables_object.class.js';
import {ImageHelper} from '../helper/image_helper.class.js';

export class Character extends MovableObject {
    height = 290;
    y = 145;
    speed = 10;
    
    currentImage = 0;
    imagesIdle = ImageHelper.PEPE.idle;
    imagesIdleLong = ImageHelper.PEPE.idle_long;
    imagesWalk = ImageHelper.PEPE.walk;
    world;

    constructor() {
        super();
        this.loadImage(this.imagesWalk[0]);
        this.loadImages(this.imagesWalk);
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.world.keyboard.RIGHT) {
                this.x += this.speed;
            }
            if (this.world.keyboard.LEFT) {
                this.x -= this.speed;
            }
        }, 1000/60);

        setInterval(() => {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                let i = this.currentImage % this.imagesWalk.length;
                let path = this.imagesWalk[i];
                this.img = this.imageCache[path];
                this.currentImage ++;
            }
    }, 50);
    }

    jump() {
    }
}