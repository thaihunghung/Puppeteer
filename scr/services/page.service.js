const globalState = require("../config/globalState");


class PageService {
    static async createNewTab() {
        if (!globalState.browser) {
            throw new Error("Browser not initialized");
        }
        const newPage = await globalState.browser.newPage();
        console.log("New tab created");
        return newPage;
    }

    static async getPage(tabIndex = 0) {
        const pages = await globalState.browser.pages();
        if (tabIndex >= pages.length) {
            throw new Error("Tab index out of range");
        }
        return pages[tabIndex];
    }

    async acceptAlert(page) {
        try {
            page.on('dialog', async (dialog) => {
                console.log(`Dialog message: ${dialog.message()}`);
                await dialog.accept();
                console.log('Alert accepted');
            });
            await page.evaluate(() => alert('accepting alert!'));
            return true;
        } catch (error) {
            console.error(`Error accepting alert: ${error.message}`);
            return false;
        }
    }

    static async getTargetPage(targetUrl) {
        try {
            console.log(`Waiting for target page with URL: ${targetUrl}`);

            const target = await globalState.browser.waitForTarget(
                (target) => target.url() === targetUrl,
                { timeout: 150000 }
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

            console.log(`Target page found: ${targetUrl}`);
            return page;
        } catch (error) {
            console.error(`Error while waiting for target page: ${error.message}`);
            return null;
        }
    }

    static async getLastPageUrl() {
        try {
            const pages = await globalState.browser.pages();
            if (pages.length === 0) {
                console.log("No pages found.");
                return null;
            }

            const lastPage = pages[pages.length - 1];
            const lastPageUrl = lastPage.url();

            console.log(`Last page URL: ${lastPageUrl}`);
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
                    console.log(`Found page with URL: ${url}`);
                    return { check: true, url };
                }
            }

            console.warn(`No page found containing URL: ${targetUrl}`);
            return { check: false, url: null };
        } catch (error) {
            console.error(`Error while searching for page by URL: ${error.message}`);
            return { check: false, error: error.message };
        }
    }

    static async getTargetPageByIncludes(targetUrl) {
        try {
            console.log(`Looking for target page containing URL: ${targetUrl}`);

            const pageCheck = await this.findPageByUrl(targetUrl);
            if (pageCheck.check) {
                console.log(`Target page already exists with URL: ${pageCheck.url}`);
                return { page: null, url: pageCheck.url };
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

            console.log(`Target page found: ${target.url()}`);
            return { page: page, url: target.url() };
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
            console.log(`Checking page: ${url}`);
      
            if (url.includes(partialUrl)) {
              console.log(`Found page with URL including: ${partialUrl}`);
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

    static async closePageByIncludes(partialUrl) {
        try {
            const pages = await globalState.browser.pages();
            let closedCount = 0;

            for (const page of pages) {
                const url = page.url();
                console.log(`Checking page: ${url}`);
                if (url.includes(partialUrl)) {
                    console.log(`Closing page with URL: ${url}`);
                    await page.close();
                    closedCount++;
                }
            }

            if (closedCount > 0) {
                console.log(`Closed ${closedCount} page(s) with URL including: ${partialUrl}`);
                return true
            } else {
                console.log(`No page found with URL including: ${partialUrl}`);
                return false
            }
        } catch (error) {
            console.error(`Error while closing pages: ${error.message}`);
            throw error;
        }
    }
    static async closeIndexPage(index) {
        const pages = await globalState.browser.pages();
        if (pages[index]) {
            console.log(`Đóng tab: ${pages[index].url()}`);
            await pages[index].close();
            return true; 
        }
    }
    static async openNewPage(url) {
        try {
            const page = await this.createNewTab();
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
