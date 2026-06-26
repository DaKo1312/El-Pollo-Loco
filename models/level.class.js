export class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    level_end_x = 720*9;

    constructor(enemies, clouds, backgroundObjects, coins, flasks) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.flasks = flasks;
    }
}