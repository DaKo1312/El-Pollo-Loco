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
 * Factory for creating the first game level.
 *
 * Creates and returns a fully initialized {@link Level}
 * containing all enemies, clouds, background objects,
 * coins and collectible bottles.
 *
 * @module level1
 */

/**
 * Creates and returns the first level of the game.
 *
 * The level contains all enemies, clouds, background objects,
 * coins and collectible bottles.
 *
 * @returns {Level} The fully initialized first level.
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
 * The level contains ten normal chickens,
 * ten small chickens and one endboss.
 *
 * @returns {(Chicken|SmallChicken|Endboss)[]} All enemies.
 */
function createEnemies() {
    let enemies = [];
    for (let i = 0; i < 10; i++) enemies.push(new Chicken());
    for (let i = 0; i < 10; i++) enemies.push(new SmallChicken());
    enemies.push(new Endboss());
    return enemies;
}

/**
 * Creates all decorative clouds.
 *
 * Clouds are distributed horizontally across the level
 * with a small random vertical offset.
 *
 * @returns {Cloud[]} All clouds.
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
 * Creates all collectible coins.
 *
 * @returns {Coin[]} All coins.
 */
function createCoins() {
    let coins = [];
    for (let i = 0; i < 12; i++) coins.push(new Coin());
    return coins;
}

/**
 * Creates all collectible bottles.
 *
 * @returns {Flask[]} All bottles.
 */
function createFlasks() {
    let flasks = [];
    for (let i = 0; i < 15; i++) flasks.push(new Flask());
    return flasks;
}

/**
 * Creates the repeating parallax background.
 *
 * Every segment consists of the sky and three scrolling layers.
 * The background starts one segment before the visible area
 * to avoid empty space at the beginning of the level.
 *
 * @returns {BackgroundObject[]} All background objects.
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