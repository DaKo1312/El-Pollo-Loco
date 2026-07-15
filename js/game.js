import { World } from '../models/world.class.js';
import { GameKeyboard } from '../models/keyboard.class.js';
import { IntervalHub } from "../helper/interval_helper.class.js";
import { startScreenTemplate, howToPlayTemplate, gameOverTemplate, winScreenTemplate } from './template.js';
import { SoundHub } from '../helper/sound_helper.class.js';

let canvas;
let world;
let keyboard = new GameKeyboard();

function init() {
    document.getElementById("start_screen").classList.add("hidden");
    canvas = document.getElementById("canvas");
    document.getElementById("game_sound_button").classList.remove("hidden");
    SoundHub.play(SoundHub.backgroundMusic);
    world = new World(canvas, keyboard);
    world.startGame();
}

function restartGame() {
    IntervalHub.stopAllIntervals();
    if (world) {
        world.isRunning = false;
        world = null;
    }
    document.getElementById("game_over_screen").classList.add("hidden");
    document.getElementById("win_screen").classList.add("hidden");
    document.getElementById("how_to_play_screen").classList.add("hidden");
    SoundHub.restart(SoundHub.backgroundMusic);
    init();
}

function goHome() {
    IntervalHub.stopAllIntervals();
    if (world) world.isRunning = false;
    document.getElementById("game_over_screen").classList.add("hidden");
    document.getElementById("win_screen").classList.add("hidden");
    document.getElementById("how_to_play_screen").classList.add("hidden");
    document.getElementById("start_screen").classList.remove("hidden");
    document.getElementById("game_sound_button").classList.add("hidden");
    world = null;
    renderStartScreen();
}

function renderTemplates() {
    document.getElementById("start_screen").innerHTML = startScreenTemplate();
    document.getElementById("how_to_play_screen").innerHTML = howToPlayTemplate();
    document.getElementById("game_over_screen").innerHTML = gameOverTemplate();
    document.getElementById("win_screen").innerHTML = winScreenTemplate();
    document.getElementById("start_screen").className = "overlay";
    document.getElementById("how_to_play_screen").className = "overlay hidden";
    document.getElementById("game_over_screen").className = "overlay hidden";
    document.getElementById("win_screen").className = "overlay hidden";
}

window.addEventListener("load", () => {
    renderTemplates();
    renderStartScreen();
    registerButtons();
    SoundHub.play(SoundHub.backgroundMusic);
});

function renderStartScreen() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = "assets/img/10_intro_outro_screens/start/startscreen_2.png";
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

function openHowToPlay() {
    document.getElementById("how_to_play_screen").classList.remove("hidden");
}

function closeHowToPlay() {
    document.getElementById("how_to_play_screen").classList.add("hidden");
}

function toggleSound() {
    document.getElementById("sound_button").classList.toggle("muted");
    document.getElementById("game_sound_button").classList.toggle("muted");
    SoundHub.toggleMute();
}

function registerButtons() {
    document.getElementById("start_button").addEventListener("click", init);
    document.getElementById("how_to_play_button").addEventListener("click", openHowToPlay);
    document.getElementById("close_how_to_play_button").addEventListener("click", closeHowToPlay);
    document.getElementById("sound_button").addEventListener("click", toggleSound);
    document.querySelectorAll(".home_button").forEach(button => button.addEventListener("click", goHome));
    document.querySelectorAll(".restart_button").forEach(button => button.addEventListener("click", restartGame));
    document.getElementById("fullscreen_button").addEventListener("click", toggleFullscreen);
    document.getElementById("game_sound_button").addEventListener("click", toggleSound);
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
