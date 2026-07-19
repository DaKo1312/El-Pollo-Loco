/**
 * @file HTML templates of all overlay screens.
 *
 * Each function returns the markup of one overlay as a template string. The
 * templates are injected into their container elements by `renderTemplates()`
 * in the game bootstrap module, which afterwards binds the listeners to the
 * ids and classes defined here. Changing an id or class in this file
 * therefore requires updating the according listener registration.
 */

/**
 * Markup of the start screen menu.
 *
 * Contains the three main menu buttons. The background of the start screen
 * is not part of this template; it is drawn onto the canvas instead.
 *
 * Provided ids: `how_to_play_button`, `start_button`, `sound_button`.
 *
 * @returns {string} HTML markup of the start screen buttons.
 */
export function startScreenTemplate() {
    return `
        <div class="start_buttons">
            <button id="how_to_play_button">
                HOW TO PLAY
            </button>
            <button id="start_button">
                START GAME
            </button>
            <button id="sound_button">
                SOUND
            </button>
        </div>
    `;
}

/**
 * Markup of the "how to play" overlay.
 *
 * Explains the goal of the game and lists the keyboard controls
 * (arrow keys, space, D).
 *
 * Provided id: `close_how_to_play_button`.
 *
 * @returns {string} HTML markup of the instructions overlay.
 */
export function howToPlayTemplate() {
    return `
        <div class="how_to_play_content">
            <h2>HOW TO PLAY</h2>
            <p class="how_to_play_text">
                <strong>Welcome to El Pollo Loco!</strong><br>
                Dive into Pepe's world and battle the crazed chickens on your way to the final boss.
                Jump on enemies or throw bottles to defeat them.
                Only bottles can defeat the boss.
                Collect 5 coins to fully restore your health and conquer the level.
            </p>
            <div class="controls">
                <div class="control_row">
                    <span class="key">&larr;</span>
                    <span>Move Left</span>
                </div>
                <div class="control_row">
                    <span class="key">&rarr;</span>
                    <span>Move Right</span>
                </div>
                <div class="control_row">
                    <span class="key">SPACE</span>
                    <span>Jump</span>
                </div>
                <div class="control_row">
                    <span class="key">D</span>
                    <span>Throw Flask</span>
                </div>
            </div>
            <button id="close_how_to_play_button">
                CLOSE
            </button>
        </div>
    `;
}

/**
 * Markup of the game over overlay.
 *
 * Shows the "you lost" image and the home and restart buttons.
 *
 * Provided classes: `home_button`, `restart_button` (shared with the win
 * screen, therefore bound by class instead of id).
 *
 * @returns {string} HTML markup of the game over screen.
 */
export function gameOverTemplate() {
    return `
        <img src="assets/img/You won, you lost/You lost b.png">
        <div class="start_buttons">
            <button class="home_button">
                HOME
            </button>
            <button class="restart_button">
                RESTART
            </button>
        </div>
    `;
}

/**
 * Markup of the win overlay.
 *
 * Shows the "you win" image and the home and restart buttons.
 *
 * Provided classes: `home_button`, `restart_button` (shared with the game
 * over screen, therefore bound by class instead of id).
 *
 * @returns {string} HTML markup of the win screen.
 */
export function winScreenTemplate() {
    return `
        <img src="assets/img/You won, you lost/You Win A.png">
        <div class="start_buttons">
            <button class="home_button">
                HOME
            </button>
            <button class="restart_button">
                RESTART
            </button>
        </div>
    `;
}

/**
 * Markup of the welcome overlay shown before the start screen.
 *
 * Its button provides the first user interaction of the page, which is what
 * browsers require before audio playback is allowed.
 *
 * Provided id: `welcome_sound_button`.
 *
 * @returns {string} HTML markup of the welcome overlay.
 */
export function welcomeSoundTemplate() {
    return `
        <div class="how_to_play_content">
            <h2>¡Vamos!</h2>
            <p class="how_to_play_text">
                <strong>Ready for a crazy adventure?</strong><br><br>
                Grab your sombrero, collect your bottles and
                get ready to take on the craziest chickens
                you've ever seen.
            </p>
            <button id="welcome_sound_button" class="menu_button">
                VAMOS!
            </button>
        </div>
    `;
}

/**
 * Markup of the "Impressum" (legal notice) overlay.
 *
 * Reuses the how-to-play content box for a consistent look.
 *
 * Provided id: `close_impressum_button`.
 *
 * @returns {string} HTML markup of the Impressum overlay.
 */
export function impressumTemplate() {
    return `
        <div class="how_to_play_content">
            <h2>Impressum</h2>
            <p class="impressum_text">
                <strong>Angaben gem&auml;&szlig; &sect; 5 TMG</strong><br><br>
                Daniel Korbmacher<br>
                Fantasiestrasse 123<br>
                45678 Fantahausen<br><br>
                <strong>Kontakt</strong><br>
                E-Mail: kontakt@el-pollo-loco.de
            </p>
            <button id="close_impressum_button">
                CLOSE
            </button>
        </div>
    `;
}