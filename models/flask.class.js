import { MovableObject } from "./movables_object.class.js";
import { ImageHub } from "../helper/image_helper.class.js";

export class Flask extends MovableObject {
    // #region flask properties
    imagesGround = ImageHub.FLASK.onGround;
    width = 80;
    height = 80;
    y = 340;
    showFrame = false;
    offset = {top: 80, right: 20, bottom: 80, left: 25};
    // #endregion

    constructor() {
        super();
        const imageIndex = Math.floor(Math.random() * this.imagesGround.length);
        this.loadImage(this.imagesGround[imageIndex]);
        this.x = 200 + Math.random() * 5500;
    }
}