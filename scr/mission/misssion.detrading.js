const globalState = require("../config/globalState");
const { PageService, ElementService } = require("../config/import.service");
const { Twitter, Hotmail } = require("../config/import.social.media");
const { Util } = require("../config/import.util");
const PartalWallet = require("../modules/wallet/partal/partal");

async function MissionDetrading() {
    try {     
        //const page = await PageService.openFirstPage('https://testnet.detrading.com/')



    } catch (error) {
        console.log(` that bai`, error)
    } 
}

module.exports = MissionDetrading;