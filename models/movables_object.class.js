import {ImageHelper} from '../helper/image_helper.class.js';

export class MovableObject {
    x = 20;
    y = 285;
    height = 150;
    width = 100;
    img;
    imageCache = {};
    imagesIdle = ImageHelper.PEPE.idle;
    imagesIdleLong = ImageHelper.PEPE.idle_long;
    imagesWalk = ImageHelper.PEPE.walk;


    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
    arr.forEach((path) => {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
    });
}

    moveRight() {
        console.log('Moving right');
    }

    moveLeft() {
        console.log('Moving left');
    }
}