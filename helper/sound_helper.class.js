class SoundHub {
    // Audiodateien für piano, guitar, drums
    static piano = new Audio('./assets/sounds/piano.mp3');
    static guitar = new Audio('./assets/sounds/guitar.mp3');
    static drums = new Audio('./assets/sounds/drums.mp3');

    // Array, das alle definierten Audio-Dateien enthält
    static allSounds = [SoundHub.piano, SoundHub.guitar, SoundHub.drums];


    // Spielt eine einzelne Audiodatei ab
    static playOne(sound, instrumentId) {  // instrumentId nur wichtig für die Visualisierung
        sound.volume = 0.2;  // Setzt die Lautstärke auf 0.2 = 20% / 1 = 100%
        sound.currentTime = 0;  // Startet ab einer bestimmten stelle (0=Anfang/ 5 = 5 sec.)
        sound.play();  // Spielt das übergebene Sound-Objekt ab
        const instrumentImg = document.getElementById(instrumentId);  // nur wichtig für die Visualisierung
        instrumentImg.classList.add('active');  // nur wichtig für die Visualisierung
    }


    // Pausiert das Abspielen aller Audiodateien
    static pauseAll() {
        SoundHub.allSounds.forEach(sound => {
            sound.pause();  // Pausiert jedes Audio in der Liste
        });
        document.getElementById('volume').value = 0.2;  // Setzt den Sound-Slider wieder auf 0.2
        const instrumentImages = document.querySelectorAll('.sound_img'); // nur wichtig für die Visualisierung
        instrumentImages.forEach(img => img.classList.remove('active')); // nur wichtig für die Visualisierung
    }


    // Pausiert das Abspielen einer einzelnen Audiodatei
    static pauseOne(sound, instrumentId) {
        sound.pause();  // Pausiert das übergebene Audio
        const instrumentImg = document.getElementById(instrumentId); // nur wichtig für die Visualisierung
        instrumentImg.classList.remove('active'); // nur wichtig für die Visualisierung
    }


    // ##########################################################################################################################
    // ################################################  Sound Slider - BONUS !  ################################################
    // Setzt die Lautstärke für alle Audiodateien
    static objSetVolume(sounds) {  // sounds ist das array: allSounds welches hier als Parameter ankommt
        let volumeValue = document.getElementById('volume').value;  // Holt den aktuellen Lautstärkewert aus dem Inputfeld
        sounds.forEach(sound => {
            sound.volume = volumeValue;  // Setzt die Lautstärke für jedes Audio wie im Slider angegeben
        });
    }
}