const { workerData, parentPort } = require('worker_threads');
const { ElementService, PageService } = require('../config/import.service');
const puppeteer = require('puppeteer');
const proxyChain = require('proxy-chain');

const MissionPortal = require('../mission/mission.portal');
const Util = require('../util/util');
const globalState = require('../config/globalState');
const Twitter = require('../modules/twitter/twitter');
const { axios, fs } = require('../config/module.import');
const MissionMongo = require('../mission/mission.mongo');
const PhantomWallet = require('../modules/wallet/phantom/phantom');
const Discord = require('../modules/discord/discord');
const SuiWallet = require('../modules/wallet/sui/sui');
const axiosService = require('../services/axios.service');
const OkxWallet = require('../modules/wallet/okx/okx');
require('dotenv').config();
async function run() {
    let isPageClosed = false;

    const hihop = async (address) => {
        await Util.sleep(10000)
        const clickSignupButton = async (hiphop) => {
            const signupButtonSelector = '#__nuxt > div > div > div > div.main-content > div > div > div > div.signup__controls > button:nth-child(1)';

            try {
                // Đợi phần tử xuất hiện trong một khoảng thời gian cụ thể
                await hiphop.waitForSelector(signupButtonSelector, { timeout: 5000 });

                // Kiểm tra sự tồn tại của phần tử
                const signupButton = await hiphop.$(signupButtonSelector);
                if (signupButton) {
                    await signupButton.click();
                    console.log('Đã click vào nút đăng ký.');
                } else {
                    console.log('Không tìm thấy nút đăng ký.');
                }
            } catch (error) {
                console.log('Lỗi khi tìm kiếm hoặc click vào nút:', error.message);
            }
        };

        const mmwallet = async (index = 4) => {
            await Util.sleep(5000)
            const hiphop = await PageService.openNewPage('https://quests.hiphop.fun/quests')
            hiphop.on('close', async () => {
                isPageClosed = true;
            });
            await ElementService.HandlefindAndClickElement(hiphop,
                `//*[@id="__nuxt"]/div/div/div/div[2]/div/div/div[2]/div/div[2]/div/div[${index}]/div[2]/button`
            )
            await Util.sleep(5000)
            await ElementService.HandleWaitForSelectorClickElement(hiphop,
                'body > div.questModal-wrapper > div > div.questModal-footer > button:nth-child(1)'
            )
            await Util.sleep(5000)
            const inputSelector = '.connectModal__input';
            const inputField = await hiphop.$(inputSelector);
            if (inputField) {
                await hiphop.type(inputSelector, `${address}`);
            } else {
                console.log(`Không tìm thấy trường input`);
                return;
            }
            await Util.sleep(5000)
            const submitButtonSelector = 'button[data-v-dcac0572].button';
            const submitButton = await hiphop.$(submitButtonSelector);
            if (submitButton) {
                // await hiphop.evaluate(() => {
                //     document.querySelector('button[data-v-dcac0572].button').click();
                // });
            } else {
                console.log(`Không tìm thấy nút gửi`);
            }
        }

        const mm = async (index) => {
            await Util.sleep(5000)
            const hiphop = await PageService.openNewPage('https://quests.hiphop.fun/quests')
            hiphop.on('close', async () => {
                isPageClosed = true;
            });
            await ElementService.HandlefindAndClickElement(hiphop,
                `//*[@id="__nuxt"]/div/div/div/div[2]/div/div/div[2]/div/div[2]/div/div[${index}]/div[2]/button`
            )
            const secondaryButtonSelector = 'button[data-v-dcac0572][data-v-7229b5f1].button.secondary';
            const secondaryButton = await hiphop.$(secondaryButtonSelector);
            if (secondaryButton) {
                // await hiphop.evaluate(() => {
                //     document.querySelector('button[data-v-dcac0572][data-v-7229b5f1].button.secondary').click();
                // });
            } else {
                console.log(`Không tìm thấy nút thứ hai`);
            }
        }
        const hiphop = await PageService.openNewPage('https://quests.hiphop.fun?referralCode=8fd0b5')
        hiphop.on('close', async () => {
            isPageClosed = true;
        });
        await Util.sleep(5000)
        await ElementService.HandlefindAndClickElement(
            hiphop,
            '//*[@id="__nuxt"]/div/div/div/div[2]/div/div/div/div/button',
            2
        )
        await ElementService.HandleWaitForSelectorClickElement(
            hiphop,
            '#__nuxt > div > div > div > div.main-content > div > div > div > div > button:nth-child(1)',
            10
        )
        async function performTwitterAuthActions() {
            while (true) {
                await Util.sleep(10000);

                const [pageTarget1, pageTarget2] = await Promise.all([
                    PageService.findPageByUrl('https://twitter.com/i/oauth2/authorize'),
                    PageService.findPageByUrl('https://twitter.com/i/flow/login?redirect_after_login='),
                ]);

                if (pageTarget1.check) {
                    const page = await PageService.getTargetPage(pageTarget1.url);
                    await Util.sleep(5000);

                    await ElementService.HandlefindAndClickElement(
                        page,
                        `//*[@id="react-root"]/div/div/div[2]/main/div/div/div[2]/div/div/div[1]/div[3]/button`,
                        10
                    );
                    break;
                }

                if (pageTarget2.check) {
                    const page = await PageService.getTargetPage(pageTarget2.url);
                    await Util.sleep(5000);

                    const isUsernameTyped = await ElementService.HandlefindAndTypeElement(
                        page,
                        "//input[@name='text' and @type='text' and @autocomplete='username']",
                        globalState.workerData.twitter.user,
                        2
                    );

                    if (isUsernameTyped) {
                        await ElementService.HandlefindAndClickElement(
                            page,
                            "//button[@role='button' and .//span/span[text()='Next']]"
                        );
                        await ElementService.HandlefindAndTypeElement(
                            page,
                            "//input[@type='password' and @name='password' and @autocomplete='current-password']",
                            globalState.workerData.twitter.pass
                        );
                        await ElementService.HandlefindAndClickElement(
                            page,
                            "//button[@role='button' and .//span/span[text()='Log in']]"
                        );

                        const auth2fa = globalState.workerData.twitter.auth2fa;
                        console.log('auth2fa', auth2fa);

                        await Util.sleep(5000);

                        const inputSelector = '[data-testid="ocfEnterTextTextInput"]';
                        const inputElement = await ElementService.ElementWaitForSelector(page, inputSelector, 10);

                        if (inputElement.found) {
                            await Util.waitFor1sAnd30s();
                            const auth = await axiosService.get2faToken(auth2fa);
                            await inputElement.element.type(auth);
                        }

                        await ElementService.HandlefindAndClickElement(
                            page,
                            "//button[@role='button' and .//span/span[text()='Next']]",
                            2
                        );
                    }

                    await Util.sleep(5000);
                    await ElementService.HandlefindAndClickElement(
                        page,
                        `//*[@id="react-root"]/div/div/div[2]/main/div/div/div[2]/div/div/div[1]/div[3]/button`,
                        2
                    );
                    break;
                }
            }
        }

        performTwitterAuthActions().catch(console.error);
        while (true) {
            const t = await PageService.findPageByUrl('https://quests.hiphop.fun/signup?error=false&message=Twitter+authorization+successful')
            if (t.check) break
            await Util.sleep(3000)

        }

        await ElementService.HandleWaitForSelectorClickElement(
            hiphop,
            '#__nuxt > div > div > div > div.main-content > div > div > div > div.signup__controls > button:nth-child(1)',
            10
        )

        await clickSignupButton(hiphop)
        await mmwallet()
        await mm(1)
        await mm(2)
        await mm(3)
        await mm(5)
        await mm(6)
        await mm(7)
        await mm(8)
        // await mm(1)
        await Util.sleep(5000)
        // const hiphop1 = await PageService.openNewPage('https://quests.hiphop.fun/quests')
        // const hiphop2 = await PageService.openNewPage('https://quests.hiphop.fun/quests')
        // const hiphop3 = await PageService.openNewPage('https://quests.hiphop.fun/quests')
        // const hiphop4 = await PageService.openNewPage('https://quests.hiphop.fun/quests')
        // const hiphop5 = await PageService.openNewPage('https://quests.hiphop.fun/quests')

    }
    const printr = async () => {
        const page = await PageService.openNewPage('https://printr.money/')
        const logicPagePrintr = async () => {
            await Util.sleep(5000)
            await ElementService.HandlefindAndClickElement(page,
                '/html/body/div/div/div[1]/div[2]/div/div/div[2]/div/div[2]/div[1]/div[2]/div/div/div/button/span/div/button',
                10
            )
            await Util.sleep(5000)
            await ElementService.HandlefindAndClickElement(page,
                '//*[@id="radix-:r2:"]/div/div[2]/div/div[3]',
                10
            )
        }

        await logicPagePrintr(page)

        let isStopped = false; // Biến trạng thái toàn cục
        const reconnect = async (page) => {
            while (!isStopped) {
                await Util.sleep(5000)
            }
            while (!isStopped) {
                await Util.sleep(5000)
            }
            while (!isStopped) {
                await Util.sleep(5000)
            }
            while (!isStopped) {
                await Util.sleep(5000)
            }
            while (!isStopped) {
                await Util.sleep(5000)
            }
            while (!isStopped) {
                await Util.sleep(5000)
            }
            while (!isStopped) {
                await Util.sleep(5000)
            }
            while (!isStopped) {
                await Util.sleep(5000)
            }
            while (!isStopped) {
                await Util.sleep(5000)
            }
            while (!isStopped) {
                await Util.sleep(5000)
            }
            while (!isStopped) {
                await ElementService.HandlefindAndClickElement(page,
                    '//*[@id="radix-:r3:"]/span',
                    1
                )
            }
            while (!isStopped) {
                await ElementService.HandlefindAndClickElement(page,
                    '//*[@id="radix-:r2:"]/div/div[2]/div/div[3]',
                    1
                )
            }
        }
        async function connectHandler(page) {
            while (!isStopped) {
                const target = await PageService.findPageByUrl('chrome-extension://fplapjhmamlfnblgccljmdinfhjlhhia');
                if (target.check) {
                    const sui = await PageService.getTargetPage(target.url);
                    await Util.sleep(3000);
                    if (await ElementService.HandlefindAndElementText(sui, 'Connect'))
                        await ElementService.HandlefindAndClickElement(sui,
                            `//*[@id="root"]/div/div/div/div/div/div/div[2]/div/div[2]/div/div/div/div[2]/button[2]/div[text()='Connect']`,
                            1
                        );
                }
                await Util.sleep(3000);
            }
        }

        async function signHandler(page) {
            while (!isStopped) {
                const target = await PageService.findPageByUrl('chrome-extension://fplapjhmamlfnblgccljmdinfhjlhhia');
                if (target.check) {
                    const sui = await PageService.getTargetPage(target.url);
                    await sui.reload()
                    if (await ElementService.HandlefindAndElementText(sui, 'Sign'))
                        if (await ElementService.HandlefindAndClickElement(sui,
                            `//*[@id="root"]/div/div/div/div/div/div/div[2]/div/div[2]/div/div/div/div[2]/button[2]/div[text()='Sign']`,
                            1
                        )) {
                            isStopped = true;
                        }
                }
                await Util.sleep(3000);
            }
        }

        async function checkReadApp(page) {
            while (!isStopped) {
                const target = await PageService.findPageByUrl('chrome-extension://fplapjhmamlfnblgccljmdinfhjlhhia');
                if (target.check) {
                    const sui = await PageService.getTargetPage(target.url);
                    if (await ElementService.HandlefindAndClickElementText(page, 'Reload App'))
                        await logicPagePrintr(page)
                }
                await Util.sleep(3000);
            }
        }
        await Promise.all([
            connectHandler(page),
            signHandler(page),
            reconnect(page),
            //checkReadApp(page)
        ]);

        console.log('dung')

        await Util.sleep(5000);
        isPageClosed = true
    }
    globalState.workerData = workerData
    const proxy = workerData.proxy;
    const newProxyUrl = await proxyChain.anonymizeProxy(`http://${proxy}`);
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            //`--proxy-server=${newProxyUrl}`,
            '--disable-extensions-except=E:\\puppeteer-auto-meta-proxy\\extensions\\MetaMask\\nkbihfbeogaeaoehlefnkodbefgpgknn',
            //'--load-extension=E:\\puppeteer-auto-meta-proxy\\extensions\\MetaMask\\nkbihfbeogaeaoehlefnkodbefgpgknn',
            '--profile-directory=Profile 1',
            //'--start-maximized'
        ],
        defaultViewport: null,
    });

    //"E:\puppeteer-auto-meta-proxy\extensions\"
    //await PhantomWallet.Create()

    globalState.browser = browser
    let stop = true
    try {
        // await SuiWallet.Inport(true)
        // const SUi = await PageService.openNewPage('chrome-extension://fplapjhmamlfnblgccljmdinfhjlhhia/index.html#/accounts/manage')
        // await ElementService.HandlefindAndClickElement(SUi, '//*[@id="root"]/div/div/div/div/div/div/div[2]/div/div[2]/div/div/div/div/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div')

        // await SUi.waitForSelector('#root > div > div > div > div > div > div > div.css-175oi2r.grow.relative.overflow-hidden.shadow-content-accentDisabled\\/30.fullscreen\\:rounded-m > div > div:nth-child(2) > div > div > div > div > div.css-175oi2r.r-13awgt0 > div > div > div > div > div > div > div > div > div > div.css-175oi2r.gap-3xs > div > div > div.css-175oi2r.p-3xs.gap-3xs > a');

        // // Tìm phần tử với selector đã cho
        // const element = await SUi.$('#root > div > div > div > div > div > div > div.css-175oi2r.grow.relative.overflow-hidden.shadow-content-accentDisabled\\/30.fullscreen\\:rounded-m > div > div:nth-child(2) > div > div > div > div > div.css-175oi2r.r-13awgt0 > div > div > div > div > div > div > div > div > div > div.css-175oi2r.gap-3xs > div > div > div.css-175oi2r.p-3xs.gap-3xs > a');
        // let address = null
        // if (element) {
        //     const href = await SUi.evaluate(el => el.getAttribute('href'), element);
        //     const urlWithoutHttps = href.replace('https://', '');
        //     const baseUrl = urlWithoutHttps.split('?')[0];
        //     address = baseUrl.split('/')[2];
        //     console.log('address', address)
        // } else {
        //     console.log('Không tìm thấy phần tử <a> với selector đã cung cấp.');
        // }
        // await SUi.close()
        // await hihop(address)



        // await SuiWallet.Create(true)
        // const SUi = await PageService.openNewPage('chrome-extension://fplapjhmamlfnblgccljmdinfhjlhhia/index.html#/accounts/manage')
        // await ElementService.HandlefindAndClickElement(SUi, '//*[@id="root"]/div/div/div/div/div/div/div[2]/div/div[2]/div/div/div/div/div[2]/div/div/div/div/div/div/div/div/div/div[2]/div/div')

        // await SUi.waitForSelector('#root > div > div > div > div > div > div > div.css-175oi2r.grow.relative.overflow-hidden.shadow-content-accentDisabled\\/30.fullscreen\\:rounded-m > div > div:nth-child(2) > div > div > div > div > div.css-175oi2r.r-13awgt0 > div > div > div > div > div > div > div > div > div > div.css-175oi2r.gap-3xs > div > div > div.css-175oi2r.p-3xs.gap-3xs > a');

        // // Tìm phần tử với selector đã cho
        // const element = await SUi.$('#root > div > div > div > div > div > div > div.css-175oi2r.grow.relative.overflow-hidden.shadow-content-accentDisabled\\/30.fullscreen\\:rounded-m > div > div:nth-child(2) > div > div > div > div > div.css-175oi2r.r-13awgt0 > div > div > div > div > div > div > div > div > div > div.css-175oi2r.gap-3xs > div > div > div.css-175oi2r.p-3xs.gap-3xs > a');

        // if (element) {
        //     const href = await SUi.evaluate(el => el.getAttribute('href'), element);
        //     const urlWithoutHttps = href.replace('https://', '');
        //     const baseUrl = urlWithoutHttps.split('?')[0];
        //     const address1 = baseUrl.split('/')[2];

        //     const address = `${globalState.workerData.i}:__ ${address1} __`
        //     console.log('Địa chỉ cần lấy:', address);
        //     const fileName = '12key.txt';

        //     // Ghi chuỗi vào tệp
        //     fs.open(fileName, 'a', (err, fd) => {
        //         if (err) {
        //             console.error('Lỗi khi mở file:', err);
        //             return;
        //         }

        //         // Đọc nội dung trong file
        //         fs.readFile(fileName, 'utf8', (err, data) => {
        //             if (err) {
        //                 console.error('Lỗi khi đọc file:', err);
        //                 return;
        //             }

        //             // Kiểm tra xem currentContent đã có trong file hay chưa
        //             if (!data.includes(address)) {
        //                 // Nếu không có trong file, ghi thêm vào file mà không ghi đè
        //                 fs.appendFile(fileName, address + '\n', 'utf8', (err) => {
        //                     if (err) {
        //                         console.error('Lỗi khi ghi nội dung vào file:', err);
        //                     } else {
        //                         console.log('Đã thêm vào lịch sử clipboard:', address);
        //                     }
        //                 });
        //             } else {
        //                 console.log('Nội dung đã có trong lịch sử clipboard:', address);
        //             }
        //         });
        //     });

        // } else {
        //     console.log('Không tìm thấy phần tử <a> với selector đã cung cấp.');
        // }
        // await SUi.close()

        // await printr()
        const waitForElement = async (page, selector) => {
            while (true) {
                const element = await page.$(selector);
                if (element) break; // Thoát vòng lặp nếu phần tử tồn tại
                await new Promise(resolve => setTimeout(resolve, 500)); // Chờ 500ms trước khi kiểm tra lại
            }
            console.log('Phần tử đã xuất hiện!');
        };
        const closePageByIndex = async (browser, index) => {
            const pages = await browser.pages(); // Lấy tất cả các trang đang mở
            if (index >= 0 && index < pages.length) {
                await pages[index].close(); // Đóng trang theo chỉ số
                console.log(`Đã đóng trang ở vị trí index: ${index}`);
            } else {
                console.error('Index không hợp lệ!');
            }
        };
        const focusPageByIndex = async (browser, index) => {
            const pages = await browser.pages(); // Lấy tất cả các trang đang mở
            if (index >= 0 && index < pages.length) {
                const targetPage = pages[index];
                await targetPage.bringToFront(); // Đưa trang ở vị trí index lên đầu
                console.log(`Đã focus vào trang ở index: ${index}`);
            } else {
                console.error('Index không hợp lệ!');
            }
        };
    
        const meta =  await PhantomWallet.ImportMetaWallet()

        const page = await PageService.openFirstPage('https://app.galxe.com/quest/58AUmcj2oPNjd2U9zxN6sX/GC4xvtp6Nr')
        
       
        
        //isPageClosed = true

        
        while (!isPageClosed) {
            await Util.sleep(5000)
        }
        parentPort.postMessage({ status: 'Success' });
    } catch (error) {
        console.log(`waitForSelector{workerData.Profile} that bai`, error)
        parentPort.postMessage({ status: 'Failure' });
    } finally {
        await browser.close()
    }
}
















async function clickButtonInNestedShadowDOM(printr) {
    await Util.sleep(10000);
    const MAX_RETRIES = 5;
    const RETRY_DELAY = 5000; // Thời gian chờ giữa các lần thử (ms)

    async function clickButtonWithRetry(printr, selector, retries) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const button = await (
                    await printr.evaluateHandle(selector)
                ).asElement();

                if (button) {
                    await button.click();
                    console.log(`Clicked button successfully on attempt ${attempt}.`);
                    return true; // Nếu click thành công thì dừng lại
                } else {
                    console.log(`Button not found on attempt ${attempt}.`);
                }
            } catch (error) {
                console.error(`Attempt ${attempt}: Error occurred while trying to click the button:`, error);
            }

            // Chờ trước khi thử lại
            await Util.sleep(RETRY_DELAY);
        }

        console.error(`Failed to click the button after ${retries} attempts.`);
        return false; // Nếu không click được sau nhiều lần thử
    }
    const buttonSelector1 = `
document.querySelector("body > w3m-modal")
  .shadowRoot.querySelector("wui-flex > wui-card > w3m-router")
  .shadowRoot.querySelector("div > w3m-connect-view")
  .shadowRoot.querySelector("wui-flex > wui-flex.connect > wui-flex > w3m-wallet-login-list")
  .shadowRoot.querySelector("wui-flex > w3m-connector-list")
  .shadowRoot.querySelector("wui-flex > w3m-connect-multi-chain-widget")
  .shadowRoot.querySelector("wui-flex > wui-list-wallet")
  .shadowRoot.querySelector("button")
`;

    const buttonSelector2 = `
document.querySelector("body > w3m-modal")
  .shadowRoot.querySelector("wui-flex > wui-card > w3m-router")
  .shadowRoot.querySelector("div > w3m-connecting-multi-chain-view")
  .shadowRoot.querySelector("wui-flex > wui-flex:nth-child(3) > wui-list-wallet:nth-child(2)")
  .shadowRoot.querySelector("button")
`;

    // Thử click nút đầu tiên
    const success1 = await clickButtonWithRetry(printr, buttonSelector1, MAX_RETRIES);
    if (success1) {
        await Util.sleep(5000); // Chờ 5 giây trước khi thử click nút thứ hai
        // Thử click nút thứ hai
        await clickButtonWithRetry(printr, buttonSelector2, MAX_RETRIES);
    }
    // // First button click (Accessing the first nested shadow DOM)
    // const firstButton = await getButtonFromFirstShadow(printr);
    // if (firstButton) {
    //     await firstButton.click();
    // }
    // await Util.sleep(5000); 
    // // Wait for another element or selector to appear if needed
    // await printr.waitForSelector('body > w3m-modal');

    // // Second button click (Accessing a different nested shadow DOM)
    // const secondButton = await getButtonFromSecondShadow(printr);
    // if (secondButton) {
    //     await secondButton.click();
    // }
}

// Helper function to get button from the first shadow DOM structure
async function getButtonFromFirstShadow(printr) {
    const modalElement = await printr.waitForSelector('body > w3m-modal');
    const shadowRoot1 = await modalElement.evaluateHandle(el => el.shadowRoot);

    const card = await shadowRoot1.waitForSelector('wui-flex > wui-card > w3m-router');
    const shadowRoot2 = await card.evaluateHandle(el => el.shadowRoot);

    const connectView = await shadowRoot2.waitForSelector('div > w3m-connect-view');
    const shadowRoot3 = await connectView.evaluateHandle(el => el.shadowRoot);

    const flexConnect = await shadowRoot3.waitForSelector('wui-flex > wui-flex.connect > wui-flex > w3m-wallet-login-list');
    const shadowRoot4 = await flexConnect.evaluateHandle(el => el.shadowRoot);

    const connectorList = await shadowRoot4.waitForSelector('wui-flex > w3m-connector-list');
    const shadowRoot5 = await connectorList.evaluateHandle(el => el.shadowRoot);

    const multiChainWidget = await shadowRoot5.waitForSelector('wui-flex > w3m-connect-multi-chain-widget');
    const shadowRoot6 = await multiChainWidget.evaluateHandle(el => el.shadowRoot);

    const walletList = await shadowRoot6.waitForSelector('wui-flex > wui-list-wallet');
    const shadowRoot7 = await walletList.evaluateHandle(el => el.shadowRoot);

    return shadowRoot7.waitForSelector('button');
}

// Helper function to get button from the second shadow DOM structure
// async function getButtonFromSecondShadow(printr) {
//     const modalElement = await printr.waitForSelector('body > w3m-modal');
//     const shadowRoot1 = await modalElement.evaluateHandle(el => el.shadowRoot);

//     const card = await shadowRoot1.waitForSelector('wui-flex > wui-card > w3m-router');
//     const shadowRoot2 = await card.evaluateHandle(el => el.shadowRoot);

//     const connectView = await shadowRoot2.waitForSelector('div > w3m-connecting-multi-chain-view');
//     const shadowRoot3 = await connectView.evaluateHandle(el => el.shadowRoot);

//     const flexChild = await shadowRoot3.waitForSelector('wui-flex > wui-flex:nth-child(3) > wui-list-wallet:nth-child(2)');
//     const shadowRoot4 = await flexChild.evaluateHandle(el => el.shadowRoot);

//     return shadowRoot4.waitForSelector('button');
// }
async function ConnectPhantomWallet(page) {
    while (true) {
        // Run check, connection, and confirmation concurrently
        const check = await ElementService.HandlefindAndElementText(page, 'Join (SOL / EVM)');

        // Wait for all three operations to complete
        await Promise.all([
            PhantomWallet.Conect(),
            PhantomWallet.Confirm(),
            Promise.resolve(check)  // Wrap check in a resolved promise
        ]);

        // If check is false, break the loop
        if (!check) break;

        // Sleep for 5 seconds
        await Util.sleep(5000);
    }
}

// await Discord.LoginToken('MTMyNjUyOTcyNDgzNDUxNzA1Ng.GwPDnS.WTSIqG3hnyUJSEXPWSKJUpf1mt1KzcwoF2Cjiw')

// const ref = 'https://chainopera.ai/quest'
// const chainopera = await PageService.openNewPage(`waitForSelector{ref}`)
// await Util.sleep(5000)
// await chainopera.reload()
// await Util.sleep(5000)
// await chainopera.reload()
// await ElementService.HandlefindAndClickElement(chainopera, `//*[@id="app"]/div/main/header/div/div[2]/button`)
// await chainopera.evaluate(() => {
//     const shadowHost = document.querySelector('body > onboard-v2');
//     if (shadowHost) {
//         const shadowRoot = shadowHost.shadowRoot;
//         const button = shadowRoot.querySelector(
//             'section > div > div > div > div > div > div > div > div.scroll-container.svelte-1qwmck3 > div > div > div > div:nth-child(2) > button'
//         );
//         if (button) {
//             button.click(); // Click vào nút
//             console.log('Button clicked!');
//         } else {
//             console.error('Button not found!');
//         }
//     } else {
//         console.error('Shadow host not found!');
//     }
// });

// await ElementService.HandleWaitForSelectorClickElement(
//     chainopera,
//     '#customer-task-list > div:nth-child(3) > div.action > button'
// )


// while (true) {   
//     await Promise.all([
//         PhantomWallet.Conect(),
//         PhantomWallet.Confirm(),
//         ///Discord.authorizationScroll(),

//     ]);
//     // await ElementService.HandleWaitForSelectorClickElement(
//     //     chainopera,
//     //     '#my_modal_x_callback > div > div > button'
//     // )
//     // await Util.sleep(5000)



//     // if (stop) {
//     //     await Util.sleep(15000)
//     //     await ElementService.HandleWaitForSelectorClickElement(
//     //         chainopera,
//     //         '#customer-task-list > div:nth-child(3) > div.action > button'
//     //     )
//     //     stop = false
//     // } 
// }







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
// 31 https://chainopera.ai/quest/?inviteCode=3DDNLSZK 
// 32 https://chainopera.ai/quest/?inviteCode=B4GNJU3C 
// 33 https://chainopera.ai/quest/?inviteCode=DHACONN1 
// 34 https://chainopera.ai/quest/?inviteCode=ZV4CZTIY 
// 35 https://chainopera.ai/quest/?inviteCode=6ZZCNI5D 10 ref loi 1 discord
// 36 https://chainopera.ai/quest/?inviteCode=TDIJY2EO 10 ref loi 1 discord
// 37 https://chainopera.ai/quest/?inviteCode=WLY03JSA 
// 38 https://chainopera.ai/quest/?inviteCode=GF16V4J3 9 ref loi 2 discord 1 x
// 39 https://chainopera.ai/quest/?inviteCode=62EIYVZL
// 41 https://chainopera.ai/quest/?inviteCode=DPKM7XGM https://chainopera.ai/quest/?inviteCode=DPKM7XGM
//42 khong co ref
// 42 https://chainopera.ai/quest/?inviteCode=M0WH203B  https://chainopera.ai/quest/?inviteCode=5ESUNE0A

// 43 https://chainopera.ai/quest/?inviteCode=Q5Z67GPW 10 ref loi 1 dis https://chainopera.ai/quest/?inviteCode=V1VII742
// 44 https://chainopera.ai/quest/?inviteCode=IR097MCN 2 refhttps://chainopera.ai/quest/?inviteCode=Q5Z67GPW

// 45 https://chainopera.ai/quest/?inviteCode=Q5Z67GPW trung https://chainopera.ai/quest/?inviteCode=IR097MCN lôi 1 x
// __Profile _31 MTMyNjQxNTIwODQ2NTMwNTY5MA.G5QYfe.gXfHTSxeB8YTlwlEG5iSo-YeGn3vdeZPIy5Gm4 max LucasPedroca222
// __Profile _32 MTMyNjQyMTYzOTQxOTY2MjM3OA.GzU6rD.A8HEKAD1B4b_OEccvK1R4dUf4lU1DLTjqn4-VQ  max  @@@@@@@@@CobhGogmore

// __Profile _33 MTMyNjQyMzMzNjQyMjYwODkzOQ.GMSqKg.wbJhOsXUaH_xdO8vru4fsXuBTgISrgjiMUmvNA   max tegan_jones
// __Profile _34 MTMyNjUxOTM0NTY3Mjc0OTA1Nw.GZkW9L.dbvCLm5JYHOx3TL1k4THrj90FSWmHqTsvM3sOs   palpaz1
// __Profile _35 MTMyNjUyNjIxMDYxMTYwOTY4MQ.G1t6So.NikY_OdG8eH9zgyXGWkvlUL6pY8Yjj9UBr4ynQ   @@@@@@@@BurguetAngel    ujcnwbjwwreq
// __Profile _36 MTMyNjUyOTcyNDgzNDUxNzA1Ng.GwPDnS.WTSIqG3hnyUJSEXPWSKJUpf1mt1KzcwoF2Cjiw   1 @@@@@@@@ujcnwbjwwreq
// __Profile _37 MTMyNzkwNTM0MTE5OTA5MzgyMQ.GxWlJE.QuP7L4VajSw-a2MVLPNZI3GTiY9-8bH860GmUA
// __Profile _38 MTMyNDMwNDk3MjM1NDk0NTA3Ng.G75MSp.voMYm3x-9MT3xHnOFB7mRiFyYuR1it1gWQwMhE
// __Profile _39 MTMyNDUxMzc0NTkzMzgzMjI4NQ.Gh30y6.n6jMbU7Z1yqOP3cFx5YY-rDI0fFHjIQvZ40qrU

// __Profile _41 MTMyNDUyNTI1MTkyODkxNjE1Mg.G4oxcP.D7pnNdBNT0m9ZmDKJ40KHLXtXshAYglKjTWtYQ
// __Profile _42 MTMyNDQyMDI0ODQwOTIxMDk3Ng.GWTelk.8vtRLqjoh-FyqhJh44obF9Sj78XFInjY0GxRho
// __Profile _43 MTMxODQxMDQ4NjYyMjE5MTY0OA.G6vAny.5fLGxN6x2GxMHV2PPtmIiemOJ7_GGr8rSPDyNw
// __Profile _44 MTMyNTIxNjg2NTUyNTY5NDU1MA.GIre9b.6-0NLoccV0GhR-e-Cx-YbqB3Z3q0Y5W9ZATwK4
// __Profile _45 MTMyNTIxNTM3MzE0MTc0MTU3OQ.GoYl71.eDi-eg_MPLc1wbNb2l7_9g2HmArqwtS4a8umZQ
// 12 https://chainopera.ai/quest/?inviteCode=6IV9JQ5I
// 13 https://chainopera.ai/quest/?inviteCode=1UL2F2IZ
// 14 https://chainopera.ai/quest/?inviteCode=NIAZBT9R
// 15 https://chainopera.ai/quest/?inviteCode=F72DRX1Q
// 16 https://chainopera.ai/quest/?inviteCode=F2MKL1IH
// 17 https://chainopera.ai/quest/?inviteCode=PIDBYRBP
// 18 https://chainopera.ai/quest/?inviteCode=Y0EADXIA
// 19 https://chainopera.ai/quest/?inviteCode=28X2NBAP
// 20 https://chainopera.ai/quest/?inviteCode=SSIJJBVG
// 7 MTI4MTM0NjM2ODk4NzcyOTk5Ng.GbyFSR.uF5yUSkOquD4YEekn6Kf4k0kR40ah9wo4MQPEA
// 8 MTI4MTM1MjI4Njg4NjY5NDkzNA.GSdz0Y.fvVNo6M_NTodwJ5H45GGvED92IUIHenvB2cOd8
// 9 MTI3ODM3OTQ2ODEzMzQ5OTAxOA.GDWx4o.mtQ1HFg0MH0V-7QscNHgXo5Ti5uU8b9co-iyRo
// 10 MTI3OTA0MTAyMzkzMDI2OTY5Ng.GgP86_.ESG9Wq9Mjuv8Pom4p2LrN3I5QlSZK51D3O_z1k
// 12 MTI3OTA2MjcxODY4NjY5MTM5MA.GS1u67.UM7gMNzxEEg2eDAG9vH5ywORfXbaBOd5jBIt18
// 13 MTI3OTE4NjExNDM2Mzc4NTIyNw.GzRu6V.Mr-ZSxrcAxJd6NgbH5-SKGIK296JSzQqnoThfY
// 14 MTI3OTE3MTE2NTY2Mjc0NDYxNw.GSdArx.wDfHUbs-3wWHgJ4nGTDLpOvcnGUSSjgyA06pEs
// 15 MTI3OTQ3MzA1OTk5MjA0Nzc1MQ.G69LPY.LJ2ggkCTH0R-QJsUjw416NxheF1GJQdtJesRyI
// 16 MTI3OTQ3NDk0NDE4NjUxNTQ4Mw.GwHUVW.4MZvKtzVuzL0ZAkl6esp60_vq9ZVI5lHxKWHgA 
// 17 MTI3OTQ3NjU2ODgyMDgxMzg0OQ.G74yOE.GoGkXtDEp3K8JE-exHS_k1_cfI6GT3TUVUspos
// 18 MTI3OTQ3ODUyODAzMDUzOTg5OA.GLmTfJ.MRo2q-S18jCkKtAksjxaLhT8LKIKpJBFFJwHU0
// 19 MTI3OTQ4MDMzNzcxNzc5Mjg2OQ.GFNHsf.utnFeXdQd1HzmAiPkTttCfOK26I1v4gmuKUHWU
// 20 MTMxMjc3MTM3NTcxODczMTc5Nw.GTzgs7.JDnCHsxTu7FPQVY1X2mNPUkVl8mTAL3Mu1PxO0
// __Profile _21 MTI3OTQ4NjQwNTAwNTAxNzE0MA.G9W3m5.kFk30tmHnzZCvw7824uaFNQRDdVKgDHQ_KUX-I max @@@@@@@@@@@@ParkKenny1
// __Profile _22 MTI3OTQ4NzU0MjkzMjE0NDE0Mw.GeL8Yc.nF8p_S5Li1mivo1f2gpuxs90zkk-bd2ZLKN9qM  tam   @@@@@@@@@@@@TodayNalaSoJust
// __Profile _23 MTI5MzE5NDcxNzE5MzgzNDU4MA.Gbcdk6.wORiCNFSqcg4GuPIX3pNd4ugjYMHDNLD1xUqjk  max   allegragusya71
// __Profile _24 MTI5MzE5NjkyMjY0Njk1NDAwNQ.GQyn6l.dtAmnEV-8_7NDQb7g6GL17HS3K6Xs_38Oc0vPo    max    @@@@@@@@@@@@@@@@@@@@nuyegskfxui1428
// __Profile _25 MTI5MjA5MzIzMTA1OTgyODc4MA.Gr_S4e.fwdWf2h_tXgohVX8RkmNJ-fPd6lIsMVgf9TaCI    max   Julia_Williams2
// __Profile _26 MTMxODU2NzYwMDE3MDU5ODUwMA.GQv4Dl.EDQQq0YFnzgcMU9qHm1pu6jjaOlF7lNpRhSuIk max MiguezPolio
// __Profile _27 MTMyNDQ3MTMwNDU4OTU0MTM3Ng.GrghqZ.9wkMjCAqIDys9kFXwLRMfSWzvAIvLOzaBbapyo @@@@@@@@@@@@@@@@@@@GitanshuPareek
// __Profile _28 MTMyNTIxNTM3MzE0MTc0MTU3OQ.G9aVU0.Ko0LFgkPVQegKksKdSNgZ00f9YWdGR1b3FhdJc @@@@@@@@@@@@@@@@@rehaalkhan
// __Profile _29 MTMyNTE1ODA1ODQ3Mjc2NzQ4OA.GW7b-W.KICTm1zoL0rBX-vruZt38f6m6Mrn6zjnWpOyss @@@@@@@@@@@@@@@@@AndyWil02357070
// __Profile _30 MTMyNDM1NDMzOTgyOTA1OTcwNQ.GYhoMj.R6_rfp95yM-ess_-uG2A98SymCHsPyA4hhV37Y max HanamidoMahiro 

run()