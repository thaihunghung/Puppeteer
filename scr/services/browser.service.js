
const globalState = require("../config/globalState");
const { fs, proxyChain,
     //puppeteer 
    } = require("../config/module.import");
    const puppeteer = require("puppeteer");
class BrowserService {
    static browser = null;
    constructor() {}

    static async launchBrowserWithProfile(devtool = false, mobile = false, headless = false) {
        const { profile, proxy } = globalState.workerData;

        const userDataDir = `E:\\puppeteer-auto-meta-proxy\\profile\\${profile}`;

        if (!fs.existsSync(userDataDir)) {
            fs.mkdirSync(userDataDir, { recursive: true });
        }

        let proxyArg = '';
        let profileDirectory = 'Profile 1';

        const match = profile.match(/__Profile _(\d+)/);
        if (!match) {
            throw new Error('Invalid profilePath format');
        }

        const index = parseInt(match[1], 10);

        switch (index) {
            case 40:
                profileDirectory = 'Profile 2';
                break;
            case 41:
            case 42:
                const newProxyUrl = await proxyChain.anonymizeProxy(proxy);
                proxyArg = `--proxy-server=${newProxyUrl}`;
                profileDirectory = index === 41 ? 'Profile 3' : 'Profile 2';
                break;
            default:
                const defaultProxyUrl = await proxyChain.anonymizeProxy(proxy);
                proxyArg = `--proxy-server=${defaultProxyUrl}`;
                break;
        }
        const extensions = [
            'E:\\puppeteer-auto-meta-proxy\\extensions\\yescaptra',
            'E:\\puppeteer-auto-meta-proxy\\extensions\\MetaMask\\nkbihfbeogaeaoehlefnkodbefgpgknn',
            //'E:\\puppeteer-auto-meta-proxy\\extensions\\Mango',
           // 'E:\\puppeteer-auto-meta-proxy\\extensions\\OKX',
        ];
        // if (globalState.MetaOpen) {
        //     extensions.push('E:\\puppeteer-auto-meta-proxy\\extensions\\MetaMask\\nkbihfbeogaeaoehlefnkodbefgpgknn');
        // }
        // if (globalState.MangoOpen) {
        //     extensions.push('E:\\puppeteer-auto-meta-proxy\\extensions\\Mango');
        // }
        // if (globalState.ProxyOpen) {
        //     extensions.push('E:\\puppeteer-auto-meta-proxy\\extensions\\proxy');
        // }

        const extensionsPaths = extensions.join(',');
        try {
            BrowserService.browser = await puppeteer.launch({
                devtools: devtool,
                headless: headless,
                executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
                userDataDir: userDataDir,
                ignoreDefaultArgs: ["--disable-extensions", "--enable-automation"],
                args: [
                    `--profile-directory=${profileDirectory}`,
                    proxyArg,
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-software-rasterizer',
            '--disable-background-networking',
            '--disable-default-apps',
            '--disable-sync',
            '--disable-translate',
            '--disk-cache-size=0', // 🔥 Tắt cache trên ổ cứng
            '--disable-cache', // 🔥 Tắt hoàn toàn cache
            '--aggressive-cache-discard', // 🔥 Xóa cache ngay khi có thể
            '--disable-application-cache', // 🔥 Vô hiệu hóa cache của trình duyệt


                    //'--disable-extensions-except=E:\\puppeteer-auto-meta-proxy\\extensions\\MetaMask\\nkbihfbeogaeaoehlefnkodbefgpgknn',
                    `--load-extension=${extensionsPaths}`,
                    
                ].filter(arg => arg), 
                defaultViewport: mobile
                ? { width: 500} // Kích thước mobile (ví dụ: iPhone X)
                : null,
            });
            BrowserService.browser.on('disconnected', () => {
                globalState.isPageClosed = true;
            });
            
            console.log("Browser launched successfully");
            return BrowserService.browser;
        } catch (error) {
            console.error("Error launching browser:", error);
            throw error;
        }
    }
    static async launchBrowser(devtool = false, headless = false) {
        try {
            BrowserService.browser = await puppeteer.launch({
                devtools: devtool,
                headless: headless,
                executablePath: "E:\\puppeteer-auto-meta-proxy\\chrome\\win64-116.0.5793.0\\chrome-win64\\chrome.exe",
                ignoreDefaultArgs: ["--disable-extensions", "--enable-automation"],
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    `--load-extension=E:\\puppeteer-auto-meta-proxy\\extensions\\MetaMask\\nkbihfbeogaeaoehlefnkodbefgpgknn`,
                    '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.91 Safari/537.36',
                ].filter(arg => arg), 
                defaultViewport: null,
            });
            BrowserService.browser.on('disconnected', () => {
                globalState.isPageClosed = true;
            });
            console.log("Browser launched successfully");
            return BrowserService.browser;
        } catch (error) {
            console.error("Error launching browser:", error);
            throw error;
        }
    }
    
    static async closeBrowser() {
        if (BrowserService.browser) {
            await BrowserService.browser.close();
            BrowserService.browser = null; 
            console.log("Browser closed");
        }
    }
}

module.exports = BrowserService
