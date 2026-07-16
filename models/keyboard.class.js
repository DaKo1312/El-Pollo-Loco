/**
 * Shared keyboard state of the game.
 *
 * Acts as the single interface between input and game logic: the keyboard and
 * touch listeners of the UI only write these flags, while the character reads
 * them on every tick of its movement loop. Because both sides talk to the
 * same instance, physical keys and on-screen touch buttons behave identically
 * and the game logic stays free of any DOM knowledge.
 *
 * One instance is created on page load and reused across all games.
 *
 * @class
 *
 * @example
 * const keyboard = new GameKeyboard();
 * world = new World(canvas, keyboard);
 */
export class GameKeyboard {
    /**
     * Whether the left arrow key (or the left touch button) is held down.
     *
     * @type {boolean}
     */
    LEFT = false;

    /**
     * Whether the right arrow key (or the right touch button) is held down.
     *
     * @type {boolean}
     */
    RIGHT = false;

    /**
     * Whether the space key (or the jump touch button) is held down.
     *
     * @type {boolean}
     */
    SPACE = false;

    /**
     * Whether the D key (or the throw touch button) is held down.
     *
     * Throws a salsa bottle.
     *
     * @type {boolean}
     */
    D = false;
}