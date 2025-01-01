const globalState = require("../config/globalState");
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
            if (globalState.showXpath){
                console.error(`Error in getValueXpathElement: ${error.message}`);
            }
        }
        return null;
    }

    static async ElementWaitForSelector(page, query, retries = 2) {
        let found = false;
        let element = null;
        if (globalState.showXpath){
            console.log(query);
        }
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
                if (globalState.showXpath){
                    console.log(`Attempt failed. Retries left: ${retries - 1}`);
                }     
                retries--;
                if (retries === 0) {
                    if (globalState.showXpath){
                        console.log('Element not found after 2 attempts.');
                    }
                }
            }
        }
        return { element, found };
    }

    static async ElementXpath(page, xpath, retries = 2) {
        let found = false;
        let element = null;
        if (globalState.showXpath){
            console.log(xpath);
        }
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
                
                if (globalState.showXpath){
                    console.log(`Attempt failed. Retries left: ${retries - 1}`);
                }
                retries--;
                if (retries === 0) {
                    if (globalState.showXpath){
                        console.log('Element not found after 2 attempts.');
                    }
                }
            }
        }
        return { element, found };
    }

    static async ElementByTextXpath(page, TextSearch, retries = 2) {
        let found = false;
        let element = null;
        const xpath = `//*[text() = "${TextSearch}"]`; 
        if (globalState.showXpath){
            console.log(xpath);
        }
        while (retries > 0 && !found) {
            try {
                element = await page.waitForSelector(`xpath=//*[text() = "${TextSearch}"]`, { 
                    visible: true, 
                    timeout: 5000 
                });
                if (element) {
                    if (globalState.showXpath){
                        console.log(TextSearch);
                    }
                    found = true;
                }
            } catch (error) {
                
                if (globalState.showXpath){
                    console.log(`Attempt failed. Retries left: ${retries - 1}`);
                }
                retries--;
                if (retries === 0) {
                    if (globalState.showXpath){
                        console.log('Element not found after 2 attempts.');
                    }
                    
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
                element = await page.waitForSelector(`xpath=${xpath}`, {
                    visible: true,
                    timeout: 5000,
                });
                if (element) {
                    found = true;
                }
            } catch (error) {
                if (globalState.showXpath){
                    console.log(`Attempt failed. Retries left: ${retries - 1}`);
                }
                
                retries--;
                if (retries === 0) {
                    if (globalState.showXpath){
                        console.log('Element not found after 2 attempts.');
                    }
                    
                }
            }
        }
        return { element, found };
    }

    static async HandlefindAndClickElement(page, xpath, timeout = 3) {
        if (globalState.showXpath){
            console.log(xpath);
        }
        const element = await this.ElementXpath(page, xpath, timeout);
        if (element.found) {
            await element.element.click();
            return true;
        }
        return false;
    }

    static async HandleCoppyAndClickElement(page, xpath, timeout = 3) {
        if (globalState.showXpath){
            console.log(xpath);
        }
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
        if (globalState.showXpath){
            console.log(xpath);
        }
        const element = await this.ElementWaitForSelector(page, xpath, timeout);
        if (element.found) {
            await element.element.click();
            return true;
        }
        return false;
    }

    static async HandleWaitForSelectorTypeElement(page, xpath, input, timeout = 3) {
        if (globalState.showXpath){
            console.log(xpath);
        }
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
        const xpath = `//*[text() = "${text}"]`; 
        if (globalState.showXpath){
            console.log(xpath);
        }
        const element = await this.ElementByTextXpath(page, text, timeout);
        if (element.found) {
            if (globalState.showXpath){
                console.log("tim thay"); 
            }
            return true;
        }
        return false;
    }

    static async HandlefindAndClickElementText(page, text, timeout = 2) {
        const xpath = `//*[text() = "${text}"]`; 
        if (globalState.showXpath){
            console.log(xpath);
        }
        const element = await this.ElementByTextXpath(page, text, timeout);
        if (element.found) {
            await element.element.click();
            return true;
        }
        return false;
    }

    static async HandlefindAndTypeElementText(page, text, input, timeout = 2) {
        const xpath = `//*[text() = "${text}"]`; 
        if (globalState.showXpath){
            console.log(xpath);
        }
        const element = await this.ElementByTextXpath(page, text, timeout);
        if (element.found) {
            await element.element.click();
            await element.element.evaluate(el => el.value = '');
            await element.element.type(input);
            return true;
        }
        return false;
    }

    static async HandlefindAndTypeElement(page, xpath, input, timeout = 10) {
        if (globalState.showXpath){
            console.log(xpath); 
        }
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
