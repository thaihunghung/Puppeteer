const globalState = require("../config/globalState");
const { PageService, ElementService } = require("../config/import.service");
const { Twitter, Hotmail } = require("../config/import.social.media");
const { Util } = require("../config/import.util");
const PartalWallet = require("../modules/wallet/partal/partal");

async function Print3rMission() {
    try {     
        //await Twitter.loginAndCheckCookie(true)
        const page = await PageService.openNewPage('https://www.print3r.xyz/yap-contest')
        await ElementService.HandlefindAndClickElement(page, '/html/body/div/div/div[1]/div[1]/button')
        await ElementService.HandlefindAndClickElement(page, '//*[@id=":R3fnn9bbH2:"]/div/div[1]/button')
        
        while (true) {
            await Util.sleep(10000)
            const pageTaget = await PageService.findPageByUrl('https://twitter.com/i/flow/login?redirect_after_login=')
            if (pageTaget.check) {
                const page = await PageService.getTargetPage(pageTaget.url)
                await ElementService.HandlefindAndTypeElement(
                    page,
                    "//input[@name='text' and @type='text' and @autocomplete='username']",
                    globalState.workerData.twitter.user
                );
                await ElementService.HandlefindAndClickElement(
                    page,
                    "//button[@role='button' and .//span/span[text()='Next']]"
                );
                await ElementService.HandlefindAndTypeElement(
                    page,
                    "//input[@type='password' and @name='password' and @autocomplete='current-password']",
                    process.env.PASS_TWITTER
                );
                await ElementService.HandlefindAndClickElement(
                    page,
                    "//button[@role='button' and .//span/span[text()='Log in']]"
                );
                const auth2fa = globalState.workerData.twitter.auth2fa
                console.log('auth2fa', auth2fa)
                await Util.sleep(5000)
                const inputSelector = '[data-testid="ocfEnterTextTextInput"]';
                const inputelement = await ElementService.ElementWaitForSelector(page, inputSelector, 10)
                if (inputelement.found) {
                    await Util.waitFor1sAnd30s()
                    const auth = await axiosService.get2faToken(auth2fa)
                    await inputelement.element.type(auth);
                }
                await ElementService.HandlefindAndClickElement(
                    page,
                    "//button[@role='button' and .//span/span[text()='Next']]",
                    10
                );

                await Util.sleep(5000)
                await ElementService.HandlefindAndClickElement(
                    page,
                    `//*[@id="react-root"]/div/div/div[2]/main/div/div/div[2]/div/div/div[1]/div[3]/button`,
                    10
                );
                break
            }
        }
        await Util.sleep(5000)
        await ElementService.HandlefindAndClickElement(page, '/html/body/div/div/div[1]/div[1]/button')
        await Util.sleep(5000)
        await ElementService.HandlefindAndTypeElement(page, '//*[@id=":R3fnn9bbH2:"]/div/div[2]/div[1]/input', 'HUNGTRANETHH')
        await Util.sleep(5000)
        await ElementService.HandlefindAndClickElement(page, '//*[@id=":R3fnn9bbH2:"]/div/div[2]/button')
        
        console.log('tim thay')
        //await PageService.openNewPage('https://x.com/')
    } catch (error) {
        console.log(` that bai`, error)
    } 
}

module.exports = Print3rMission