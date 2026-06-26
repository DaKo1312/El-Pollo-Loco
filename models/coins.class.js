import { MovableObject } from "./movables_object.class.js";
import { ImageHelper } from "../helper/image_helper.class.js";

export class Coin extends MovableObject {
    // #region coin properties
    image = ImageHelper.COINS.coin;
    width = 120;
    height = 120;
    y = 120;
    // #endregion

    constructor() {
        super();
        this.loadImage(this.image[0]);
        this.x = 200 + Math.random() * 5500;
        this.y = 80 + Math.random() * 220;
    }

}