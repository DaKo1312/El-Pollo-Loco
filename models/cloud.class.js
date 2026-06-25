import {MovableObject} from './movables_object.class.js';

export class Cloud extends MovableObject {
    y = 10;
    height = 450;
    width = 1500;

    constructor() {
        super().loadImage('assets/img/5_background/layers/4_clouds/full.png',);

        this.x = Math.random() *500;
        this.animate();
    }

    animate() {
        setInterval( () => {
            this.x -= 0.2;
        }, 1000/60)

    }
}