/**
 * @typedef {string[]} SpriteSet
 * A list of image paths that form one animation sequence.
 * The order of the entries equals the playback order of the frames.
 */

/**
 * Central registry for every image asset used by the game.
 *
 * `ImageHub` is a pure lookup class: it is never instantiated and holds no
 * state. All members are `static` and expose plain objects whose properties
 * are arrays of image paths (see {@link SpriteSet}). Consumers such as
 * characters, enemies, items and status bars read these arrays to preload
 * and to play their animations.
 *
 * All paths are relative to the project root.
 *
 * @class
 * @hideconstructor
 *
 * @example
 * // Play the walk animation of the character
 * this.playAnimation(ImageHub.PEPE.walk);
 *
 * @example
 * // Preload every background layer
 * const layers = [
 *   ...ImageHub.BACKGROUND.firstLayer,
 *   ...ImageHub.BACKGROUND.secondLayer,
 *   ...ImageHub.BACKGROUND.thirdLayer
 * ];
 * this.loadImages(layers);
 */
export class ImageHub {
    // #region background
    /**
     * Parallax background layers plus the static air/sky image.
     *
     * Each layer array contains the tiles that are repeated horizontally
     * along the level. `air` is a single path, not an array, because the sky
     * is drawn only once as the rearmost layer.
     *
     * @static
     * @type {{
     *   firstLayer: SpriteSet,
     *   secondLayer: SpriteSet,
     *   thirdLayer: SpriteSet,
     *   clouds: SpriteSet,
     *   air: string
     * }}
     */
    static BACKGROUND = {
        firstLayer: [
            'assets/img/5_background/layers/1_first_layer/1.png',
            'assets/img/5_background/layers/1_first_layer/2.png'
        ],
        secondLayer: [
            'assets/img/5_background/layers/2_second_layer/1.png',
            'assets/img/5_background/layers/2_second_layer/2.png'
        ],
        thirdLayer: [
            'assets/img/5_background/layers/3_third_layer/1.png',
            'assets/img/5_background/layers/3_third_layer/2.png'
        ],
        clouds: [
            'assets/img/5_background/layers/4_clouds/1.png',
            'assets/img/5_background/layers/4_clouds/2.png',
            'assets/img/5_background/layers/4_clouds/full.png'
        ],
        air:
            'assets/img/5_background/layers/air.png'

    }
    // #endregion

    // #region character PEPE
    /**
     * Animation sets of the playable character "Pepe".
     *
     * `idle` is the short loop shown while the character stands still.
     * `idle_long` is the extended loop played after a longer period of
     * inactivity (sleeping animation).
     *
     * @static
     * @type {{
     *   idle: SpriteSet,
     *   idle_long: SpriteSet,
     *   walk: SpriteSet,
     *   jump: SpriteSet,
     *   hurt: SpriteSet,
     *   dead: SpriteSet
     * }}
     */
    static PEPE = {
        idle: [
            'assets/img/2_character_pepe/1_idle/idle/I-1.png',
            'assets/img/2_character_pepe/1_idle/idle/I-2.png',
            'assets/img/2_character_pepe/1_idle/idle/I-3.png',
            'assets/img/2_character_pepe/1_idle/idle/I-4.png',
            'assets/img/2_character_pepe/1_idle/idle/I-5.png',
            'assets/img/2_character_pepe/1_idle/idle/I-6.png',
            'assets/img/2_character_pepe/1_idle/idle/I-7.png',
            'assets/img/2_character_pepe/1_idle/idle/I-8.png',
            'assets/img/2_character_pepe/1_idle/idle/I-9.png',
            'assets/img/2_character_pepe/1_idle/idle/I-10.png'
        ],
        idle_long: [
            'assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
            'assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
            'assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
            'assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
            'assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
            'assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
            'assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
            'assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
            'assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
            'assets/img/2_character_pepe/1_idle/long_idle/I-20.png'
        ],
        walk: [
            'assets/img/2_character_pepe/2_walk/W-21.png',
            'assets/img/2_character_pepe/2_walk/W-22.png',
            'assets/img/2_character_pepe/2_walk/W-23.png',
            'assets/img/2_character_pepe/2_walk/W-24.png',
            'assets/img/2_character_pepe/2_walk/W-25.png',
            'assets/img/2_character_pepe/2_walk/W-26.png'
        ],
        jump: [
            'assets/img/2_character_pepe/3_jump/J-31.png',
            'assets/img/2_character_pepe/3_jump/J-32.png',
            'assets/img/2_character_pepe/3_jump/J-33.png',
            'assets/img/2_character_pepe/3_jump/J-34.png',
            'assets/img/2_character_pepe/3_jump/J-35.png',
            'assets/img/2_character_pepe/3_jump/J-36.png',
            'assets/img/2_character_pepe/3_jump/J-37.png',
            'assets/img/2_character_pepe/3_jump/J-38.png',
            'assets/img/2_character_pepe/3_jump/J-39.png'
        ],
        hurt: [
            'assets/img/2_character_pepe/4_hurt/H-41.png',
            'assets/img/2_character_pepe/4_hurt/H-42.png',
            'assets/img/2_character_pepe/4_hurt/H-43.png'
        ],
        dead: [
            'assets/img/2_character_pepe/5_dead/D-51.png',
            'assets/img/2_character_pepe/5_dead/D-52.png',
            'assets/img/2_character_pepe/5_dead/D-53.png',
            'assets/img/2_character_pepe/5_dead/D-54.png',
            'assets/img/2_character_pepe/5_dead/D-55.png',
            'assets/img/2_character_pepe/5_dead/D-56.png',
            'assets/img/2_character_pepe/5_dead/D-57.png'
        ]
    }
    // #endregion

    // #region enemie big chicken
    /**
     * Animation sets of the normal sized chicken enemy.
     *
     * `dead` holds a single frame and is therefore displayed as a still image.
     *
     * @static
     * @type {{ walk: SpriteSet, dead: SpriteSet }}
     */
    static BIGCHICKEN = {
        walk: [
            'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
            'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
            'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
        ],
        dead: [
            'assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
        ]
    }
    // #endregion

    // #region enemie small chicken
    /**
     * Animation sets of the small chicken enemy.
     *
     * Structurally identical to {@link ImageHub.BIGCHICKEN}, but referencing
     * the small chicken sprites.
     *
     * @static
     * @type {{ walk: SpriteSet, dead: SpriteSet }}
     */
    static SMALLCHICKEN = {
        walk: [
            'assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            'assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
            'assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
        ],
        dead: [
            'assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
        ]
    }
    // #endregion

    // #region enemie endboss
    /**
     * Animation sets of the endboss chicken.
     *
     * `alert` is played once the character enters the boss trigger zone,
     * `attack` while the boss charges towards the character.
     *
     * @static
     * @type {{
     *   walk: SpriteSet,
     *   alert: SpriteSet,
     *   attack: SpriteSet,
     *   hurt: SpriteSet,
     *   dead: SpriteSet
     * }}
     */
    static ENDBOSS = {
        walk: [
            'assets/img/4_enemie_boss_chicken/1_walk/G1.png',
            'assets/img/4_enemie_boss_chicken/1_walk/G2.png',
            'assets/img/4_enemie_boss_chicken/1_walk/G3.png',
            'assets/img/4_enemie_boss_chicken/1_walk/G4.png'
        ],
        alert: [
            'assets/img/4_enemie_boss_chicken/2_alert/G5.png',
            'assets/img/4_enemie_boss_chicken/2_alert/G6.png',
            'assets/img/4_enemie_boss_chicken/2_alert/G7.png',
            'assets/img/4_enemie_boss_chicken/2_alert/G8.png',
            'assets/img/4_enemie_boss_chicken/2_alert/G9.png',
            'assets/img/4_enemie_boss_chicken/2_alert/G10.png',
            'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
            'assets/img/4_enemie_boss_chicken/2_alert/G12.png'
        ],
        attack: [
            'assets/img/4_enemie_boss_chicken/3_attack/G13.png',
            'assets/img/4_enemie_boss_chicken/3_attack/G14.png',
            'assets/img/4_enemie_boss_chicken/3_attack/G15.png',
            'assets/img/4_enemie_boss_chicken/3_attack/G16.png',
            'assets/img/4_enemie_boss_chicken/3_attack/G17.png',
            'assets/img/4_enemie_boss_chicken/3_attack/G18.png',
            'assets/img/4_enemie_boss_chicken/3_attack/G19.png',
            'assets/img/4_enemie_boss_chicken/3_attack/G20.png'
        ],
        hurt: [
            'assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
            'assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
            'assets/img/4_enemie_boss_chicken/4_hurt/G23.png'
        ],
        dead: [
            'assets/img/4_enemie_boss_chicken/5_dead/G24.png',
            'assets/img/4_enemie_boss_chicken/5_dead/G25.png',
            'assets/img/4_enemie_boss_chicken/5_dead/G26.png',
        ]
    }
    // #endregion

    // #region items coins
    /**
     * Sprites of the collectable coin.
     *
     * Currently a single frame; the array shape is kept so that additional
     * spin frames can be added without changing the consumers.
     *
     * @static
     * @type {{ coin: SpriteSet }}
     */
    static COINS = {
        coin: [
            'assets/img/8_coin/coin_1.png',
        ],
    }
    // #endregion

    // #region items flask
    /**
     * Sprites of the salsa bottle in all of its states.
     *
     * `onGround` is the collectable item lying in the level, `rotate` the
     * spin animation of the thrown bottle and `splash` the impact animation.
     *
     * @static
     * @type {{ onGround: SpriteSet, rotate: SpriteSet, splash: SpriteSet }}
     */
    static FLASK = {
        onGround: [
            'assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
            'assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
        ],
        rotate: [
            'assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
            'assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
            'assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
            'assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
        ],
        splash: [
            'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
            'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
            'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
            'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
            'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
            'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
        ]
    }
    // #endregion

    // #region statusbar character
    /**
     * Status bar sprites of the character HUD.
     *
     * Every array holds six frames representing the fill levels
     * 0, 20, 40, 60, 80 and 100 percent, in that order. The frame index can
     * therefore be derived from a percentage value.
     *
     * @static
     * @type {{ health: SpriteSet, flask: SpriteSet, coin: SpriteSet }}
     */
    static STATUSBAR = {
        health: [
            'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
            'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
            'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
            'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
            'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
            'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
        ],
        flask: [
            'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
            'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
            'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
            'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
            'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
            'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
        ],
        coin: [
            'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
            'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
            'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
            'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
            'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
            'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
        ]
    }
    // #endregion

    // #region statusbar boss
    /**
     * Status bar sprites of the endboss health bar.
     *
     * Same six step scale as {@link ImageHub.STATUSBAR}: 0 to 100 percent.
     *
     * @static
     * @type {{ health: SpriteSet }}
     */
    static BOSSBAR = {
        health: [
            'assets/img/7_statusbars/2_statusbar_endboss/green/green0.png',
            'assets/img/7_statusbars/2_statusbar_endboss/green/green20.png',
            'assets/img/7_statusbars/2_statusbar_endboss/green/green40.png',
            'assets/img/7_statusbars/2_statusbar_endboss/green/green60.png',
            'assets/img/7_statusbars/2_statusbar_endboss/green/green80.png',
            'assets/img/7_statusbars/2_statusbar_endboss/green/green100.png'
        ]
    }
    // #endregion

    // #region startscreen
    /**
     * Background image of the start screen.
     *
     * @static
     * @type {{ start: SpriteSet }}
     */
    static START = {
        start: [
            'assets/img/10_intro_outro_screens/start/startscreen_2.png'
        ]
    }
    // #endregion

    // #region flask rotation
    /**
     * Rotation animation of the thrown bottle.
     *
     * @static
     * @type {{ flask: SpriteSet }}
     * @see ImageHub.FLASK
     * @deprecated Duplicate of `ImageHub.FLASK.rotate`. Prefer `FLASK.rotate`.
     */
    static ROTATE = {
        flask: [
            'assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
            'assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
            'assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
            'assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
        ]
    }
    // #endregion

    // #region flask splash
    /**
     * Splash animation of the bottle on impact.
     *
     * @static
     * @type {{ flask: SpriteSet }}
     * @see ImageHub.FLASK
     * @deprecated Duplicate of `ImageHub.FLASK.splash`. Prefer `FLASK.splash`.
     */
    static SPLASH = {
        flask: [
            'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
            'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
            'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
            'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
            'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
            'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
        ]
    }
    // #endregion

    // #region winscreen
    /**
     * Image shown when the player wins the game.
     *
     * @static
     * @type {{ win: SpriteSet }}
     */
    static WIN = {
        win: [
            'assets/img/You won, you lost/You Win A.png'
        ]
    }
    // #endregion

    // #region endscreen
    /**
     * Image shown when the player loses the game (game over screen).
     *
     * @static
     * @type {{ end: SpriteSet }}
     */
    static END = {
        end: [
            'assets/img/10_intro_outro_screens/game_over/oh no you lost!.png'
        ]
    }
    // #endregion
}