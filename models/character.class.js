import {MovableObject} from './movables_object.class.js';

export class Character extends MovableObject{
    height = 290;
    y = 145;

    currentImage = 0;

    constructor() {
        super();

        this.loadImage(this.imagesWalk[0]);
        this.loadImages(this.imagesWalk);

        this.animate();
    }

    animate() {

        setInterval(() => {
            let i = this.currentImage % this.imagesWalk.length;
            let path = this.imagesWalk[i];
            this.img = this.imageCache[path];
            this.currentImage ++;
        }, 1000/10);
    }

    jump() {
    }
}