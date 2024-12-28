const globalState = require("../config/globalState");
const { PageService, ElementService } = require("../config/import.service");
const { Twitter, Hotmail } = require("../config/import.social.media");
const { Util } = require("../config/import.util");
const PartalWallet = require("../modules/wallet/partal/partal");

async function MissionGoplus() {
    try {     
        //const page = await PageService.openFirstPage('https://app.gopluslabs.io/ext-invite?code=S77GR6UP')



    } catch (error) {
        console.log(` that bai`, error)
    } 
}

module.exports = MissionGoplus;