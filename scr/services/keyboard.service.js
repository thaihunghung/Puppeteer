
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
}

module.exports = KeyboardService
