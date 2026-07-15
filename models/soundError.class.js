export class SoundError {

    static playOne(sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }

    static pauseOne(sound) {
        sound.pause();
    }
}