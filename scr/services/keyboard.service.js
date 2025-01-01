const globalState = require("../config/globalState");
const { Util } = require("../config/import.util");

class KeyboardService {
    constructor() {}

    static async RandomArrowDown(page, randomTimes){
        const random = this.getRandomNumber(randomTimes)
        for (let i = 0; i < random; i++) {
            await page.keyboard.press("ArrowDown");
        }
        await page.keyboard.press("Enter");
    }
    static getRandomNumber(max) {
        return Math.floor(Math.random() * max) + 1;
    }

    static async AutoEnter(page) {
        while (true) {
            await page.keyboard.down('Control');
            await page.keyboard.press("Enter");
            await page.keyboard.up('Control');
        }
    }
    static async Enter(page) {
        console.log(`${globalState.workerData.profile}`, globalState.stop);
        await page.keyboard.down('Control');
        await page.keyboard.press("Enter");
        await page.keyboard.up('Control');
    }
}

module.exports = KeyboardService
