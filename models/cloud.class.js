import {MovableObject} from './movables_object.class.js';

export class Cloud extends MovableObject {
    y = 5;
    height = 450;
    width = 1500;
    

    constructor() {
        super().loadImage('assets/img/5_background/layers/4_clouds/full.png');

        this.x = Math.random() *500;
        this.animate();
    }

    animate() {
        this.moveLeft();
    }
}