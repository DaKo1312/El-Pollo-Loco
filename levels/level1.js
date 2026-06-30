import { Chicken } from "../models/chicken.class.js";
import { SmallChicken } from "../models/small_chicken.class.js";
import { BackgroundObject } from "../models/background_object.class.js";
import { ImageHub } from "../helper/image_helper.class.js";
import { Level } from "../models/level.class.js";
import { Cloud } from "../models/cloud.class.js";
import { Endboss } from "../models/endboss.class.js";
import { Coin } from "../models/coins.class.js";
import { Flask } from "../models/flask.class.js";

let enemies = [];
    for (let i = 0; i < 10; i++) {
        enemies.push(new Chicken());
    }
    for (let i = 0; i < 10; i++) {
        enemies.push(new SmallChicken());
    }
    enemies.push(new Endboss());

let clouds = [];
let currentX = 0;
    for (let i = 0; i < 10; i++) {
        let cloud = new Cloud();
        cloud.x = currentX;
        cloud.y = -35 + Math.random() * 20;
        clouds.push(cloud);
        currentX += cloud.width + 150;
    }

let coins = [];
    for (let i = 0; i < 12; i++) {
        coins.push(new Coin());
    }

let flasks = [];
    for (let i = 0; i < 15; i++) {
        flasks.push(new Flask());
    }

let backgroundObjects = [];
    for (let i = -1; i < 10; i++) {
    let x = i * 720;
    let imageIndex = Math.abs(i) % 2;
    backgroundObjects.push(
        new BackgroundObject(ImageHub.BACKGROUND.air, x),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[imageIndex], x),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[imageIndex], x),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[imageIndex], x)
    );
}

export const level1 = new Level(
    enemies,
    clouds,
    backgroundObjects,
    coins,
    flasks
);