import {World} from '../models/world.class.js';

let canvas;
let world;



function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas);
    
    window.init = init;
}
window.addEventListener('load', init);
