const { workerData, parentPort } = require('worker_threads');
const { BrowserService, ElementService, PageService } = require('../config/import.service');

const MissionPortal = require('../mission/mission.portal'); 
const Util = require('../util/util');
const globalState = require('../config/globalState');
const Twitter = require('../modules/twitter/twitter');
const { axios } = require('../config/module.import');
const MissionMongo = require('../mission/mission.mongo');
const PhantomWallet = require('../modules/wallet/phantom/phantom');

async function run() {
    await Util.waitToRun(workerData)
    globalState.workerData = workerData
    const browser = await BrowserService.launchBrowserWithProfile();
    //const browser = await BrowserService.launchBrowser();
    globalState.browser = browser
    try {
        const chainopera =  await PageService.openNewPage('https://chainopera.ai/quest/?inviteCode=P4J2488A')
        // 0 https://chainopera.ai/quest/?inviteCode=H52R0YCG
        // 1 https://chainopera.ai/quest/?inviteCode=ZINRH5ZU
        // 2 https://chainopera.ai/quest/?inviteCode=P4J2488A
        //@BibbinsZam
        await chainopera.reload()
        let page = null
        async function Await() {
            while (true) {
                page = await PageService.findPageByUrl('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn')
                if (page.check) {
                    console.log("tim thấy")
                    break
                }
                await Util.sleep(2000)
            }
        }
        await Await()
        const pagePartalWallet = await PageService.getTargetPage(page.url)
        await ElementService.HandlefindAndTypeElement(pagePartalWallet, `//input[@id="password"]`, process.env.PASS_PORTAL) 
        await pagePartalWallet.keyboard.press("Enter")

        await PageService.openFirstPage('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#')
        




       // 
       //await PhantomWallet.CreateWallet()
        ////await MissionPortal()
       // await Twitter.loginAndCheckCookie()
    
        //await MissionMongo()
        parentPort.postMessage({ status: 'Success' });
    } catch (error) {
        console.log(`${workerData.Profile} that bai`, error)
        parentPort.postMessage({ status: 'Failure' });
    } finally {
        if (globalState.closeWorker) {
            await BrowserService.closeBrowser()
        }
    }
}

run()





// await AutoDiscord.checklogOut(browser, workerData.token_discord, workerData.Profile)
       // await Auto.openFirstPage(browser,'https://discord.com/app')

       // await portal.Add2captra(browser)
       // await portal.CreateHotMail(browser)


        // await AutoDiscord.create(browser, email, name)
        // if (!task.task1) {
        //     await portal.DownLoad(browser)
        // }
        // if (!task.task2) {
        //     await portal.InputPortal(browser, 'task3', task)
        // }
        // if (!task.task3) {
            //  await AutoX.checkCookieX(browser, workerData.Profile)
            //  await AutoDiscord.checklogOut(browser, workerData.token_discord, workerData.Profile)
        //     // await AutoX.follow(browser, "portaltobitcoin")
        //     // await AutoX.follow(browser, "bonus_block")
        //     // await AutoX.Report(browser, '1866215278184669404')  
        // }

        // const performCtrlEnter = async (pageBlock) => {
        //     while (true) {
        //         await sleep(3000)
        //         console.log('Performing Ctrl + Enter');
        //         await pageBlock.keyboard.down('Control');
        //         await pageBlock.keyboard.press('Enter');
        //         await pageBlock.keyboard.up('Control');
        //         await sleep(3000)
        //     }
        // };


        // if (!task.task4) {
        //    await portal.Unblock(browser, 'task5', task)
        //    //await portal.faucet(browser, 'task6', task)
        // }
        // if (!task.task5) {
        //     await portal.faucet(browser, 'task6', task)
        // }
    
        // if (!task.task5) {
        //    // await portal.Add2captra(browser)
        //     //await portal.CreateHotMail(browser)
        //    //await AutoGoogle.Create(browser)
        //   // const page = await Auto.openFirstPage(browser, 'https://web.telegram.org/a/')

        //     const page = await Auto.openFirstPage(browser, 'https://login.live.com/')
        //     await HandlefindAndTypeElement(
        //         page,
        //         "//*[@id='i0116']",
        //         `${workerData.hotmail}`,
        //         10
        //     )
        //     await HandlefindAndClickElement(
        //         page,
        //         "//*[@id='idSIButton9']",
        //         10
        //     )
        //     await HandlefindAndTypeElement(
        //         page,
        //         "//*[@id='i0118']",
        //         'Hunghung123@',
        //         10
        //     )
        //     await page.keyboard.press('Enter');
            
        //     // //const strawberry = await Auto.openFirstPage(browser, 'https://strawberry.ai/?r=MDbLT')
            
        //     // await AutoX.checkCookieX(browser, workerData, false)
             
        //    // await portal.CreateHotMail(browser)
        //     //await AutoX.checkCookieX(browser, workerData)
        //     //await AutoDiscord.checklogOut(browser, workerData.token_discord, workerData.Profile)
        //     //await portal.Unblock(browser, 'task6', task)
        // }
        // await sleep(50000)
        // await page.close()
        // await browser.close()