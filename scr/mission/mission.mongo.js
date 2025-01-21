const globalState = require("../config/globalState");
const { PageService, ElementService } = require("../config/import.service");
const { Twitter, Hotmail } = require("../config/import.social.media");
const { Util } = require("../config/import.util");
const MangoWallet = require("../modules/wallet/mango/mango");
const PartalWallet = require("../modules/wallet/partal/partal");
require('dotenv').config();
async function MissionMongo() {
    try {   
      //await MangoWallet.Create()
      //await MangoWallet.CreateMetaMask()
      //await MangoWallet.BNB()
      // tác dụng là đóng nó lại
      await MangoWallet.Unblock(true)
      await MangoWallet.WebMangonetwork()
      await MangoWallet.CheckinMango()
      await MangoWallet.faucetMango()
      await MangoWallet.Swap()
      await MangoWallet.Dex()
      
      
      

      //await MangoWallet.CheckinMango()
    } catch (error) {
        console.log(` that bai`, error)
    } 
}
// +12815092191
module.exports = MissionMongo