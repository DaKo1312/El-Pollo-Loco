import { SoundError } from '../models/soundError.class.js';

/**
 * Central registry and controller for every audio asset of the game.
 *
 * `SoundHub` is a pure utility class: it is never instantiated and only
 * exposes static members. Each sound is created once as an `Audio` instance
 * and reused globally, so playback, volume and mute state stay consistent
 * across the whole game. All playback calls are routed through
 * {@link SoundError}, which swallows the promise rejections the browser
 * throws when autoplay is blocked or a sound is interrupted.
 *
 * @class
 * @hideconstructor
 *
 * @example
 * // Play a one shot sound
 * SoundHub.play(SoundHub.collectCoin);
 *
 * @example
 * // Toggle the global mute state (e.g. from a HUD button)
 * SoundHub.toggleMute();
 */
export class SoundHub {
    // #region sound properties
    /**
     * Global mute state.
     *
     * `true` means every sound is muted and {@link SoundHub.play} is a no-op.
     * Should only be changed via {@link SoundHub.toggleMute}, which also
     * applies the state to all `Audio` instances.
     *
     * @static
     * @type {boolean}
     */
    static muted = false;

    /**
     * Looping background music of the level.
     *
     * Configured in the static initializer block: `loop = true`, `volume = 0.2`.
     *
     * @static
     * @type {HTMLAudioElement}
     */
    static backgroundMusic = new Audio('./assets/audio/background/2024-02-19_-_Mexican_Cowboys_-_www.FesliyanStudios.com.mp3');

    /**
     * Sound played when the character jumps.
     *
     * @static
     * @type {HTMLAudioElement}
     */
    static characterJump = new Audio('./assets/audio/character/characterJump.wav');

    /**
     * Sound played while the character is running.
     *
     * @static
     * @type {HTMLAudioElement}
     */
    static characterRun = new Audio('./assets/audio/character/characterRun.mp3');

    /**
     * Sound played when the character takes damage.
     *
     * @static
     * @type {HTMLAudioElement}
     */
    static characterDamage = new Audio('./assets/audio/character/characterDamage.mp3');

    /**
     * Sound played when the character dies.
     *
     * @static
     * @type {HTMLAudioElement}
     */
    static characterDead = new Audio('./assets/audio/character/characterDead.wav');

    /**
     * Looping snoring sound of the long idle animation.
     *
     * @static
     * @type {HTMLAudioElement}
     */
    static characterSnoring = new Audio('./assets/audio/character/characterSnoring.mp3');

    /**
     * Death sound of a chicken (first variant).
     *
     * @static
     * @type {HTMLAudioElement}
     */
    static chickenDead = new Audio('./assets/audio/chicken/chickenDead.mp3');

    /**
     * Death sound of a chicken (second variant, for sound variation).
     *
     * @static
     * @type {HTMLAudioElement}
     */
    static chickenDead2 = new Audio('./assets/audio/chicken/chickenDead2.mp3');

    /**
     * Sound played when a coin is collected.
     *
     * @static
     * @type {HTMLAudioElement}
     */
    static collectCoin = new Audio('./assets/audio/collectibles/collectSound.wav');

    /**
     * Sound played when a salsa bottle is collected.
     *
     * @static
     * @type {HTMLAudioElement}
     */
    static collectBottle = new Audio('./assets/audio/collectibles/bottleCollectSound.wav');

    /**
     * Sound played when the endboss is triggered and approaches.
     *
     * @static
     * @type {HTMLAudioElement}
     */
    static bossApproach = new Audio('./assets/audio/endboss/endbossApproach.wav');

    /**
     * Sound played when a thrown bottle hits something and breaks.
     *
     * @static
     * @type {HTMLAudioElement}
     */
    static bottleBreak = new Audio('./assets/audio/throwable/bottleBreak.mp3');

    /**
     * Sound played on the game over screen.
     *
     * @static
     * @type {HTMLAudioElement}
     */
    static gameOverSound = new Audio("./assets/audio/gameover/audley_fergine-game-over-classic-206486.mp3");

    /**
     * Sound played when the character health is restored to full.
     *
     * @static
     * @type {HTMLAudioElement}
     */
    static fullHealth = new Audio("./assets/audio/fullhealth/freesound_community-health-pickup-6860.mp3");

    /**
     * Sound played on the win screen.
     *
     * @static
     * @type {HTMLAudioElement}
     */
    static winSound = new Audio("./assets/audio/winscreen/grumpynora-con-carne-10-sec-edit-565758.mp3");

    /**
     * Collection of every sound of the game.
     *
     * Used by the bulk operations {@link SoundHub.pauseAll},
     * {@link SoundHub.setVolume} and {@link SoundHub.toggleMute}. A new sound
     * must be added here, otherwise it is not affected by mute or volume changes.
     *
     * @static
     * @type {HTMLAudioElement[]}
     */
    static allSounds = [
        SoundHub.backgroundMusic,
        SoundHub.characterJump,
        SoundHub.characterRun,
        SoundHub.characterDamage,
        SoundHub.characterDead,
        SoundHub.characterSnoring,
        SoundHub.chickenDead,
        SoundHub.chickenDead2,
        SoundHub.collectCoin,
        SoundHub.collectBottle,
        SoundHub.bossApproach,
        SoundHub.bottleBreak,
        SoundHub.winSound,
        SoundHub.fullHealth,
        SoundHub.gameOverSound
    ];
    // #endregion

    /**
     * Overridden by the second `play` definition at the bottom of the class.
     *
     * Kept for reference only; JavaScript uses the last definition of a
     * static method, so this implementation is never executed.
     *
     * @static
     * @ignore
     * @param {HTMLAudioElement} sound - Sound to play.
     * @returns {void}
     */
    static play(sound) {
        if (SoundHub.muted) return;
        if (!sound.paused) return;
        SoundError.playOne(sound);
    }

    /**
     * Pauses a single sound.
     *
     * The current playback position is kept, so a later
     * {@link SoundHub.play} resumes instead of restarting.
     *
     * @static
     * @param {HTMLAudioElement} sound - Sound to pause.
     * @returns {void}
     */
    static pause(sound) {
        SoundError.pauseOne(sound);
    }

    /**
     * Pauses every sound listed in {@link SoundHub.allSounds}.
     *
     * Typically used on game over, on win or when the game is restarted.
     *
     * @static
     * @returns {void}
     */
    static pauseAll() {
        SoundHub.allSounds.forEach(sound => SoundError.pauseOne(sound));
    }

    /**
     * Sets the volume of every sound listed in {@link SoundHub.allSounds}.
     *
     * Overwrites the individual volumes defined in the static initializer
     * block (e.g. the reduced background music volume).
     *
     * @static
     * @param {number} volume - Volume between `0` (silent) and `1` (full).
     * @returns {void}
     */
    static setVolume(volume) {
        SoundHub.allSounds.forEach(sound => sound.volume = volume);
    }

    /**
     * Toggles the global mute state and applies it to every sound.
     *
     * Muted sounds keep playing silently; playback is not stopped. New calls
     * to {@link SoundHub.play} are ignored while muted.
     *
     * @static
     * @returns {void}
     */
    static toggleMute() {
        SoundHub.muted = !SoundHub.muted;
        SoundHub.allSounds.forEach(sound => {
            sound.muted = SoundHub.muted;
        });
    }

    /**
     * Restarts a sound from the beginning.
     *
     * Useful for short sounds that can be triggered again while still
     * playing (e.g. repeated hits). Ignores the global mute state, since the
     * `Audio` instances are muted individually by {@link SoundHub.toggleMute}.
     *
     * @static
     * @param {HTMLAudioElement} sound - Sound to restart.
     * @returns {void}
     */
    static restart(sound) {
        sound.pause();
        sound.currentTime = 0;
        SoundError.playOne(sound);
    }

    /**
     * Sets the volume of the background music only.
     *
     * @static
     * @param {number} volume - Volume between `0` (silent) and `1` (full).
     * @returns {void}
     */
    static setMusicVolume(volume) {
        SoundHub.backgroundMusic.volume = volume;
    }

    /**
     * Static initializer block: base configuration of the audio instances.
     *
     * Enables looping for the background music and the snoring sound and
     * lowers the volume of the permanently audible sounds so that they do
     * not cover the effect sounds. Runs once when the class is evaluated.
     */
    static {
        SoundHub.backgroundMusic.loop = true;
        SoundHub.characterSnoring.loop = true;
        SoundHub.backgroundMusic.volume = 0.2;
        SoundHub.characterRun.volume = 0.2;
        SoundHub.characterJump.volume = 0.2;
    }

    /**
     * Plays a sound, respecting the global mute state.
     *
     * This is the effective `play` implementation: it overrides the earlier
     * definition in this class. The call is skipped when no sound is passed,
     * when the game is muted or when the sound is already playing, which
     * prevents restarting a running sound. Playback itself is delegated to
     * {@link SoundError.playOne} so that blocked autoplay does not throw.
     *
     * @static
     * @param {HTMLAudioElement} [sound] - Sound to play. Falsy values are ignored.
     * @returns {void}
     *
     * @example
     * SoundHub.play(SoundHub.characterJump);
     */
    static play(sound) {
        if (!sound) return;
        if (SoundHub.muted) return;
        if (!sound.paused) return;
        SoundError.playOne(sound);
    }
}