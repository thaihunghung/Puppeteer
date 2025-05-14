const { workerData, parentPort } = require('worker_threads');
const { BrowserService, ElementService, PageService } = require('../config/import.service');

const MissionPortal = require('../mission/mission.portal');
const Util = require('../util/util');
const globalState = require('../config/globalState');
const Twitter = require('../modules/twitter/twitter');
const { axios, path } = require('../config/module.import');
const MissionMongo = require('../mission/mission.mongo');
const PhantomWallet = require('../modules/wallet/phantom/phantom');
const MetaWallet = require('../modules/wallet/metamask/meta');
const axiosService = require('../services/axios.service');
const OkxWallet = require('../modules/wallet/okx/okx');
const SuiWallet = require('../modules/wallet/sui/sui');
const GalaMission = require('../mission/GaLa');
const JsonDataService = require('../services/json.service');
const Discord = require('../modules/discord/discord');
const { promises } = require('readline');
const Tmail_wibucrypto_pro = require('../modules/email/tmail.wibucrypto.pro');

async function run() {
    //await Util.waitToRun(workerData)
    globalState.workerData = workerData
    const browser = await BrowserService.launchBrowserWithProfile();
    globalState.browser = browser
    let isPageClosed = false
    let ScriptStart = false
    let isPagediscordClosed = false
    const waitUntil = {
        load: 'load',
        domcontentloaded: 'domcontentloaded',
        networkidle0: 'networkidle0',
        networkidle2: 'networkidle2'
    }
    async function performTwitterAuthActions() {
        while (true) {
            await Util.sleep(5000);
            if (globalState.isPageClosed) break

            const [pageTarget1, pageTarget2] = await Promise.all([
                PageService.findPageByUrl('https://twitter.com/i/oauth2/authorize'),
                PageService.findPageByUrl('https://twitter.com/i/flow/login?redirect_after_login='),
            ]);

            if (pageTarget1.check) {
                const page = await PageService.getTargetPage(pageTarget1.url);
                if (await ElementService.clickButton(page, `[data-testid="OAuth_Consent_Button"]`)) break
            }

            if (pageTarget2.check) {
                const page = await PageService.getTargetPage(pageTarget2.url);
                await ElementService.waitAndType(page,
                    "input[name='text'][type='text'][autocomplete='username']",
                    globalState.workerData.twitter.user
                );

                await ElementService.HandlefindAndClickElement(
                    page,
                    "//button[@role='button' and .//span/span[text()='Next']]"
                );
                await ElementService.HandlefindAndTypeElement(
                    page,
                    "//input[@type='password' and @name='password' and @autocomplete='current-password']",
                    'Hunghung123'
                );
                await ElementService.HandlefindAndClickElement(
                    page,
                    "//button[@role='button' and .//span/span[text()='Log in']]"
                );

                const auth2fa = globalState.workerData.twitter.auth2fa;
                console.log('auth2fa', auth2fa);

                await Util.sleep(5000);

                const inputSelector = '[data-testid="ocfEnterTextTextInput"]';
                const inputElement = await ElementService.ElementWaitForSelector(page, inputSelector, 10);

                if (inputElement.found) {
                    await Util.waitFor1sAnd30s();
                    const auth = await axiosService.get2faToken(auth2fa);
                    await inputElement.element.type(auth);
                }

                await ElementService.HandlefindAndClickElement(
                    page,
                    "//button[@role='button' and .//span/span[text()='Next']]",
                );

                if (await ElementService.waitAndClick(page, `[data-testid="OAuth_Consent_Button"]`)) break
            }

        }
    }
    async function closePageWhenUrlMatches(targetUrl) {
        globalState.browser.on('targetcreated', async (target) => {
            try {
                const page = await target.page();
                if (!page) return; // Nếu không có page, thoát khỏi hàm

                await page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => { });
                const currentUrl = page.url();
                // console.log(`Tab mới mở với URL: ${currentUrl}`);

                if (currentUrl.includes(targetUrl)) {
                    // console.log('URL trùng khớp, đóng tab...');
                    await page.close();
                }
            } catch (error) {
                console.error('Lỗi khi xử lý targetcreated:', error);
            }
        });


        try {
            const pages = await globalState.browser.pages();
            for (const page of pages) {
                const currentUrl = await page.url();
                if (currentUrl.includes(targetUrl)) {
                    console.log('URL trùng khớp, đóng tab ngay...');
                    await page.close();
                }
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra các tab đã mở:', error);
        }
    }
    try {
        const page = await PageService.openNewPage('https://tmail.wibucrypto.pro/mailbox', waitUntil.load)
        

        // const jsonGalxe = {
        //     url: 'https://app.galxe.com/quest/xstar/GCJb2tprSj',
        //     discord: {
        //         mission_discord: true, // Changed to boolean for better checking
        //         Check_login: false,
        //         mission_url: ['https://discord.com/invite/KqR8Tr57Kw', 'https://discord.com/invite/KsdzggWBB7']
        //     },
        //     twitter: {
        //         mission_twitter: false, // Changed to boolean for better checking
        //         Check_login: false,
        //         mission_url: []
        //     }
        // };

        // const email = await Tmail_wibucrypto_pro.GetEmail()

        // const sandwatch = await PageService.openNewPage('https://www.infinityg.ai/voyage/?inviteCode=04CZJ0', waitUntil.load)  
        // await PageService.reloadPage(sandwatch)
        // await OkxWallet.Unblock(true)
        // await ElementService.waitAndClick(sandwatch, '.login')
        // await ElementService.waitAndClick(sandwatch, '.icon-okx')
        
        // //
        // await OkxWallet.CreateWallet()

        // // await PageService.reloadPage(sandwatch)
        // async function getVerificationCode() {
        //     console.log("Đang tìm mã xác nhận trong mail...");

        //     while (true) {
        //         const pageMail = await getTabByIndex(1);
        //         await Util.sleep(5000);

        //         const emailFound = await ElementService.HandlefindAndElementText(pageMail, 'noreply@particle.network');
        //         if (emailFound) {
        //             const [element] = await pageMail.$$("//div[contains(text(), 'Your verification code is')]");
        //             if (element) {
        //                 const code = await pageMail.evaluate(el => el.textContent.match(/\d{6}/)?.[0] || null, element);
        //                 console.log('Mã xác minh:', code);
        //                 return code;
        //             }
        //         }

        //         console.log("Không tìm thấy email, thử lại sau 5 giây.");
        //         await Util.sleep(5000);
        //     }
        // } 
        // async function getTabByIndex(index) {
        //     const pages = await globalState.browser.pages();
        //     if (index < pages.length) {
        //         const page = pages[index];
        //         await page.bringToFront();
        //         return page;
        //     } else {
        //         throw new Error("Index tab không hợp lệ!");
        //     }
        // }
        // const clickall = async (page) => {
        //     const buttons = await page.$$('.claimPoints');
        //     for (const button of buttons) {
        //         await button.click(); // Click từng button
        //         await page.waitForTimeout(500); // Chờ 0.5s giữa mỗi click (tuỳ chỉnh nếu cần)
        //     }
        // }
        // const EmailConnect = async (page) => {
        //     while (true) {
        //         if (await ElementService.HandlefindAndElementText(page, "Email Connect", 1)) {
        //             break
        //         }
        //         if (globalState.isPageClosed) {
        //             console.log("thoat");
        //             return;
        //         }
        //         await Util.sleep(3000)
        //     }
        //     await ElementService.waitAndType(page, 'input[id="nest-messages_user_name"]', email)
        //     await ElementService.HandlefindAndClickElementText(page, 'Send code')
        //     await getVerificationCode(page)
        //     await ElementService.HandlefindAndClickElementText(page, 'Connect')
        // }


        // await Promise.all([
        //     await closePageWhenUrlMatches('https://www.okx.com/web3/extension/welcome'),
        //     performTwitterAuthActions(),
        //     OkxWallet.Connect(),
        //     OkxWallet.Unblock(),
        //     clickall(sandwatch),
        //     EmailConnect(sandwatch),
        //     await closePageWhenUrlMatches('https://t.me/InfinityGround_AI/1'),
        //     await closePageWhenUrlMatches('https://t.me/InfinityGround_bot'),
        //     await closePageWhenUrlMatches('https://t.me/InfinityGroundAnn'),
        //     await closePageWhenUrlMatches('https://x.com/intent/follow?screen_name=infinityg_ai'),
        //     await closePageWhenUrlMatches('https://x.com/infinityg_ai/status/1892762239758979551'),
        // ])



        // const galxe = await PageService.openNewPage('https://app.galxe.com/quest/xstar/GCMQ2tpR7M', waitUntil.load)
        // await PageService.openNewPage('https://discord.com/invite/KqR8Tr57Kw', waitUntil.load)
        // await PageService.reloadPage(galxe)
        // await PhantomWallet.Conect()
        

        
        while (true) {
            if (globalState.isPageClosed) return
            await Util.sleep(3000)
        }
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