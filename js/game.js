import { World } from '../models/world.class.js';
import { GameKeyboard } from '../models/keyboard.class.js';
import { startScreenTemplate, howToPlayTemplate, gameOverTemplate, winScreenTemplate } from './template.js';

let canvas;
let world;
let keyboard = new GameKeyboard();

function init() {
    document.getElementById("start_screen").classList.add("hidden");
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
    world.startGame();
}

function restartGame() {
    location.reload();
}

function renderTemplates() {
    document.getElementById("start_screen").innerHTML = startScreenTemplate();
    document.getElementById("game_over_screen").innerHTML = gameOverTemplate();
    document.getElementById("win_screen").innerHTML = winScreenTemplate();
    document.getElementById("how_to_play_screen").innerHTML = howToPlayTemplate();
}

window.addEventListener("load", () => {
    renderTemplates();
    renderStartScreen();
    registerButtons();
});

function renderStartScreen() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = "assets/img/10_intro_outro_screens/start/startscreen_2.png";
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

function registerButtons() {
    document.getElementById("start_button").addEventListener("click", init);
    document.getElementById("fullscreen_button").addEventListener("click", toggleFullscreen);
}

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

function toggleFullscreen() {
    let fullscreen = document.getElementById("fullscreen");
    if (!document.fullscreenElement) {
        if (fullscreen.requestFullscreen) {
            fullscreen.requestFullscreen();
        } else if (fullscreen.webkitRequestFullscreen) {
            fullscreen.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}
