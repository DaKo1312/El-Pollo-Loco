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

export function howToPlayTemplate() {
    return `
        <div class="how_to_play_content">
            <h2>HOW TO PLAY</h2>
            <div class="controls">
                <div class="control_row">
                    <span class="key">←</span>
                    <span>Move Left</span>
                </div>
                <div class="control_row">
                    <span class="key">→</span>
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

export function gameOverTemplate() {
    return `
        <img src="assets/img/You won, you lost/You lost b.png">
        <div class="overlay_buttons">
            <button class="home_button">
                HOME
            </button>
            <button class="restart_button">
                RESTART
            </button>
        </div>
    `;
}

export function winScreenTemplate() {
    return `
        <img src="assets/img/You won, you lost/You Win A.png">
        <div class="overlay_buttons">
            <button class="home_button">
                HOME
            </button>
            <button class="restart_button">
                RESTART
            </button>
        </div>
    `;
}