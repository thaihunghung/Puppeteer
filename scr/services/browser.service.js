
const globalState = require("../config/globalState");
const { fs, proxyChain, puppeteer } = require("../config/module.import");

class BrowserService {
    static browser = null;
    constructor() {}

    static async launchBrowserWithProfile(devtool = false, headless = false) {
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

        try {
            BrowserService.browser = await puppeteer.launch({
                devtools: devtool,
                headless: headless,
                executablePath: "E:\\puppeteer-auto-meta-proxy\\chrome\\win64-116.0.5793.0\\chrome-win64\\chrome.exe",
                userDataDir: userDataDir,
                ignoreDefaultArgs: ["--disable-extensions", "--enable-automation"],
                args: [
                    `--profile-directory=${profileDirectory}`,
                    proxyArg,
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    `--load-extension=E:\\puppeteer-auto-meta-proxy\\extensions\\yescaptra`,
                    '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.91 Safari/537.36',
                ].filter(arg => arg),
                defaultViewport: null,
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
