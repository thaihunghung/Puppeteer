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
        //await Twitter.loginAndCheckCookie()
      // const chainopera =  await PageService.openNewPage('https://chainopera.ai/quest')
        // main https://chainopera.ai/quest/?inviteCode=IUOVPVA2
        // 1 https://chainopera.ai/quest/?inviteCode=H52R0YCG done
        // 2 https://chainopera.ai/quest/?inviteCode=ZINRH5ZU done
        // 3 https://chainopera.ai/quest/?inviteCode=P4J2488A done
        // 4 https://chainopera.ai/quest/?inviteCode=EM4AUGIF done
        // 5 https://chainopera.ai/quest/?inviteCode=2CT798H8 done
        // 6 https://chainopera.ai/quest/?inviteCode=HTJKQ6QP done
        // 7 https://chainopera.ai/quest/?inviteCode=54GAVKGG done
        // 8 https://chainopera.ai/quest/?inviteCode=7H5CQHCN done
        // 9 https://chainopera.ai/quest/?inviteCode=LTD9WQJE done
        // 10 https://chainopera.ai/quest/?inviteCode=KHUBNSU4 done
        // 11 
        // 12 https://chainopera.ai/quest/?inviteCode=6IV9JQ5I
        // 13 https://chainopera.ai/quest/?inviteCode=1UL2F2IZ
        // 14 https://chainopera.ai/quest/?inviteCode=NIAZBT9R
        // 15 https://chainopera.ai/quest/?inviteCode=F72DRX1Q
        // 16 https://chainopera.ai/quest/?inviteCode=F2MKL1IH
        // 17 https://chainopera.ai/quest/?inviteCode=PIDBYRBP
        // 18 https://chainopera.ai/quest/?inviteCode=Y0EADXIA
        // 19 https://chainopera.ai/quest/?inviteCode=28X2NBAP
        // 20 https://chainopera.ai/quest/?inviteCode=SSIJJBVG
        //@ducxomchoi123
        //@partypple
      var token = null
      const discord = await PageService.openNewPage('https://discord.com/app')
      discord.on('request', (request) => {
        let tokenLogged = false;
        const headers = request.headers();
        if (headers.authorization && !tokenLogged) {
          console.log(`${workerData.profile}`, headers.authorization);
          token = headers.authorization
          tokenLogged = true;
        }
      });
      console.log(`var:`, token);

    //     await chainopera.reload()
    //     let page = null
    //     async function Await() {
    //         while (true) {
    //             page = await PageService.findPageByUrl('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn')
    //             if (page.check) {
    //                 console.log("tim thấy")
    //                 break
    //             }
    //             await Util.sleep(2000)
    //         }
    //     }
    //     await Await()
    //     const pagePartalWallet = await PageService.getTargetPage(page.url)
    //     await ElementService.HandlefindAndTypeElement(pagePartalWallet, `//input[@id="password"]`, 'hunghung') 
    //     await pagePartalWallet.keyboard.press("Enter")

    //    //await PageService.openFirstPage('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#')

    //     while (true) {
    //        const page1 = await PageService.findPageByUrl('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn')
    //         if (page1.check) {
    //             const pagePartalWallet = await PageService.getTargetPage(page1.url)
    //             await ElementService.HandlefindAndClickElement(pagePartalWallet, `//button[@data-testid="confirm-footer-button"]`) 
    //         }
    //         await Util.sleep(5000)
    //     }




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