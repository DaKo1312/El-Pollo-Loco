/**
 * Safe wrapper around the playback methods of the Audio API.
 *
 * `Audio.play()` returns a promise that browsers reject whenever playback is
 * blocked — most notably when autoplay is denied before the first user
 * interaction, or when a sound is interrupted by a new `play()` call. An
 * unhandled rejection would show up as an error in the console without any
 * benefit for the player, so every playback of {@link SoundHub} is routed
 * through this class instead of calling `play()` directly.
 *
 * The class is a pure utility: it is never instantiated and holds no state.
 *
 * @class
 * @hideconstructor
 */
export class SoundError {

    /**
     * Plays a sound from its beginning and swallows playback errors.
     *
     * Resetting `currentTime` makes short effect sounds retriggerable. The
     * empty catch block is intentional: a blocked or interrupted playback is
     * an expected browser behaviour, not an application error.
     *
     * @static
     * @param {HTMLAudioElement} sound - Sound to play.
     * @returns {void}
     */
    static playOne(sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }

    /**
     * Pauses a sound.
     *
     * Wrapper for symmetry with {@link SoundError.playOne}; `pause()` returns
     * no promise and therefore needs no error handling. The playback position
     * is kept.
     *
     * @static
     * @param {HTMLAudioElement} sound - Sound to pause.
     * @returns {void}
     */
    static pauseOne(sound) {
        sound.pause();
    }
}