const globalState = require("../config/globalState");
const { PageService, ElementService } = require("../config/import.service");
const { Twitter, Hotmail } = require("../config/import.social.media");
const { Util } = require("../config/import.util");
const PartalWallet = require("../modules/wallet/partal/partal");

async function MissionCentic() {
    try {     
        const page = await PageService.openFirstPage('https://centic.io/quests/daily')
     
            const butonConnect =  await ElementService.HandlefindAndElementText(page, 'Login with Web3 ID')
            if (butonConnect) {
                await ElementService.HandlefindAndClickElement(page, '//*[@id="login-web3-id"]', 10)
            }
        


    } catch (error) {
        console.log(` that bai`, error)
    } 
}

module.exports = MissionCentic