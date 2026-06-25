import {World} from '../models/world.class.js';
import {GameKeyboard} from '../models/keyboard.class.js';

let canvas;
let world;
let keyboard = new GameKeyboard();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    
    window.init = init;
}

window.addEventListener('load', init);

window.addEventListener("keydown", (e) => {
    if (e.code === "ArrowRight") {
        keyboard.RIGHT = true;
    }
    if (e.code === "ArrowLeft") {
        keyboard.LEFT = true;
    }
    if (e.code === "Space") {
        keyboard.SPACE = true;
    }
    if (e.code === "KeyD") {
        keyboard.D = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.code === "ArrowRight") {
        keyboard.RIGHT = false;
    }
    if (e.code === "ArrowLeft") {
        keyboard.LEFT = false;
    }
    if (e.code === "Space") {
        keyboard.SPACE = false;
    }
    if (e.code === "KeyD") {
        keyboard.D = false;
    }
});