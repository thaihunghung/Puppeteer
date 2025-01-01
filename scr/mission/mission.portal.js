const { Twitter, Hotmail } = require("../config/import.social.media");
const { Util } = require("../config/import.util");
const PartalWallet = require("../modules/wallet/partal/partal");

async function MissionPortal() {
    try {     
        //await PartalWallet.Create()
        await PartalWallet.Unblock(true)
        //await PartalWallet.PromiseAllPartal()

       // await Twitter.loginAndCheckCookie(false)
       // await Hotmail.CreateHotMail()
       // 5  0xcC6Fb6dc3d3047fb62266bc3E33B3D445337cc6B     btc tb1pavcnegg2cxd5et9n8hhnmkyte2m5t2j9pnh88mjah4jfst0ydznq2mwd0w
       // 8  0x3084DbafE51b63759ad5e8777DD142F716B102af      btc tb1p2gn0gelug5fa2tck2f7gkk72p2jd2xaq5eawldcjjh3vmv0cag4s88d5hm
       // 11 0x673709e04C79De8571188778fda5d3F0F1B18dA9
       // 12 0x6358AC7b9Ed73e0ae241250534f57e221D0551f8
       // 13 0xA1929e2C9E202BF195F152c7CBc4122814CeF697 done
       // 14 0x844B7A05B337a7CE2896683922e632fB5D1CCFcF 14 kẹt
       // 15 0xDBa4f9E6d58800E09dD34F0fFC1Fb686DBF3BFdf 12 tx


       // 16 0x12F4C831bDFf3B36410b906B7F58Ace04346875B
       // 17 0xB7a067933bc17f3f561d4EF0c47F3B00756a9B2b
       // 18 0x0957C1aeD1FF77007aBD662Ca0a5858DAC2CB421
       // 19 0x5d2b3b0a17Fd15a43D9FDAF83c433488085D5b15
       // 20 no comfim
    } catch (error) {
        console.log(` that bai`, error)
    } 
}

module.exports = MissionPortal;