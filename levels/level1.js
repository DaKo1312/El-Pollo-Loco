/**
 * @file Factory of level 1.
 *
 * Builds every object the level consists of — enemies, clouds, background
 * layers, coins and bottles — and assembles them into a {@link Level}
 * instance. The module is a pure factory: it is called once per game start,
 * so every restart works with a freshly created and randomised level.
 */

import { Chicken } from "../models/chicken.class.js";
import { SmallChicken } from "../models/small_chicken.class.js";
import { BackgroundObject } from "../models/background_object.class.js";
import { ImageHub } from "../helper/image_helper.class.js";
import { Level } from "../models/level.class.js";
import { Cloud } from "../models/cloud.class.js";
import { Endboss } from "../models/endboss.class.js";
import { Coin } from "../models/coins.class.js";
import { Flask } from "../models/flask.class.js";

/**
 * Creates a complete, ready to play level 1.
 *
 * Call this on every game start instead of reusing a level instance:
 * enemies and items place themselves randomly on construction, so a new call
 * also resets their positions and states.
 *
 * @returns {Level} The fully populated level.
 *
 * @example
 * this.level = createLevel1();
 */
export function createLevel1() {
    return new Level(
        createEnemies(),
        createClouds(),
        createBackground(),
        createCoins(),
        createFlasks()
    );
}

/**
 * Creates all enemies of the level.
 *
 * Ten normal chickens, ten small chickens and exactly one {@link Endboss},
 * which is pushed last and therefore drawn on top of the other enemies.
 *
 * @returns {Array<Chicken|SmallChicken|Endboss>} The enemies of the level.
 */
function createEnemies() {
    let enemies = [];
    for (let i = 0; i < 10; i++) enemies.push(new Chicken());
    for (let i = 0; i < 10; i++) enemies.push(new SmallChicken());
    enemies.push(new Endboss());
    return enemies;
}

/**
 * Creates the clouds of the level.
 *
 * The clouds are placed one after another along the x axis with a fixed gap
 * of 150 pixels, so they never overlap. Their y position is randomised
 * slightly to avoid a visible pattern.
 *
 * @returns {Cloud[]} The clouds of the level.
 */
function createClouds() {
    let clouds = [];
    let currentX = 0;
    for (let i = 0; i < 10; i++) {
        let cloud = new Cloud();
        cloud.x = currentX;
        cloud.y = -35 + Math.random() * 20;
        clouds.push(cloud);
        currentX += cloud.width + 150;
    }
    return clouds;
}

/**
 * Creates the collectable coins of the level.
 *
 * @returns {Coin[]} The coins of the level.
 */
function createCoins() {
    let coins = [];
    for (let i = 0; i < 12; i++) coins.push(new Coin());
    return coins;
}

/**
 * Creates the collectable salsa bottles of the level.
 *
 * @returns {Flask[]} The bottles of the level.
 */
function createFlasks() {
    let flasks = [];
    for (let i = 0; i < 15; i++) flasks.push(new Flask());
    return flasks;
}

/**
 * Creates the parallax background of the level.
 *
 * Builds eleven segments of 720 pixels each, starting at `-720` so the area
 * left of the start position is covered as well. Within each segment the
 * layers are pushed from back to front (air, third, second, first layer),
 * which is the order they are drawn in. The alternating `imageIndex` swaps
 * the two tile variants of each layer, so neighbouring segments connect
 * seamlessly.
 *
 * @returns {BackgroundObject[]} The background objects of the level.
 */
function createBackground() {
    let background = [];
    for (let i = -1; i < 10; i++) {
        let x = i * 720;
        let imageIndex = Math.abs(i) % 2;
        background.push(
            new BackgroundObject(ImageHub.BACKGROUND.air, x),
            new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[imageIndex], x),
            new BackgroundObject(ImageHub.BACKGROUND.secondLayer[imageIndex], x),
            new BackgroundObject(ImageHub.BACKGROUND.firstLayer[imageIndex], x)
        );
    }
    return background;
}