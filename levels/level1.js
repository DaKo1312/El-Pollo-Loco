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
     * @type {Array<Enemy|Endboss>}
     */
    enemies;

    /**
     * The decorative clouds of the level.
     *
     * @type {Cloud[]}
     */
    clouds;

    /**
     * The parallax background tiles, in drawing order (back to front).
     *
     * @type {BackgroundObject[]}
     */
    backgroundObjects;

    /**
     * The collectable coins of the level.
     *
     * @type {Coin[]}
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
     * @param {Array<Enemy|Endboss>} enemies - The enemies of the level.
     * @param {Cloud[]} clouds - The clouds of the level.
     * @param {BackgroundObject[]} backgroundObjects - The background tiles, in drawing order.
     * @param {Coin[]} coins - The coins of the level.
     * @param {Flask[]} flasks - The collectable bottles of the level.
     */
    constructor(enemies, clouds, backgroundObjects, coins, flasks) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        /**
         * The collectable bottles of the level.
         *
         * @type {Flask[]}
         */
        this.flasks = flasks;
    }
}