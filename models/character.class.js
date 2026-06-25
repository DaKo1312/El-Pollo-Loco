import {MovableObject} from './movables_object.class.js';

export class Character extends MovableObject{
    height = 290;
    y = 145;

    constructor() {
        super().loadImage('assets/img/2_character_pepe/2_walk/W-21.png');
    }



    jump() {
    }
}