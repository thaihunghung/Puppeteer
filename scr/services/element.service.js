const globalState = require("../config/globalState");
const { Util } = require("../config/import.util");


class ElementService {
    static async clickButton(page, btnSelector, mouse = true) { 
        try {
            await page.waitForSelector(btnSelector, { visible: true, timeout: 10000 });
    
            const btn = await page.$(btnSelector);
            if (btn) {
                const clicked = await page.evaluate((selector, useMouseEvent) => {
                    const btn = document.querySelector(selector);
                    if (btn && btn.offsetWidth > 0 && btn.offsetHeight > 0 && !btn.disabled) {
                        btn.scrollIntoView();
    
                        if (useMouseEvent) {
                            try {
                                const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                                btn.dispatchEvent(event);
                            } catch (error) {
                                console.warn("MouseEvent bị chặn, nhưng mouse = true. Không thể fallback sang .click()");
                                return false; // ❌ Nếu mouse = true nhưng bị chặn, không click được
                            }
                        } else {
                            btn.click(); // ✅ Dùng .click() nếu mouse = false
                        }
    
                        return true; // ✅ Click thành công
                    }
                    return false; // ❌ Nút bị ẩn hoặc disabled
                }, btnSelector, mouse);
    
                if (!clicked) {
                    console.error("Không thể click vì nút bị ẩn, vô hiệu hóa hoặc bị chặn:", btnSelector);
                    return false;
                }
                return true;
            } else {
                console.error("Không tìm thấy nút:", btnSelector);
                return false;
            }
        } catch (error) {
            console.error("Lỗi khi click:", error);
            return false;
        }
    }
    
    static async waitAndClick(umba, selector) {
        while (true) {
            const input = await umba.$(selector);
    
            if (input) {
                const success = await this.clickButton(umba, selector);
                if (success) break
            }
    
            await Util.sleep(500);
        }
    }
    static async typeInput(page, selector, text) {
        try {
            await page.waitForSelector(selector, { visible: true, timeout: 10000 });
    
            const input = await page.$(selector);
            if (input) {
                await input.click({ clickCount: 3 });
                await page.type(selector, text); 
                return true; 
            } else {
                console.error("Không tìm thấy ô input:", selector);
                return false;
            }
        } catch (error) {
            console.error("Lỗi khi nhập dữ liệu:", error);
            return false;
        }
    }
    static async waitAndType(page, selector, text) {
        while (true) {
            const success = await this.typeInput(page, selector, text);
            if (success) break// Thoát vòng lặp nếu nhập thành công
            await Util.sleep(500);
        }
    }
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
    static async HandleClickElementShadown(page, jsPath) {
        try {
            // Sử dụng evaluateHandle để truy cập phần tử thông qua JS path trong shadow DOM
            const elementHandle = await page.evaluateHandle((jsPath) => {
                // Thực thi JS path trong context của page và trả về phần tử
                return eval(jsPath);  // Thực thi chuỗi JS path
            }, jsPath);
    
            // Chuyển handle thành phần tử DOM và click vào phần tử nếu tồn tại
            const element = await elementHandle.asElement();
            if (element) {
                await element.click(); // Click vào phần tử
                console.log('Clicked on the element!');
            } else {
                console.log('Element not found!');
            }
    
        } catch (error) {
            if (globalState.showXpath) {
                console.error(`Error in HandleClickElementShadown: ${error.message}`);
            }
        }
        return null;
    }
    static async clickButton(page, btnSelector) {
        try {
            await page.waitForSelector(btnSelector, { visible: true, timeout: 10000 });
    
            const btn = await page.$(btnSelector);
            if (btn) {
                await page.evaluate(selector => {
                    const btn = document.querySelector(selector);
                    if (btn && btn.offsetWidth > 0 && btn.offsetHeight > 0 && !btn.disabled) {
                        btn.scrollIntoView();
                        const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                        btn.dispatchEvent(event);
                    } else {
                        console.error("Không thể click vì nút bị ẩn hoặc vô hiệu hóa:", selector);
                    }
                }, btnSelector);
                return true; // Click thành công
            } else {
                console.error("Không tìm thấy nút:", btnSelector);
                return false;
            }
        } catch (error) {
            console.error("Lỗi khi click:", error);
            return false;
        }
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
    static async Element$(page, xpath, retries = 2) {
        let found = false;
        let element = null;
        if (globalState.showXpath){
            console.log(xpath);
        }
        while (retries > 0 && !found) {
            try {
                element = await page.$(`::-p-xpath(${xpath})`, {
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
    static async HandleFindWithWaitForSelectorElement(page, xpath, timeout = 2) {
        if (globalState.showXpath){
            console.log(xpath);
        }
        const element = await this.ElementWaitForSelector(page, xpath, timeout);
        if (element.found) {
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
    static async HandlefindAllElementAndClick(page, text, timeout = 2) {
        const xpath = `//*[text() = "${text}"]`; 
        if (globalState.showXpath){
            console.log(xpath);
        }
        
        const elements = await page.$x('//button[text() = "Submit"]');

        for (const element of elements) {
          // Lấy text của phần tử (không bắt buộc, chỉ để debug)
          const text = await page.evaluate(el => el.textContent, element);
          console.log('Found element with text:', text);
      
          // Click vào phần tử
          await element.click();
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

    static async HandlefindAndClickElement$(page, xpath, timeout = 3) {
        if (globalState.showXpath){
            console.log(xpath);
        }
        const element = await this.Element$(page, xpath, timeout);
        if (element.found) {
            await element.element.click();
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

    static async queryShadowSelector(page, selectors) {
        let elementHandle = await page.evaluateHandle(() => document);
        for (const selector of selectors) {
            elementHandle = await elementHandle.evaluateHandle((el, sel) => {
                const shadowRoot = el.shadowRoot;
                return shadowRoot ? shadowRoot.querySelector(sel) : null;
            }, selector);

            if (!elementHandle) {
                return null; 
            }
        }
        return elementHandle;
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

    static async Shadown(page, jsPath, timeout = 2) {
        try {
          let attempt = 0;
          let clicked = false;
    
          while (attempt < timeout && !clicked) {
            const button = await (await page.evaluateHandle(jsPath)).asElement();
            if (button) {
              try {
                await button.click();
                console.log(`✅ Click thành công ở lần thử: ${attempt + 1}`);
                clicked = true; // Đánh dấu đã click thành công
              } catch (clickError) {
                console.error(`❌ Lỗi khi click ở lần thử ${attempt + 1}:`, clickError);
              }
            } else {
              console.error(`❌ Không tìm thấy nút ở lần thử ${attempt + 1}`);
            }
            
            if (!clicked) {
              attempt++;
              await Util.sleep(5000)
            }
          }
    
          if (!clicked) {
            throw new Error("🚨 Click thất bại sau tất cả các lần thử!");
          }
        } catch (error) {
          console.error("❌ Lỗi trong quá trình thực thi Shadown:", error);
        }
      }
}

module.exports = ElementService;
