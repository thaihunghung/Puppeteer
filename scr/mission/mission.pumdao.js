const globalState = require("../config/globalState");
const { PageService, ElementService } = require("../config/import.service");
const { Twitter, Hotmail } = require("../config/import.social.media");
const { Util } = require("../config/import.util");
const OkxWallet = require("../modules/wallet/okx/okx");
const PartalWallet = require("../modules/wallet/partal/partal");

async function MissionPumdao() {
    try {     
        //await OkxWallet.CreateWallet()
        await OkxWallet.Unblock()
        

    } catch (error) {
        console.log(` that bai`, error)
    } 
}

module.exports = MissionPumdao