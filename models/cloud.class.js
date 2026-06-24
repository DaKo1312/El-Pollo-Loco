import {MovableObject} from './movables_object.class.js';

export class Cloud extends MovableObject {
    y = 20;
    height = 250;
    width = 1000;

    constructor() {
        super().loadImage('assets/img/5_background/layers/4_clouds/full.png');

        this.x = -50 + Math.random()*500;
    }
}