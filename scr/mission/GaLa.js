const globalState = require("../config/globalState");
const { PageService, ElementService } = require("../config/import.service");
const { Twitter, Hotmail } = require("../config/import.social.media");
const { Util } = require("../config/import.util");
const OkxWallet = require("../modules/wallet/okx/okx");
const PartalWallet = require("../modules/wallet/partal/partal");

async function GalaMission() {
    try {     
         await OkxWallet.download()
        await OkxWallet.CreateWallet()
        const page = await PageService.openFirstPage('chrome://extensions/')
        const keepUrls = [
            'https://app.galxe.com/quest/xstar/GChXotpYGa',
            'https://app.galxe.com/quest/xstar/GCA7otpCcp',
            'https://app.galxe.com/quest/xstar/GC9SptpUn9'
        ];
        
        // Hàm xử lý login và thực hiện các thao tác cơ bản
        async function handlePageFlow(url, keepUrl, xpath) {
            const page = await PageService.openNewPage(url);
            PageService.acceptAlert(page);
            await Util.sleep(5000);
            await page.reload();
        
            if (await ElementService.HandlefindAndClickElementText(page, 'Log in')) {
                await ElementService.HandlefindAndClickElementText(page, 'Recent', 10);
                await OkxWallet.ConnectOKX(5);
            }
        
            if (xpath) {
                await ElementService.HandlefindAndClickElement(page, xpath);
            }
        
            if (await ElementService.HandlefindAndClickElementText(page, 'Continue to Access')) {
                await PageService.switchToPage(keepUrl);
                await Util.sleep(10000);
                await PageService.closeToRight(keepUrl);
            }
        
            await script(page);
            await Util.sleep(10000);
            await PageService.closeToRight(keepUrl);
            await ElementService.HandlefindAndClickElementText(page, 'Participate');
        }
        
        // Hàm chính để xử lý các trang
        async function main() {
            const initialPage = await PageService.openFirstPage('https://app.galxe.com/quest/xstar/GCGuotpav5');
            await Util.sleep(5000);
            await initialPage.reload();
        
            if (await ElementService.HandlefindAndClickElementText(initialPage, 'Log in')) {
                await ElementService.HandlefindAndClickElementText(initialPage, 'Recent', 10);
                await OkxWallet.ConnectOKX(5);
            }
        
            // Xử lý từng trang với logic tái sử dụng
            await handlePageFlow(keepUrls[0], keepUrls[0], '/html/body/div[1]/main/div[1]/section/div/div[1]/div[2]/div[3]/div[1]/div[4]/div');
            await handlePageFlow(keepUrls[1], keepUrls[1], '/html/body/div[1]/main/div[1]/section/div/div[1]/div[2]/div[3]/div[1]/div[5]/div');
            await handlePageFlow(keepUrls[2], keepUrls[2], '/html/body/div[1]/main/div[1]/section/div/div[1]/div[2]/div[3]/div[1]/div[6]/div');
        }
        
        main();
    } catch (error) {
        console.log(` that bai`, error)
    } 
}

module.exports = GalaMission