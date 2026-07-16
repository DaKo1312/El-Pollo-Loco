/**
 * @file Bootstrap and UI controller of the game.
 *
 * This module wires the DOM to the game logic. It renders the overlay
 * templates, registers all button, keyboard and touch listeners, controls
 * the screen flow (welcome â†’ start â†’ game â†’ win/game over) and creates and
 * destroys the {@link World} instance. It is the only place that touches the
 * DOM directly; the game itself communicates through the shared
 * {@link GameKeyboard} instance.
 */

import { World } from '../models/world.class.js';
import { GameKeyboard } from '../models/keyboard.class.js';
import { IntervalHub } from "../helper/interval_helper.class.js";
import { welcomeSoundTemplate, startScreenTemplate, howToPlayTemplate, gameOverTemplate, winScreenTemplate } from './template.js';
import { SoundHub } from '../helper/sound_helper.class.js';

/**
 * Reference to the game canvas element.
 *
 * Assigned in {@link init} and passed to the {@link World} instance.
 *
 * @type {HTMLCanvasElement|undefined}
 */
let canvas;

/**
 * The currently running game world.
 *
 * `null` or `undefined` while no game is running (start screen, game over,
 * win screen). Reset by {@link restartGame} and {@link goHome} so the old
 * world can be garbage collected.
 *
 * @type {World|null|undefined}
 */
let world;

/**
 * Shared keyboard state of the game.
 *
 * Created once and reused across all worlds. Written by the keyboard and
 * touch listeners, read by the character inside the game loop.
 *
 * @type {GameKeyboard}
 */
let keyboard = new GameKeyboard();

/**
 * Starts a new game.
 *
 * Hides the start screen, shows the in-game controls, starts the background
 * music and creates a fresh {@link World} bound to the canvas and the shared
 * keyboard.
 *
 * @returns {void}
 */
function init() {
    document.getElementById("start_screen").classList.add("hidden");
    canvas = document.getElementById("canvas");
    document.getElementById("game_sound_container").classList.remove("hidden");
    document.getElementById("mobile_controls").classList.add("active");
    SoundHub.play(SoundHub.backgroundMusic);
    world = new World(canvas, keyboard);
    world.startGame();
}

/**
 * Restarts the game from the beginning.
 *
 * Stops every registered interval, tears down the current world, hides all
 * end screens, restarts the background music and calls {@link init} for a
 * clean new run.
 *
 * @returns {void}
 */
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

/**
 * Returns to the start screen.
 *
 * Stops the game loop, discards the current world, hides all overlays and
 * in-game controls and draws the start screen image onto the canvas again.
 *
 * @returns {void}
 */
function goHome() {
    IntervalHub.stopAllIntervals();
    if (world) world.isRunning = false;
    document.getElementById("game_over_screen").classList.add("hidden");
    document.getElementById("win_screen").classList.add("hidden");
    document.getElementById("how_to_play_screen").classList.add("hidden");
    document.getElementById("start_screen").classList.remove("hidden");
    document.getElementById("game_sound_container").classList.add("hidden");
    document.getElementById("mobile_controls").classList.add("hidden");
    world = null;
    renderStartScreen();
}

/**
 * Renders every overlay template into the DOM and sets its initial state.
 *
 * Only the welcome sound overlay stays visible; all other overlays are
 * marked as `hidden` and are shown later by the according handlers.
 *
 * @returns {void}
 */
function renderTemplates() {
    document.getElementById("welcome_sound_screen").innerHTML = welcomeSoundTemplate();
    document.getElementById("start_screen").innerHTML = startScreenTemplate();
    document.getElementById("how_to_play_screen").innerHTML = howToPlayTemplate();
    document.getElementById("game_over_screen").innerHTML = gameOverTemplate();
    document.getElementById("win_screen").innerHTML = winScreenTemplate();
    document.getElementById("welcome_sound_screen").className = "overlay";
    document.getElementById("start_screen").className = "overlay hidden";
    document.getElementById("how_to_play_screen").className = "overlay hidden";
    document.getElementById("game_over_screen").className = "overlay hidden";
    document.getElementById("win_screen").className = "overlay hidden";
}

/**
 * Entry point of the application.
 *
 * Runs once the page has loaded: renders the templates, draws the start
 * screen, registers all listeners, restores the persisted mute state from
 * `localStorage` and starts the background music.
 *
 * @listens window#load
 */
window.addEventListener("load", () => {
    renderTemplates();
    renderStartScreen();
    registerButtons();
    registerMobileControls();
    const muted = localStorage.getItem("muted") === "true";
    if (muted) {
        document.getElementById("sound_button").classList.add("muted");
        document.getElementById("game_sound_button").classList.add("muted");
        SoundHub.toggleMute();
    }
    SoundHub.play(SoundHub.backgroundMusic);
});

/**
 * Draws the start screen image onto the canvas.
 *
 * The image is drawn asynchronously once it has finished loading and is
 * scaled to the full canvas size.
 *
 * @returns {void}
 */
function renderStartScreen() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = "assets/img/10_intro_outro_screens/start/startscreen_2.png";
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

/**
 * Shows the "how to play" overlay.
 *
 * @returns {void}
 */
function openHowToPlay() {
    document.getElementById("how_to_play_screen").classList.remove("hidden");
}

/**
 * Hides the "how to play" overlay.
 *
 * @returns {void}
 */
function closeHowToPlay() {
    document.getElementById("how_to_play_screen").classList.add("hidden");
}

/**
 * Toggles the global mute state and syncs it with the UI and storage.
 *
 * Updates both sound buttons (start screen and in-game), flips the state in
 * {@link SoundHub} and persists it in `localStorage` so it survives a reload.
 *
 * @returns {void}
 */
function toggleSound() {
    document.getElementById("sound_button").classList.toggle("muted");
    document.getElementById("game_sound_button").classList.toggle("muted");
    SoundHub.toggleMute();
    localStorage.setItem("muted", SoundHub.muted);
}

/**
 * Registers the click listeners of every UI button.
 *
 * Called once on page load. Home and restart buttons exist on several
 * overlays and are therefore bound via their shared CSS class.
 *
 * @returns {void}
 */
function registerButtons() {
    document.getElementById("welcome_sound_button").addEventListener("click", closeWelcomeSound);
    document.getElementById("start_button").addEventListener("click", init);
    document.getElementById("how_to_play_button").addEventListener("click", openHowToPlay);
    document.getElementById("close_how_to_play_button").addEventListener("click", closeHowToPlay);
    document.getElementById("sound_button").addEventListener("click", toggleSound);
    document.querySelectorAll(".home_button").forEach(button => button.addEventListener("click", goHome));
    document.querySelectorAll(".restart_button").forEach(button => button.addEventListener("click", restartGame));
    document.getElementById("fullscreen_button").addEventListener("click", toggleFullscreen);
    document.getElementById("music_volume").addEventListener("input", updateMusicVolume);
    document.getElementById("game_sound_button").addEventListener("click", toggleSound);
}

/**
 * Sets the according keyboard flag when a control key is pressed.
 *
 * Supported keys: arrow left/right (movement), space (jump), D (throw bottle).
 *
 * @listens window#keydown
 * @param {KeyboardEvent} e - The keydown event.
 */
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

/**
 * Clears the according keyboard flag when a control key is released.
 *
 * @listens window#keyup
 * @param {KeyboardEvent} e - The keyup event.
 */
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

/**
 * Binds all on-screen touch buttons to their keyboard keys.
 *
 * @returns {void}
 */
function registerMobileControls() {
    registerTouchButton("mobile_left", "LEFT");
    registerTouchButton("mobile_right", "RIGHT");
    registerTouchButton("mobile_jump", "SPACE");
    registerTouchButton("mobile_throw", "D");
}

/**
 * Binds a single touch button to a key of the shared keyboard state.
 *
 * `touchstart` sets the flag and prevents the browser default (scrolling,
 * zooming, simulated mouse events); `touchend` and `touchcancel` clear it
 * again, so the character stops even if the touch is interrupted by the
 * system.
 *
 * @param {string} id - Id of the button element.
 * @param {'LEFT'|'RIGHT'|'SPACE'|'D'} key - Key of {@link GameKeyboard} to control.
 * @returns {void}
 */
function registerTouchButton(id, key) {
    const button = document.getElementById(id);

    button.addEventListener("touchstart", (e) => {
        e.preventDefault();
        button.classList.add("pressed");
        keyboard[key] = true;
    });

    button.addEventListener("touchend", () => {
        button.classList.remove("pressed");
        keyboard[key] = false;
    });

    button.addEventListener("touchcancel", () => {
        button.classList.remove("pressed");
        keyboard[key] = false;
    });
}

/**
 * Toggles fullscreen mode for the game container.
 *
 * Enters fullscreen when none is active, otherwise leaves it. The
 * `webkit`-prefixed calls are the fallback for Safari and older WebKit
 * browsers.
 *
 * @returns {void}
 */
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

/**
 * Closes the welcome sound overlay and reveals the start screen.
 *
 * This is the first user interaction of the page and therefore the point at
 * which browsers allow audio playback, so the background music is started
 * here.
 *
 * @returns {void}
 */
function closeWelcomeSound() {
    document.getElementById("welcome_sound_screen").classList.add("hidden");
    document.getElementById("start_screen").classList.remove("hidden");
    SoundHub.play(SoundHub.backgroundMusic);
}

/**
 * Applies the music volume slider value to the background music.
 *
 * Converts the slider range (0â€“100) to the `Audio` volume range (0â€“1).
 *
 * @param {Event} event - Input event of the volume slider.
 * @returns {void}
 */
function updateMusicVolume(event) {
    SoundHub.setMusicVolume(event.target.value / 100);
}