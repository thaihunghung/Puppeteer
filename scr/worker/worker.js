const { workerData, parentPort } = require('worker_threads');
const { BrowserService } = require('../config/import.service');

//const MissionPortal = require('../mission/mission.portal'); 
const Util = require('../util/util');
const globalState = require('../config/globalState');
// const MissionGoplus = require('../mission/mission.goplus');
// const MissionDetrading = require('../mission/misssion.detrading');
const MissionPumdao = require('../mission/mission.pumdao');

async function run() {
    await Util.waitToRun(workerData)
    globalState.workerData = workerData
    const browser = await BrowserService.launchBrowserWithProfile();
    globalState.browser = browser
    try {
        await MissionPumdao()
        parentPort.postMessage({ status: 'Success' });
    } catch (error) {
        console.log(`${workerData.Profile} that bai`, error)
        parentPort.postMessage({ status: 'Failure' });
    } finally {
        await Util.sleep(20000)
        await BrowserService.closeBrowser()
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