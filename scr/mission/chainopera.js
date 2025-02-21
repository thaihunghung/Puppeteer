const globalState = require("../config/globalState");
const { PageService, ElementService } = require("../config/import.service");
const { Twitter, Hotmail } = require("../config/import.social.media");
const { Util } = require("../config/import.util");
const Discord = require("../modules/discord/discord");
const PartalWallet = require("../modules/wallet/partal/partal");
const PhantomWallet = require("../modules/wallet/phantom/phantom");

async function ChainOpenMission() {
    try {     
        //@@@@@cjhpirag7y472
        let isPageClosed = false
        await PhantomWallet.ImportWallet()
          const ref = 'IUOVPVA2'
          const chainopera = await PageService.openNewPage(`https://chainopera.ai/quest/?inviteCode=${ref}`)
          chainopera.on('close', async () => {
            isPageClosed = true;
          });
          await Util.sleep(5000)
          await chainopera.reload()
          await ElementService.HandlefindAndClickElement(chainopera, `//*[@id="app"]/div/main/header/div/div[2]/button`)
          await chainopera.evaluate(() => {
              const shadowHost = document.querySelector('body > onboard-v2');
              if (shadowHost) {
                  const shadowRoot = shadowHost.shadowRoot;
                  const button = shadowRoot.querySelector(
                      'section > div > div > div > div > div > div > div > div.scroll-container.svelte-1qwmck3 > div > div > div > div:nth-child(2) > button'
                  );
                  if (button) {
                      button.click(); // Click vào nút
                      console.log('Button clicked!');
                  } else {
                      console.error('Button not found!');
                  }
              } else {
                  console.error('Shadow host not found!');
              }
          });
          while (true) {
            await Promise.all([
                PhantomWallet.Conect(),
                PhantomWallet.Confirm()
            ])
            if (isPageClosed) break
              await Util.sleep(5000)
          }

    } catch (error) {
        console.log(` that bai`, error)
    } 
}

module.exports = ChainOpenMission
       // main https://chainopera.ai/quest/?inviteCode=IUOVPVA2
    // 1 https://chainopera.ai/quest/?inviteCode=H52R0YCG done
    // 2 https://chainopera.ai/quest/?inviteCode=ZINRH5ZU done
    // 3 https://chainopera.ai/quest/?inviteCode=P4J2488A done
    // 4 https://chainopera.ai/quest/?inviteCode=EM4AUGIF done
    // 5 https://chainopera.ai/quest/?inviteCode=2CT798H8 done
    // 6 https://chainopera.ai/quest/?inviteCode=HTJKQ6QP done
    // 7 https://chainopera.ai/quest/?inviteCode=54GAVKGG done
    // 8 https://chainopera.ai/quest/?inviteCode=7H5CQHCN done
    // 9 https://chainopera.ai/quest/?inviteCode=LTD9WQJE done
    // 10 https://chainopera.ai/quest/?inviteCode=KHUBNSU4 done
    // 11 
    // 12 https://chainopera.ai/quest/?inviteCode=6IV9JQ5I
    // 13 https://chainopera.ai/quest/?inviteCode=1UL2F2IZ
    // 14 https://chainopera.ai/quest/?inviteCode=NIAZBT9R
    // 15 https://chainopera.ai/quest/?inviteCode=F72DRX1Q
    // 16 https://chainopera.ai/quest/?inviteCode=F2MKL1IH
    // 17 https://chainopera.ai/quest/?inviteCode=PIDBYRBP
    // 18 https://chainopera.ai/quest/?inviteCode=Y0EADXIA
    // 19 https://chainopera.ai/quest/?inviteCode=28X2NBAP
    // 20 https://chainopera.ai/quest/?inviteCode=SSIJJBVG
    // 21 https://chainopera.ai/quest/?inviteCode=IRHONYGR
    // 22 https://chainopera.ai/quest/?inviteCode=AYS2JSPE
    // 23 https://chainopera.ai/quest/?inviteCode=K3JCEPSS
    // 24 https://chainopera.ai/quest/?inviteCode=RL0PDA3A
    // 25 https://chainopera.ai/quest/?inviteCode=O9L3CZ4E
    // 26 https://chainopera.ai/quest/?inviteCode=BWRFI5L1
    // 27 https://chainopera.ai/quest/?inviteCode=RPCPFFBE
    // 28 https://chainopera.ai/quest/?inviteCode=NBWUOC39
    // 29 https://chainopera.ai/quest/?inviteCode=DAPN3BME
    // 30 https://chainopera.ai/quest/?inviteCode=TDSFQ4UM
    //@ducxomchoi123
    //@partypple