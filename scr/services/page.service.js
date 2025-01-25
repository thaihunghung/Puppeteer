const globalState = require("../config/globalState");
const Util = require("../util/util");


class PageService {
    static async createNewTab() {
        if (!globalState.browser) {
            throw new Error("Browser not initialized");
        }
        const newPage = await globalState.browser.newPage();
        if (globalState.showPage){
            console.log("New tab created"); 
        }
        return newPage;
    }

    static async getPage(tabIndex = 0) {
        const pages = await globalState.browser.pages();
        const targets = globalState.browser.targets();
        const pageTarget = targets.find(t => t.type() === 'page' && t.url().includes('chromewebstore.google.com'));
        
        
        if (tabIndex >= pages.length) {
            throw new Error("Tab index out of range");
        }
        return pages[tabIndex];
    }

    static acceptAlert(page) {
        try {
            page.on('dialog', async (dialog) => {
                console.log(`Dialog message: ${dialog.message()}`);
                await dialog.accept();
                console.log('Alert accepted');
            });
            return true;
        } catch (error) {
            console.error(`Error accepting alert: ${error.message}`);
            return false;
        }
    }

    static async getTargetPage(targetUrl) {
        try {
            
            if (globalState.showPage){
                console.log(`Waiting for target page with URL: ${targetUrl}`);
            }
            const target = await globalState.browser.waitForTarget(
                (target) => target.url() === targetUrl,
                { timeout: 3000 }
            );

            if (!target) {
                console.warn(`Timeout: Target with URL ${targetUrl} not found.`);
                return null;
            }

            const page = await target.page();
            if (!page) {
                console.warn('Unable to access the target page object.');
                return null;
            }

            if (globalState.showPage){
                console.log(`Target page found: ${targetUrl}`);
            }
            return page;
        } catch (error) {
            console.error(`Error while waiting for target page: ${error.message}`);
            return null;
        }
    }

    static async defaultBrowserContext(website) {
        const context = globalState.browser.defaultBrowserContext();
        context.overridePermissions(website, ["notifications"]);
    }

    static async getLastPageUrl() {
        try {
            const pages = await globalState.browser.pages();
            if (pages.length === 0) {
                if (globalState.showPage){
                    console.log("No pages found.");
                } 
                return null;
            }

            const lastPage = pages[pages.length - 1];
            const lastPageUrl = lastPage.url();
            if (globalState.showPage){
                console.log(`Last page URL: ${lastPageUrl}`);
            } 
            return lastPageUrl;
        } catch (error) {
            console.error(`Error while getting the last page URL: ${error.message}`);
            throw error;
        }
    }

    static async findPageByUrl(targetUrl) {
        try {
            const pages = await globalState.browser.pages();
            for (const page of pages) {
                const url = page.url();
                if (url.includes(targetUrl)) {     
                    if (globalState.showPage){
                        console.log(`Found page with URL: ${url}`);
                    } 
                    return { check: true, url };
                }
            }
            if (globalState.showPage){
                console.warn(`No page found containing URL: ${targetUrl}`);
            }  
            
            return { check: false, url: null };
        } catch (error) {
            if (globalState.showPage){
                console.error(`Error while searching for page by URL: ${error.message}`);
            }  
            
            return { check: false, error: error.message };
        }
    }
    
    static async findAllUrl() {
        try {
            const pages = await globalState.browser.pages();
            for (const page of pages) {
                const url = page.url();
                if (globalState.showPage){
                    console.log(`Found page with URL: ${url}`)
                }  
            }
        } catch (error) {
            console.error(`Error while searching for page by URL: ${error.message}`);
            return { check: false, error: error.message };
        }
    }

    static async getTargetPageByIncludes(targetUrl) {
        try {
            if (globalState.showPage){
                console.log(`Looking for target page containing URL: ${targetUrl}`);
            }  
            
            const pageCheck = await this.findPageByUrl(targetUrl);
            if (pageCheck.check) {
                if (globalState.showPage){
                    console.log(`Target page already exists with URL: ${pageCheck.url}`);
                } 
                
                return null; 
            }

            const target = await globalState.browser.waitForTarget(
                (target) => target.url().includes(targetUrl),
                { timeout: 100000 }
            );

            if (!target) {
                console.warn(`Timeout: Target with URL containing ${targetUrl} not found.`);
                return null;
            }

            const page = await target.page();
            if (!page) {
                console.warn('Unable to access the target page object');
                return null;
            }
            if (globalState.showPage){
                console.log(`Target page found: ${target.url()}`);
            } 
            
            return page; // Chỉ trả về đối tượng page
        } catch (error) {
            console.error(`Error while waiting for target page: ${error.message}`);
            return null;
        }
    }


    static async switchToPage(partialUrl) {
        try {
            const pages = await globalState.browser.pages();

            for (const page of pages) {
                const url = await page.url();
                
                if (globalState.showPage){
                    console.log(`Checking page: ${url}`);
                } 
                if (url.includes(partialUrl)) {
                    if (globalState.showPage){
                        console.log(`Found page with URL including: ${partialUrl}`);
                    } 
                    
                    await page.bringToFront();
                    return page;
                }
            }

            return null;
        } catch (error) {
            console.error(`Error while switching to page: ${error.message}`);
            throw error;
        }
    }
    static async closeToRight(startUrl) {
        const pages = await globalState.browser.pages(); // Lấy danh sách tất cả các trang hiện có
        let startIndex = -1;
    
        // Tìm index của trang có URL được chỉ định
        for (let i = 0; i < pages.length; i++) {
            const pageUrl = await pages[i].url();
            if (pageUrl === startUrl) {
                startIndex = i;
                break;
            }
        }
    
        // Nếu không tìm thấy URL, thông báo và thoát
        if (startIndex === -1) {
            console.log(`Không tìm thấy URL: ${startUrl}`);
            return;
        }
    
        // Đóng tất cả các trang từ index -> length
        for (let i = startIndex + 1; i < pages.length; i++) {
            await pages[i].close();
        }
    
        console.log(`Đã đóng tất cả các tab từ index ${startIndex + 1} trở đi.`);
    }
    

    static async switchToPageByIndex(tabIndex) {
        try {
            const pages = await globalState.browser.pages();

            if (tabIndex < 0 || tabIndex >= pages.length) {
                throw new Error(`Invalid tabIndex: ${tabIndex}. Total pages: ${pages.length}`);
            }

            const page = pages[tabIndex];
            const url = await page.url();
            if (globalState.showPage){
                console.log(`Switching to tab at index ${tabIndex} with URL: ${url}`);
            } 

            await page.bringToFront();
            return page;
        } catch (error) {
            console.error(`Error while switching to page by index: ${error.message}`);
            throw error;
        }
    }


    static async closePageByIncludes(partialUrl, exceptions = []) {
        try {
            const pages = await globalState.browser.pages();
            let closedCount = 0;
    
            for (const page of pages) {
                const url = page.url();
    
                if (globalState.showPage) {
                    console.log(`Checking page: ${url}`);
                }
    
                // Kiểm tra nếu URL là ngoại lệ
                const isException = exceptions.some((exceptionUrl) => url.includes(exceptionUrl));
                if (isException) {
                    if (globalState.showPage) {
                        console.log(`Skipping page with URL (exception): ${url}`);
                    }
                    continue; // Bỏ qua trang trong danh sách ngoại lệ
                }
    
                // Kiểm tra nếu URL phù hợp với partialUrl
                if (url.includes(partialUrl)) {
                    if (globalState.showPage) {
                        console.log(`Closing page with URL: ${url}`);
                    }
    
                    await page.close();
                    closedCount++;
                }
            }
    
            if (closedCount > 0) {
                if (globalState.showPage) {
                    console.log(`Closed ${closedCount} page(s) with URL including: ${partialUrl}`);
                }
                return true;
            } else {
                if (globalState.showPage) {
                    console.log(`No page found with URL including: ${partialUrl}`);
                }
                return false;
            }
        } catch (error) {
            console.error(`Error while closing pages: ${error.message}`);
            throw error;
        }
    }
    
    static async closeIndexPage(index) {
        const pages = await globalState.browser.pages();
        if (pages[index]) {
            if (globalState.showPage){
                console.log(`Đóng tab: ${pages[index].url()}`);
            }
            
            await pages[index].close();
            return true;
        }
    }
    static async openNewPage(url) {
        try {
            const page = await this.createNewTab();
            await Util.sleep(1000)
            await page.goto(url, {
                timeout: 150000,
                waitUntil: 'domcontentloaded',
            });
            return page;
        } catch (error) {
            console.error('Error opening page:', error);
            throw error;
        }
    }

    static async openFirstPage(url) {
        try {
            const page = await this.getPage()
           this.acceptAlert(page)
            await page.goto(url, {
                timeout: 150000,
                waitUntil: 'domcontentloaded',
            });
            return page;
        } catch (error) {
            console.error('Error opening page:', error);
            throw error;
        }
    }

    static async getCookiesByOrder(page, cookieNames = []) {
        try {
            const cookies = await page.cookies();

            // Lọc danh sách cookies theo tên trong `cookieNames`
            const result = {};
            cookieNames.forEach(name => {
                const cookie = cookies.find(c => c.name === name);
                result[name] = cookie || null;
            });
            if (globalState.showPage){
                console.log(result)
            }
            
            return result;
        } catch (error) {
            console.error('Lỗi trong quá trình lấy cookies:', error);
            // Trả về object với giá trị null cho mỗi cookie trong danh sách
            return cookieNames.reduce((acc, name) => {
                acc[name] = null;
                return acc;
            }, {});
        }
    }

    static async getCookies(page) {
        try {
            const cookies = await page.cookies();
            return cookies
        } catch (error) {
            return []
        }
    }
    static async getCookiesByOrder(page, cookieNames = []) {
        try {
            const cookies = await page.cookies();
            const result = cookieNames.map(name => {
                const cookie = cookies.find(c => c.name === name);
                return cookie || null;
            });

            return result;
        } catch (error) {
            console.error('Lỗi trong quá trình lấy cookies:', error);
            return cookieNames.map(() => null);
        }
    }
}

module.exports = PageService;
