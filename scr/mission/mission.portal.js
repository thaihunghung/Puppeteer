const { Twitter, Hotmail } = require("../config/import.social.media");
const PartalWallet = require("../modules/wallet/partal/partal");

async function MissionPortal() {
    try {     
        //await PartalWallet.Unblock(true)
        //await PartalWallet.Swap()
        // await PartalWallet.UnblockAndfaucet()
       // await Twitter.loginAndCheckCookie(false)
       // await Hotmail.CreateHotMail()
    } catch (error) {
        console.log(` that bai`, error)
    } 
}

module.exports = MissionPortal;