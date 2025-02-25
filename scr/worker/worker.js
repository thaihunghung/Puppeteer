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

async function run() {
    await Util.waitToRun(workerData)
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

    try {
        
    const jsonGalxe = {
        url: 'https://app.galxe.com/quest/xstar/GCJb2tprSj',
        discord: {
            mission_discord: true, // Changed to boolean for better checking
            Check_login: false,
            mission_url: ['https://discord.com/invite/KqR8Tr57Kw', 'https://discord.com/invite/KsdzggWBB7']
        },
        twitter: {
            mission_twitter: false, // Changed to boolean for better checking
            Check_login: false,
            mission_url: []
        }
    };
        //await GalaMission.execute(jsonGalxe)
        const sandwatch = await PageService.openNewPage('https://www.infinityg.ai/voyage/?inviteCode=04CZJ0', waitUntil.load)
       
        await OkxWallet.CreateWallet()
        //await PageService.reloadPage(sandwatch)
       // await PhantomWallet.UnblockMeta(true)
       //await Discord.LoginToken(workerData.discord.token_discord)
        
        // https://app.galxe.com/quest/LagrangeLabs/GC151tpwG7
        // https://app.galxe.com/quest/f3JRDwV9qNWXWq7oZpP8SU/GCEx4tpYHb
        // const top = await PageService.openNewPage('https://example.com')
        // top.on('close', async () => {
        //     isPagediscordClosed = true;
        // });
        //https://app.galxe.com/quest/LagrangeLabs/GC151tpwG7

        //await PhantomWallet.ImportPrivateKey()


        // const GaLa =  await PageService.openNewPage('chrome://extensions/')
        // await ElementService.Shadown(GaLa,
        //     'document.querySelector("body > extensions-manager").shadowRoot.querySelector("#items-list").shadowRoot.querySelector("#bfnaelmomeimhlpmgjnjophhpkkoljpa").shadowRoot.querySelector("#dev-reload-button").shadowRoot.querySelector("#maskedImage")',
        //     5
        // )
        // await GaLa.close()

// $1165fd37-c378-404e-8dfe-960bc6c72c52
        //const drops = await PageService.openNewPage('https://app.galxe.com')
        // drops.on('close', async () => {
        //     globalState.isPageClosed = true;
        // });





        
      //  await PhantomWallet.Conect()









// stop.on('close', async () => {
//     globalState.isPageClosed = true;
// });
//    const stop = await PageService.openNewPage('https://discord.com/channels/@me')

//    await PageService.openNewPage('https://2fa.live/')
   
    // PageService.acceptAlert(stop)
    // await Util.sleep(3000)
    // stop.on('close', async () => {
    //     globalState.isPageClosed = true;
    // });
    

    
    
    // https://api.telegram.org/bot7965335429:AAFMlG-GGMl3DK0tVbLMOmgro9rfFMV6FF4/sendMessage
    

    // {
    //     "chat_id": "-1002451943683",
    //     "text": "🌟 *New Waitlist Registration*\n\n👤 *Telegram:* @hung15092001\n💳 *Wallet:* `GSLvM9QPoxjGyixrwpUqARJmHeUkk3FraUvkQkBBf7eY`\n\n🕒 2/12/2025, 8:30:46 PM\n🌐 Nexar AI™ Waitlist",
    //     "parse_mode": "Markdown",
    //     "reply_to_message_id": 11249
    // }
    // {
    //     "chat_id": "-1002451943683",
    //     "text": "🌟 *New Waitlist Registration*\n\n👤 *Telegram:* @hung15092001\n💳 *Wallet:* `GSLvM9QPoxjGyixrwpUqARJmHeUkk3FraUvkQkBBf7eY`\n\n🕒 2/12/2025, 8:32:34 PM\n🌐 Nexar AI™ Waitlist",
    //     "parse_mode": "Markdown",
    //     "reply_to_message_id": 11249
    // }

        // const drops =  await PageService.openNewPage('https://x.com/Matrix_MLP')
        // drops.on('close', async () => {
        //     globalState.isPageClosed = true;
        // });
        
        // await PageService.openNewPage('https://x.com/Matrix_MLP/status/1881263828350185979')
        // await PageService.openNewPage('https://x.com/Matrix_MLP/status/1881357456745681365')
        
        //await PhantomWallet.ConectMetaWallet()
    //     while (true) {
    //         if (isPagediscordClosed) break
    //         await Util.sleep(5000)
    //     }
    //     await script(drops)

        //await PageService.openNewPage('https://web.telegram.org/a/')    
        // await PageService.openNewPage('https://app.galxe.com/quest/LagrangeLabs/GC151tpwG7')
        // await PageService.openNewPage('https://app.galxe.com/quest/58AUmcj2oPNjd2U9zxN6sX/GC4xvtp6Nr')
        // const saha = await PageService.openNewPage('https://app.galxe.com/quest/f3JRDwV9qNWXWq7oZpP8SU/GCEx4tpYHb')
        
        
        //https://airdrop.fantv.world?rc=CUAL3E
        //https://app.drops.house/invite?code=OQJZJJHCFU&ext_id=vM6ZS3fyt
        //https://printr.money/
        //https://whitelist.haust.network/
        
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