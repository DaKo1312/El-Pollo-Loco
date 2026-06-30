import { World } from '../models/world.class.js';
import { GameKeyboard } from '../models/keyboard.class.js';

let canvas;
let world;
let keyboard = new GameKeyboard();

function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
    world.startGame();
    document.getElementById("start_button").style.display = "none";
}

window.addEventListener("load", () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = "assets/img/10_intro_outro_screens/start/startscreen_2.png";
    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    document.getElementById("start_button")
    .addEventListener("click", init);
});

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
