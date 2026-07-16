import { SoundError } from '../models/soundError.class.js';

export class SoundHub {
    // #region sound properties
    static muted = false;
    static backgroundMusic = new Audio('./assets/audio/background/2024-02-19_-_Mexican_Cowboys_-_www.FesliyanStudios.com.mp3');
    static characterJump = new Audio('./assets/audio/character/characterJump.wav');
    static characterRun = new Audio('./assets/audio/character/characterRun.mp3');
    static characterDamage = new Audio('./assets/audio/character/characterDamage.mp3');
    static characterDead = new Audio('./assets/audio/character/characterDead.wav');
    static characterSnoring = new Audio('./assets/audio/character/characterSnoring.mp3');
    static chickenDead = new Audio('./assets/audio/chicken/chickenDead.mp3');
    static chickenDead2 = new Audio('./assets/audio/chicken/chickenDead2.mp3');
    static collectCoin = new Audio('./assets/audio/collectibles/collectSound.wav');
    static collectBottle = new Audio('./assets/audio/collectibles/bottleCollectSound.wav');
    static bossApproach = new Audio('./assets/audio/endboss/endbossApproach.wav');
    static bottleBreak = new Audio('./assets/audio/throwable/bottleBreak.mp3');
    static gameOverSound = new Audio("./assets/audio/gameover/audley_fergine-game-over-classic-206486.mp3");
    static fullHealth = new Audio("./assets/audio/fullhealth/freesound_community-health-pickup-6860.mp3");
    static winSound = new Audio("./assets/audio/winscreen/grumpynora-con-carne-10-sec-edit-565758.mp3");
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

    static play(sound) {
        if (SoundHub.muted) return;
        if (!sound.paused) return;
        SoundError.playOne(sound);
    }

    static pause(sound) {
        SoundError.pauseOne(sound);
    }

    static pauseAll() {
        SoundHub.allSounds.forEach(sound => SoundError.pauseOne(sound));
    }

    static setVolume(volume) {
        SoundHub.allSounds.forEach(sound => sound.volume = volume);
    }

    static toggleMute() {
        SoundHub.muted = !SoundHub.muted;
        SoundHub.allSounds.forEach(sound => {
            sound.muted = SoundHub.muted;
        });
    }

    static restart(sound) {
        sound.pause();
        sound.currentTime = 0;
        SoundError.playOne(sound);
    }

    static setMusicVolume(volume) {
        SoundHub.backgroundMusic.volume = volume;
    }

    static {
        SoundHub.backgroundMusic.loop = true;
        SoundHub.characterSnoring.loop = true;
        SoundHub.backgroundMusic.volume = 0.2;
        SoundHub.characterRun.volume = 0.2;
        SoundHub.characterJump.volume = 0.2;
    }

    static play(sound) {
        if (!sound) return;
        if (SoundHub.muted) return;
        if (!sound.paused) return;
        SoundError.playOne(sound);
    }
}