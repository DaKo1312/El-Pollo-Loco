/**
 * Data container of a level.
 *
 * Holds every object a level consists of and the position of its right
 * boundary. The class has no logic of its own: instances are assembled by the
 * level factory and read by the world, which draws the objects and checks
 * them for collisions.
 *
 * @class
 *
 * @see createLevel1
 */
export class Level {
    /**
     * All enemies of the level, including the endboss.
     *
     * @type {Array<import('./enemy.class.js').Enemy|import('./endboss.class.js').Endboss>}
     */
    enemies;

    /**
     * The decorative clouds of the level.
     *
     * @type {import('./cloud.class.js').Cloud[]}
     */
    clouds;

    /**
     * The parallax background tiles, in drawing order (back to front).
     *
     * @type {import('./background_object.class.js').BackgroundObject[]}
     */
    backgroundObjects;

    /**
     * The collectable coins of the level.
     *
     * @type {import('./coins.class.js').Coin[]}
     */
    coins;

    /**
     * Right boundary of the level in pixels.
     *
     * Equals nine background segments of 720 pixels each and limits how far
     * the character may walk to the right.
     *
     * @type {number}
     */
    level_end_x = 720*9;

    /**
     * Creates a level from its objects.
     *
     * The arrays are stored by reference, not copied: the world mutates them
     * directly, e.g. when removing collected items.
     *
     * @param {Array<import('./enemy.class.js').Enemy|import('./endboss.class.js').Endboss>} enemies - The enemies of the level.
     * @param {import('./cloud.class.js').Cloud[]} clouds - The clouds of the level.
     * @param {import('./background_object.class.js').BackgroundObject[]} backgroundObjects - The background tiles, in drawing order.
     * @param {import('./coins.class.js').Coin[]} coins - The coins of the level.
     * @param {import('./flask.class.js').Flask[]} flasks - The collectable bottles of the level.
     */
    constructor(enemies, clouds, backgroundObjects, coins, flasks) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        /**
         * The collectable bottles of the level.
         *
         * @type {import('./flask.class.js').Flask[]}
         */
        this.flasks = flasks;
    }
}