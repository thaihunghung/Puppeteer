const { Util } = require("../config/import.util");

class ElementService {
    static async GetValueXpathElement(page, xpath) {
        try {
            const element = await page.waitForSelector(`::-p-xpath(${xpath})`, {
                visible: true,
                timeout: 5000,
            });
            if (element) {
                return await page.$eval(xpath, el => el.value);
            }
        } catch (error) {
            console.error(`Error in getValueXpathElement: ${error.message}`);
        }
        return null;
    }

    static async ElementWaitForSelector(page, query, retries = 2) {
        let found = false;
        let element = null;
        console.log(query);
        while (retries > 0 && !found) {
            try {
                element = await page.waitForSelector(query, {
                    visible: true,
                    timeout: 5000,
                });
                if (element) {
                    found = true;
                }
            } catch (error) {
                console.log(`Attempt failed. Retries left: ${retries - 1}`);
                retries--;
                if (retries === 0) {
                    console.log('Element not found after 2 attempts.');
                }
            }
        }
        return { element, found };
    }

    static async ElementXpath(page, xpath, retries = 2) {
        let found = false;
        let element = null;
        console.log(xpath);
        while (retries > 0 && !found) {
            try {
                element = await page.waitForSelector(`::-p-xpath(${xpath})`, {
                    visible: true,   
                    timeout: 5000,
                });
                if (element) {
                    found = true;
                }
            } catch (error) {
                console.log(`Attempt failed. Retries left: ${retries - 1}`);
                retries--;
                if (retries === 0) {
                    console.log('Element not found after 2 attempts.');
                }
            }
        }
        return { element, found };
    }

    static async ElementByTextXpath(page, TextSearch, retries = 2) {
        let found = false;
        let element = null;
        const xpath = `//*[text() = "${TextSearch}"]`;
        console.log('TextSearch', xpath);
        while (retries > 0 && !found) {
            try {
                element = await page.waitForSelector(`::-p-xpath(${xpath})`, {
                    visible: true,
                    timeout: 5000,
                });
                if (element) {
                    console.log(`Tim thay ${TextSearch}`);
                    found = true;
                }
            } catch (error) {
                console.log(`Attempt failed. Retries left: ${retries - 1}`);
                retries--;
                if (retries === 0) {
                    console.log('Element not found after 2 attempts.');
                }
            }
        }
        return { element, found };
    }

    static async ElementByTagAndTextXpath(page, TextSearch, retries = 2) {
        let found = false;
        let element = null;
        const xpath = `//*[text()="${TextSearch}"]`;
        while (retries > 0 && !found) {
            try {
                element = await page.waitForSelector(`::-p-xpath(${xpath})`, {
                    visible: true,
                    timeout: 5000,
                });
                if (element) {
                    found = true;
                }
            } catch (error) {
                console.log(`Attempt failed. Retries left: ${retries - 1}`);
                retries--;
                if (retries === 0) {
                    console.log('Element not found after 2 attempts.');
                }
            }
        }
        return { element, found };
    }

    static async HandlefindAndClickElement(page, xpath, timeout = 3) {
        const element = await this.ElementXpath(page, xpath, timeout);
        if (element.found) {
            await element.element.click();
            return true;
        }
        return false;
    }

    static async HandleCoppyAndClickElement(page, xpath, timeout = 3) {
        const element = await this.ElementXpath(page, xpath, timeout);
        if (element.found) {
            await element.element.click();
            await element.element.focus();
            await Util.sleep(3000);
            await page.keyboard.down('Control');
            await page.keyboard.press('V');
            await page.keyboard.up('Control');
            return true;
        }
        return false;
    }

    static async HandleWaitForSelectorClickElement(page, xpath, timeout = 3) {
        const element = await this.ElementWaitForSelector(page, xpath, timeout);
        if (element.found) {
            await element.element.click();
            return true;
        }
        return false;
    }

    static async HandleWaitForSelectorTypeElement(page, xpath, input, timeout = 3) {
        const element = await this.ElementWaitForSelector(page, xpath, timeout);
        if (element.found) {
            await element.element.click();
            await element.element.evaluate(el => el.value = '');
            await element.element.type(input);
            return true;
        }
        return false;
    }

    static async HandlefindAndElementText(page, text, timeout = 2) {
        const element = await this.ElementByTagAndTextXpath(page, text, timeout);
        if (element.found) {
            return true;
        }
        return false;
    }

    static async HandlefindAndTypeElement(page, xpath, input, timeout = 10) {
        const element = await this.ElementXpath(page, xpath, timeout);
        if (element.found) {
            await element.element.click();
            await element.element.evaluate(el => el.value = '');
            await element.element.type(input);
            return true;
        }
        return false;
    }
}

module.exports = ElementService;
