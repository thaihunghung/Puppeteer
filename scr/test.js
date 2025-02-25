
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AnonymizeUAPlugin = require("puppeteer-extra-plugin-anonymize-ua");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");

puppeteer.use(StealthPlugin());
puppeteer.use(AnonymizeUAPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
const fs = require('fs');
const globalState = require('./config/globalState');
const { PageService } = require('./config/import.service');

// Class trung gian để quản lý dữ liệu
class ActionRecorder {
    constructor() {
        this.actionId = 0;
        this.results = [];
    }

    // Thêm hoặc cập nhật dữ liệu
    recordAction(data) {
        const existingIndex = this.results.findIndex(item => item.xpath === data.xpath && item.page === data.page);
        if (existingIndex !== -1 && data.event === "input") {
            this.results[existingIndex] = data;
        } else {
            this.results.push(data);
        }
        this.saveToFile();
    }

    // Ghi dữ liệu vào file
    saveToFile() {
        const output = this.results.map(item => JSON.stringify(item, null, 2)).join(`\n\n`);
        fs.writeFileSync(`results.txt`, output);
        console.log(`đã lưu ${this.results.length} sự kiện vào results.txt`);
    }

    // Lấy tất cả dữ liệu
    getResults() {
        return this.results;
    }
}

async function startlistening() {
    const browser = await puppeteer.launch({
        devtools: true,
        headless: false,
        args: ["--start-maximized", "--disable-blink-features=AutomationControlled"]

    });
    globalState.browser = browser;

   // const firstPage = await PageService.openNewPage('https://2fa.live/');
    const firstPage = await PageService.openNewPage('https://app.galxe.com/quest/58AUmcj2oPNjd2U9zxN6sX/GC4xvtp6Nr', 'load');
    await PageService.reloadPage(firstPage)
    await firstPage.waitForSelector("body", { visible: true, timeout: 10000 }); // Chờ body xuất hiện

    // Khởi tạo biến trung gian
    const recorder = new ActionRecorder();

    async function setupPageListeners(page, recorder) {
        console.log(`🔍 Đang kiểm tra iframe trên: ${page.url()}`);
    
        // Lấy danh sách tất cả iframe
        const frames = page.frames();
        if (frames.length > 1) {
            console.log(`🖼️ Trang có ${frames.length - 1} iframe(s):`);
            frames.forEach((frame, index) => {
                if (frame !== page.mainFrame()) {
                    console.log(`  ➜ Iframe #${index}: ${frame.url()}`);
                }
            });
        } else {
            console.log("✅ Không có iframe trên trang này.");
        }
    
        // Tiếp tục lắng nghe các sự kiện trên page chính
        const processElement = async (target, eventType) => {
            const xpath = await page.evaluate((el) => {
                function getXPath(element) {
                    if (element.id !== ``) return `//*[@id="${element.id}"]`;
                    if (element === document.body) return element.tagName.toLowerCase();
                    let ix = 0;
                    const siblings = element.parentNode.childNodes;
                    for (let i = 0; i < siblings.length; i++) {
                        const sibling = siblings[i];
                        if (sibling === element)
                            return `${getXPath(element.parentNode)}/${element.tagName.toLowerCase()}[${ix + 1}]`;
                        if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
                            ix++;
                    }
                }
                return getXPath(el);
            }, target);
    
            const selectorcss = await page.evaluate(el => {
                return `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ``}${el.className ? `.${el.className.split(` `).join(`.`)}` : ``}`;
            }, target);
    
            const data = {
                id: ++recorder.actionId,
                event: eventType,
                page: page.url(),
                xpath,
                selectorcss
            };
    
            return data;
        };
    
        await page.exposeFunction('onClick', async (targetHandle) => {
            const data = await processElement(targetHandle, "click");
            recorder.recordAction(data);
            console.log(`📌 Click recorded on: ${page.url()}`);
        });
    
        await page.evaluate(() => {
            document.addEventListener(`click`, (e) => {
                window.onClick(e.target);
            }, true);
        });
    
        await page.exposeFunction('onInput', async (targetHandle) => {
            const data = await processElement(targetHandle, "input");
            recorder.recordAction(data);
            console.log(`📌 Input recorded on: ${page.url()}`);
        });
    
        await page.evaluate(() => {
            let timeoutId = null;
            document.addEventListener(`input`, (e) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    window.onInput(e.target);
                }, 500);
            }, true);
        });
    
        console.log(`🎯 Listeners added for page: ${page.url()}`);
    }
    

    // Gắn listener cho cả hai page, truyền recorder làm biến trung gian
    await setupPageListeners(firstPage, recorder);
   // await setupPageListeners(secondPage, recorder);

    // Lắng nghe các page mới
    browser.on('targetcreated', async (target) => {
        if (target.type() === 'page') {
            const newPage = await target.page();
            await setupPageListeners(newPage, recorder);
            console.log(`đã gắn listener cho page mới: ${newPage.url()}`);
        }
    });

    await new Promise(() => {});
}

startlistening().catch(console.error);