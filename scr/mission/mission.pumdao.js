const globalState = require("../config/globalState");
const { PageService, ElementService } = require("../config/import.service");
const { Twitter, Hotmail } = require("../config/import.social.media");
const { Util } = require("../config/import.util");
const OkxWallet = require("../modules/wallet/okx/okx");
const PartalWallet = require("../modules/wallet/partal/partal");
const PhantomWallet = require("../modules/wallet/phantom/phantom");

async function MissionPumdao() {
    try {   
        //await  PhantomWallet.Unblock()  
        await  PhantomWallet.ImportWallet()
        await Util.sleep(10000)

        const page = await PageService.openNewPage('https://pumpdao.xyz/?code=v4p7ABOG')

        await ElementService.HandlefindAndClickElement(
            page,
            '//*[@id="app"]/div/header/div/div[2]',
            20
        )

        await ElementService.HandlefindAndClickElement(
            page,
            '//*[@id="app"]/div/div[2]/div/div[2]/div[2]',
            20
        )
        await Util.sleep(10000)
        await  PhantomWallet.Conect()
        await Util.sleep(10000)
        await  PhantomWallet.Confirm()
    } catch (error) {
        console.log(` that bai`, error)
    } 
}

module.exports = MissionPumdao