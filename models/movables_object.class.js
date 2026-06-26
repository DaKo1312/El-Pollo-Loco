import { ImageHelper } from '../helper/image_helper.class.js';

export class MovableObject {
    // #region movableObjects properties
    x = 20;
    y = 285;
    height = 150;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;
    speed = 0.2;
    otherDirection = false;
    // #endregion

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

    }

    moveLeft() {
        setInterval( () => {
            this.x -= this.speed;
        }, 1000/60)
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}