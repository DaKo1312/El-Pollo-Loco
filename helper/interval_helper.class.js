/**
 * Central registry for all running `setInterval` timers of the game.
 *
 * `IntervalHub` is a pure utility class: it is never instantiated and only
 * exposes static members. Every interval created through
 * {@link IntervalHub.startInterval} is stored internally, so that the whole
 * game loop can be stopped with a single call to
 * {@link IntervalHub.stopAllIntervals} (e.g. on game over, on win or when
 * restarting the game). This prevents orphaned intervals from keeping the
 * game running in the background.
 *
 * @class
 * @hideconstructor
 *
 * @example
 * // Register the animation loop of an enemy
 * IntervalHub.startInterval(() => this.playAnimation(ImageHub.BIGCHICKEN.walk), 200);
 *
 * @example
 * // Stop the complete game on game over
 * IntervalHub.stopAllIntervals();
 */
export class IntervalHub {
    /**
     * Ids of all currently registered intervals.
     *
     * Filled by {@link IntervalHub.startInterval} and emptied by
     * {@link IntervalHub.stopAllIntervals}. Should be treated as internal
     * state and not be mutated from the outside.
     *
     * @static
     * @type {number[]}
     */
    static allIntervals = [];

    /**
     * Starts a new interval and registers it for later cleanup.
     *
     * Behaves like the native `setInterval`, but additionally stores the
     * created interval id in {@link IntervalHub.allIntervals}.
     *
     * @static
     * @param {Function} func - Callback executed on every tick.
     * @param {number} timer - Delay between two ticks in milliseconds.
     * @returns {void}
     */
    static startInterval (func, timer) {
        const newInterval = setInterval(func, timer);
        IntervalHub.allIntervals.push(newInterval);
    }

    /**
     * Stops every registered interval and clears the registry.
     *
     * Only affects intervals that were created via
     * {@link IntervalHub.startInterval}. Intervals started with a direct
     * `setInterval` call are not tracked and keep running.
     *
     * @static
     * @returns {void}
     */
    static stopAllIntervals() {
        IntervalHub.allIntervals.forEach(clearInterval);
        IntervalHub.allIntervals = [];
    }
}