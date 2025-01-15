const { Twitter, Hotmail } = require("../config/import.social.media");
const { Util } = require("../config/import.util");
const PartalWallet = require("../modules/wallet/partal/partal");

async function MissionPortal() {
    try {
        //await PartalWallet.Create(true)
       await PartalWallet.Unblock(true)
        //await PartalWallet.RestartExtension()
    //await PartalWallet.PromiseAllPartal()

        // await Twitter.loginAndCheckCookie(false)
        // await Hotmail.CreateHotMail()
    } catch (error) {
        console.log(` that bai`, error)
    }
}

module.exports = MissionPortal;