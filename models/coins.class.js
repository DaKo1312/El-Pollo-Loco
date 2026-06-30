import { MovableObject } from "./movables_object.class.js";
import { ImageHub } from "../helper/image_helper.class.js";

export class Coin extends MovableObject {
    // #region coin properties
    image = ImageHub.COINS.coin;
    width = 120;
    height = 120;
    y = 120;
    showFrame = false;
    offset = {top: 40, right: 40, bottom: 40, left: 40};
    // #endregion

    constructor() {
        super();
        this.loadImage(this.image[0]);
        this.x = 200 + Math.random() * 5500;
        this.y = 80 + Math.random() * 220;
    }

}