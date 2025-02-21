const { workerData, parentPort } = require('worker_threads');
//const puppeteer = require("puppeteer");
const path = require('path');
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AnonymizeUAPlugin = require("puppeteer-extra-plugin-anonymize-ua");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");

puppeteer.use(StealthPlugin());
puppeteer.use(AnonymizeUAPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const proxyChain = require('proxy-chain');

// const MissionPortal = require('../mission/mission.portal');
const Util = require('../util/util');
const globalState = require('../config/globalState');
const Twitter = require('../modules/twitter/twitter');
const { axios, fs } = require('../config/module.import');
// const MissionMongo = require('../mission/mission.mongo');
// const PhantomWallet = require('../modules/wallet/phantom/phantom');
const Discord = require('../modules/discord/discord');
const SuiWallet = require('../modules/wallet/sui/sui');
const axiosService = require('../services/axios.service');
const OkxWallet = require('../modules/wallet/okx/okx');
const ChainOpenMission = require('../mission/chainopera');
const Yescaptra = require('../modules/yescaptra/yescaptra');
const PageService = require('../services/page.service');
const ElementService = require('../services/element.service');
const PhantomWallet = require('../modules/wallet/phantom/phantom');
const { fail } = require('assert');
const { create } = require('domain');
require('dotenv').config();
async function run() {
    let isPageClosed = false;
    let isNext = false;
    let start = false;
    let connect = false;
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
        isPageClosed = false
    }
    const selectDomail = async (bumba) => {
        if (globalState.workerData.twitter.domain === 'bumba.sbs') {
            await bumba.evaluate(() => {
                const input = document.querySelector('[x-ref="domain"]');
                if (input) {
                    input.value = 'bumba.sbs';
                }
            });
        } else if (globalState.workerData.twitter.domain === 'viralmail.top') {
            await bumba.evaluate(() => {
                const input = document.querySelector('[x-ref="domain"]');
                if (input) {
                    input.value = 'viralmail.top';
                }
            });
        } else if (globalState.workerData.twitter.domain === 'xrmail.autos') {
            await bumba.evaluate(() => {
                const input = document.querySelector('[x-ref="domain"]');
                if (input) {
                    input.value = 'xrmail.autos';
                }
            });
        } else if (globalState.workerData.twitter.domain === 'viralmail.vip') {
            await bumba.evaluate(() => {
                const input = document.querySelector('[x-ref="domain"]');
                if (input) {
                    input.value = 'viralmail.vip';
                }
            });
        } else if (globalState.workerData.twitter.domain === 'viralmail.sbs') {
            await bumba.evaluate(() => {
                const input = document.querySelector('[x-ref="domain"]');
                if (input) {
                    input.value = 'viralmail.sbs';
                }
            });
        }
    }
    const extensions = [
        'E:\\puppeteer-auto-meta-proxy\\extensions\\yescaptra',
        // 'E:\\puppeteer-auto-meta-proxy\\extensions\\MetaMask\\nkbihfbeogaeaoehlefnkodbefgpgknn',
        //'E:\\puppeteer-auto-meta-proxy\\extensions\\Mango',
        // 'E:\\puppeteer-auto-meta-proxy\\extensions\\OKX',
    ];
    function getRandomImage(imageDir) {
        try {
            // Lấy danh sách tất cả các file trong thư mục
            const files = fs.readdirSync(imageDir);

            // Lọc ra các file hình ảnh (chỉ lấy file .png, .jpg, .jpeg, .gif, .webp)
            const imageFiles = files.filter(file => /\.(png|jpe?g|gif|webp)$/i.test(file));

            if (imageFiles.length === 0) {
                console.error("❌ Không có hình ảnh nào trong thư mục.");
                return;
            }

            // Chọn một hình ảnh ngẫu nhiên
            const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
            const imagePath = path.join(imageDir, randomImage);

            console.log("📂 Đã chọn hình ảnh:", randomImage);

            // Dừng function tại đây
            return imagePath;

        } catch (error) {
            console.error("⚠ Lỗi xảy ra:", error);
        }
    }
    async function runPhantomWallet() {
        // const page = await PageService.openNewPage('https://x.com/i/flow/login')
        // page.on('close', async () => {
        //     isNext = true;
        // });
        // await waitAndType(page, 
        //     "input[name='text'][type='text'][autocomplete='username']", 
        //     workerData.twitter.user
        // );

        // await ElementService.HandlefindAndClickElement(
        //     page,
        //     "//button[@role='button' and .//span/span[text()='Next']]"
        // );
        // await ElementService.HandlefindAndTypeElement(
        //     page,
        //     "//input[@type='password' and @name='password' and @autocomplete='current-password']",
        //     globalState.workerData.twitter.pass
        // );
        // await ElementService.HandlefindAndClickElement(
        //     page,
        //     "//button[@role='button' and .//span/span[text()='Log in']]"
        // );
        // const auth2fa = globalState.workerData.twitter.auth2fa
        // console.log('auth2fa', auth2fa)
        // await Util.sleep(5000)
        // const inputSelector = '[data-testid="ocfEnterTextTextInput"]';
        // const inputelement = await ElementService.ElementWaitForSelector(page, inputSelector, 10)
        // if (inputelement.found) {
        //     await Util.waitFor1sAnd30s()
        //     const auth = await axiosService.get2faToken(auth2fa)
        //     await inputelement.element.type(auth);
        // }
        // await ElementService.HandlefindAndClickElement(
        //     page,
        //     "//button[@role='button' and .//span/span[text()='Next']]",
        //     10
        // );
        // await Util.sleep(20000);
        // await processLogin()
        // while (true) {
        //     await Util.sleep(5000);
        //     const pageTarget1 = await PageService.findPageByUrl('https://x.com/home')
        //     if (pageTarget1.check) {
        //         await page.close()
        //         break;
        //     }
        // }
        // while (true) {
        //     if (isNext) {
        //         break;
        //     }
        //     await Util.sleep(5000)
        // }
        while (true) {
            if (globalState.isPageClosed) {
                console.log("thoat runPhantomWallet");
                break;
            }

            try {
                await PhantomWallet.Conect()
                // await PhantomWallet.Conect()
                // await PhantomWallet.Confirm()
            } catch (error) {
                console.error("Error connecting to Phantom Wallet:", error);
            }

            await Util.sleep(5000);
        }
    }

    async function clickButton1(page, xpath) {
        try {
            // Chờ phần tử xuất hiện bằng XPath
            const elementHandle = await page.evaluateHandle((xpath) => {
                return document.evaluate(
                    xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
                ).singleNodeValue;
            }, xpath);

            if (!elementHandle) {
                console.error("Không tìm thấy nút:", xpath);
                return false;
            }

            // Click vào nút bằng evaluate
            const clicked = await page.evaluate((el) => {
                if (el && el.offsetWidth > 0 && el.offsetHeight > 0 && !el.disabled) {
                    el.scrollIntoView();
                    el.click();
                    return true;
                }
                return false;
            }, elementHandle);

            if (clicked) {
                console.log("✅ Click thành công:", xpath);
                return true;
            } else {
                console.error("Không thể click vì nút bị ẩn hoặc vô hiệu hóa:", xpath);
                return false;
            }
        } catch (error) {
            console.error("Lỗi khi click:", error);
            return false;
        }
    }

    async function waitAndClick1(umba, selector) {
        while (true) {
            if (globalState.isPageClosed) break
            const elementHandle = await umba.evaluateHandle((xpath) => {
                return document.evaluate(
                    xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
                ).singleNodeValue;
            }, selector);

            if (elementHandle) {
                const success = await clickButton1(umba, selector);
                if (success) return true;
            }

            await Util.sleep(5000)
        }
    }

    async function clickButton(page, btnSelector) {
        try {
            console.log(`[clickButton] Chờ tìm nút: ${btnSelector}`);
            await page.waitForSelector(btnSelector, { visible: true, timeout: 10000 });

            const btn = await page.$(btnSelector);
            if (btn) {
                console.log(`[clickButton] Tìm thấy nút: ${btnSelector}, kiểm tra trạng thái...`);
                const clicked = await page.evaluate(selector => {
                    const btn = document.querySelector(selector);
                    if (btn && btn.offsetWidth > 0 && btn.offsetHeight > 0 && !btn.disabled) {
                        console.log(`[clickButton] Nút hợp lệ, thực hiện click: ${selector}`);
                        btn.scrollIntoView();
                        const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                        btn.dispatchEvent(event);
                        return true;  // ✅ Click thành công
                    }
                    console.log(`[clickButton] Nút bị ẩn hoặc disabled: ${selector}`);
                    return false;  // ❌ Nút bị ẩn hoặc disabled
                }, btnSelector);

                if (!clicked) {
                    console.error(`[clickButton] Không thể click vì nút bị ẩn hoặc vô hiệu hóa: ${btnSelector}`);
                    return false;
                }
                console.log(`[clickButton] Click thành công: ${btnSelector}`);
                return true;
            } else {
                console.error(`[clickButton] Không tìm thấy nút: ${btnSelector}`);
                return false;
            }
        } catch (error) {
            console.error(`[clickButton] Lỗi khi click: ${error.message}`);
            return false;
        }
    }

    async function typeInput(page, selector, text) {
        try {
            console.log(`[typeInput] Chờ tìm input: ${selector}`);
            await page.waitForSelector(selector, { visible: true, timeout: 10000 });

            console.log(`[typeInput] Tìm thấy input: ${selector}, chuẩn bị nhập dữ liệu...`);
            const input = await page.$(selector);
            if (input) {
                console.log(`[typeInput] Bắt đầu nhập dữ liệu vào: ${selector}`);
                await input.click({ clickCount: 3 }); // Chọn toàn bộ văn bản trước khi nhập
                await page.type(selector, text); // Gõ văn bản
                console.log(`[typeInput] Nhập thành công: ${text}`);
                return true; // Nhập thành công
            } else {
                console.error(`[typeInput] Không tìm thấy ô input: ${selector}`);
                return false;
            }
        } catch (error) {
            console.error(`[typeInput] Lỗi khi nhập dữ liệu: ${error.message}`);
            return false;
        }
    }

    async function waitAndClick(umba, selector) {
        console.log(`[waitAndClick] Bắt đầu chờ và click: ${selector}`);
        while (true) {
            if (globalState.isPageClosed) {
                console.log(`[waitAndClick] Trang đã đóng, thoát khỏi vòng lặp.`);
                return;
            }
            if (isPageClosed) {
                console.log(`[waitAndType] Trang đã đóng, thoát khỏi vòng lặp.`);
                return;
            }
            const input = await umba.$(selector);
            if (input) {
                console.log(`[waitAndClick] Tìm thấy nút, thử click: ${selector}`);
                const success = await clickButton(umba, selector);
                if (success) {
                    console.log(`[waitAndClick] Click thành công: ${selector}`);
                    break;
                }
            } else {
                //console.log(`[waitAndClick] Chưa tìm thấy nút: ${selector}, thử lại sau...`);
            }

            await Util.sleep(3000);
        }
    }

    async function waitAndType(page, selector, text) {
        console.log(`[waitAndType] Bắt đầu chờ và nhập dữ liệu vào: ${selector}`);
        while (true) {
            if (globalState.isPageClosed) {
                console.log(`[waitAndType] Trang đã đóng, thoát khỏi vòng lặp.`);
                return;
            }
            if (isPageClosed) {
                console.log(`[waitAndType] Trang đã đóng, thoát khỏi vòng lặp.`);
                return;
            }
            const success = await typeInput(page, selector, text);
            if (success) {
                console.log(`[waitAndType] Nhập dữ liệu thành công: ${text} vào ${selector}`);
                break; // Thoát vòng lặp nếu nhập thành công
            } else {
                console.log(`[waitAndType] Nhập thất bại, thử lại sau...`);
            }

            await Util.sleep(3000);
        }
    }

    async function getTabByIndex(index) {
        const pages = await globalState.browser.pages();
        if (index < pages.length) {
            const page = pages[index];
            await page.bringToFront();
            return page;
        } else {
            throw new Error("Index tab không hợp lệ!");
        }
    }

    async function processLogin() {
        const find = await PageService.findPageByUrl('https://x.com/account/access');
        if (!find.check) {
            console.log("Không tìm thấy trang.");
            return;
        }

        const page = await PageService.getTargetPage(find.url);
        await Util.sleep(3000);

        while (true) {
            console.log("Bắt đầu vòng lặp chính.");

            try {
                // Lấy tất cả phần tử cùng lúc
                const elements = await Promise.allSettled([
                    page.$('input[value="Start"]'),
                    page.$('input[value="Continue to X"]'),
                    page.$('input[value="Send email"]'),
                    page.$('input[name="token"]')
                ]);

                const startButton = elements[0].value;
                const continueButton = elements[1].value;
                const sendEmailButton = elements[2].value;
                const inputField = elements[3].value;

                // Nhấn các nút nếu có (chạy đồng thời)
                await Promise.allSettled([
                    startButton ? startButton.click() : null,
                    sendEmailButton ? sendEmailButton.click() : null,
                ]);

                if (sendEmailButton) {
                    console.log("Nhấn 'Send email'.");
                }

                if (continueButton) {
                    await continueButton.click();
                    console.log("Nhấn 'Continue to X' thành công, thoát vòng lặp.");
                    break;
                }

                // Nếu có ô nhập mã xác nhận, lấy mã từ email
                if (inputField) {
                    const codeMail = await getVerificationCode();
                    if (codeMail) {
                        console.log(`Nhập mã xác nhận: ${codeMail}`);
                        await page.type('input[name="token"]', codeMail);



                        const clicked = await waitAndClick(page, 'input[placeholder="Select Domain"]');
                        const verifyButton = await page.$('input[type="submit"][value="Verify"]');
                        if (verifyButton) {
                            await verifyButton.click();
                            console.log("Nhấn 'Verify'.");
                        }
                    }
                }

            } catch (error) {
                console.error("Lỗi trong vòng lặp:", error);
            }

            console.log("Lặp lại vòng lặp...");
            await Util.sleep(3000);
        }
    }

    async function getVerificationCode() {
        console.log("Đang tìm mã xác nhận trong mail...");

        while (true) {
            const pageMail = await getTabByIndex(1);
            await Util.sleep(5000);

            const emailFound = await ElementService.HandlefindAndElementText(pageMail, 'verify@x.com');
            if (emailFound) {
                await ElementService.HandlefindAndClickElement(pageMail, '/html/body/div[1]/div/div[2]/div/main/div[1]/div/div');

                return await pageMail.evaluate(() => {
                    const iframe = document.querySelector('iframe');
                    if (!iframe) return null;

                    const iframeDocument = iframe.contentWindow.document;
                    const fullText = iframeDocument.body.textContent || iframeDocument.body.innerText;
                    const numbers = fullText.match(/\d+/g);

                    return numbers ? numbers.reduce((max, current) => current.length > max.length ? current : max, '') : null;
                });
            }

            console.log("Không tìm thấy email, thử lại sau 5 giây.");
            await Util.sleep(5000);
        }
    }

    async function closePageWhenUrlMatches(targetUrl) {
        globalState.browser.on('targetcreated', async (target) => {
            try {
                const page = await target.page();
                if (!page) return; // Nếu không có page, thoát khỏi hàm

                await page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => { });
                const currentUrl = page.url();
                // console.log(`Tab mới mở với URL: ${currentUrl}`);

                if (currentUrl.includes(targetUrl)) {
                    // console.log('URL trùng khớp, đóng tab...');
                    await page.close();
                }
            } catch (error) {
                console.error('Lỗi khi xử lý targetcreated:', error);
            }
        });

        // Kiểm tra lại tất cả các tab đã mở (nếu cần)
        try {
            const pages = await globalState.browser.pages();
            for (const page of pages) {
                const currentUrl = await page.url();
                if (currentUrl.includes(targetUrl)) {
                    console.log('URL trùng khớp, đóng tab ngay...');
                    await page.close();
                }
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra các tab đã mở:', error);
        }
    }

    async function focusPageWhenUrlMatches(targetUrl) {
        globalState.browser.on('targetcreated', async (target) => {
            try {
                const page = await target.page();
                if (!page) return; // Nếu không có page, thoát khỏi hàm

                await page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => { });
                const currentUrl = page.url();

                if (currentUrl.includes(targetUrl)) {
                    console.log(`Tab mới mở với URL: ${currentUrl}, chuyển focus...`);
                    await page.bringToFront(); // Đưa tab này lên trước
                }
            } catch (error) {
                console.error('Lỗi khi xử lý targetcreated:', error);
            }
        });

        // Kiểm tra lại tất cả các tab đã mở (nếu cần)
        try {
            const pages = await globalState.browser.pages();
            for (const page of pages) {
                const currentUrl = await page.url();
                if (currentUrl.includes(targetUrl)) {
                    console.log(`Đã tìm thấy trang có URL: ${currentUrl}, chuyển focus...`);
                    await page.bringToFront(); // Đưa tab này lên trước
                }
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra các tab đã mở:', error);
        }
    }

    async function switchToPageByIndex(index) {
        if (!globalState.browser) {
            console.log("Browser chưa khởi tạo!");
            return null;
        }

        const pages = await globalState.browser.pages(); // Lấy danh sách tất cả tab

        if (index >= pages.length) {
            console.log(`Không có đủ tab! Hiện tại chỉ có ${pages.length} tab.`);
            return null;
        }

        const page = pages[index]; // Lấy tab theo index
        await page.bringToFront(); // Chuyển tab đó lên trước
        console.log(`Đã chuyển đến tab thứ ${index}`);

        return page;
    }

    async function ClickElementA(page, xpath) {
        await waitAndClick1(page, xpath);
    }
    async function performTwitterAuthActions() {
        while (true) {
            await Util.sleep(5000);
            if (isPageClosed) break
            if (globalState.isPageClosed) break

            const [pageTarget1, pageTarget2] = await Promise.all([
                PageService.findPageByUrl('https://twitter.com/i/oauth2/authorize'),
                PageService.findPageByUrl('https://twitter.com/i/flow/login?redirect_after_login='),
            ]);

            if (pageTarget1.check) {
                const page = await PageService.getTargetPage(pageTarget1.url);
                if (await clickButton(page, `[data-testid="OAuth_Consent_Button"]`)) break
            }

            if (pageTarget2.check) {
                const page = await PageService.getTargetPage(pageTarget2.url);
                await waitAndType(page,
                    "input[name='text'][type='text'][autocomplete='username']",
                    globalState.workerData.twitter.user
                );

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
                );

                if (await waitAndClick(page, `[data-testid="OAuth_Consent_Button"]`)) break
            }

        }
    }
    const extensionsPaths = extensions.join(',');
    globalState.workerData = workerData
    const proxy = workerData.proxy;
    console.log('proxy', proxy)
    const newProxyUrl = await proxyChain.anonymizeProxy(proxy);
    const browser = await puppeteer.launch({
        //devtools: true,
        headless: false,
        ignoreDefaultArgs: ["--disable-extensions", "--enable-automation"],
        args: [
            '--no-sandbox',
            '--allow-file-access-from-files',
            '--disable-setuid-sandbox',
            //`--proxy-server=${newProxyUrl}`,
            '--disable-extensions-except=E:\\puppeteer-auto-meta-proxy\\extensions\\Phantom',
            //`--load-extension=E:\\puppeteer-auto-meta-proxy\\extensions\\yescaptra`,
            '--profile-directory=Profile 1',
            //'--start-maximized'
        ],
        defaultViewport: null,
    });
    browser.on('disconnected', () => {
        globalState.isPageClosed = true;
    });

    //"E:\puppeteer-auto-meta-proxy\extensions\"
    //await PhantomWallet.Create()

    globalState.browser = browser

    try {
        //await Discord.LoginToken(workerData.token)
        //await ChainOpenMission()
        //   
        await PhantomWallet.ImportPrivateKey()


        //console.log(`${workerData.mnemonic}:` )
        // const coinbase = await PageService.openNewPage('chrome-extension://ejafhipbgcijgogekcengmlikoopgpip/index.html')
        // await waitAndClick(coinbase, '[data-testid="btn-import-existing-wallet"]')
        // await waitAndClick(coinbase, '[data-testid="btn-import-recovery-phrase"]')
        // await ElementService.HandlefindAndClickElement(coinbase, '//*[@id="modalsContainer"]/div/div/div[2]/div/div/div/div[2]/button') 
        // await Util.sleep(3000)
        // await waitAndType(coinbase, '[data-testid="secret-input"]', `${workerData.mnemonic}`);
        // await waitAndClick(coinbase, '[data-testid="btn-import-wallet"]')
        // await waitAndType(coinbase, '[data-testid="setPassword"]', 'Hunghung123');
        // await typeInput(coinbase, '[data-testid="setPasswordVerify"]', 'Hunghung123');
        // await waitAndClick(coinbase, '[data-testid="terms-and-privacy-policy"]')
        // await waitAndClick(coinbase, '[data-testid="btn-password-continue"]')
        //console.log('globalState.globalState.isPageClosed', globalState.isPageClosed)
        //         await PhantomWallet.ImportWallet()

        //         const stop = await PageService.openNewPage('https://app.galxe.com/quest/f3JRDwV9qNWXWq7oZpP8SU/GCEx4tpYHb')
        //         await Util.sleep(3000)
        //         stop.on('close', async () => {
        //             globalState.isPageClosed = true;
        //         });

        //  await waitAndClick1(stop, `//button[contains(text(), 'Log in')]`)
        //  await waitAndClick1(stop, `//div/div/div[contains(text(), 'Phantom EVM')]`)

        // await runPhantomWallet();


        // await runPhantomWallet();
        // await PageService.openNewPage('https://app.galxe.com/accountSetting/wallet')
        // await runPhantomWallet();
        // await ElementService.HandlefindAndClickElement(stop, '/html/body/div[1]/header/div[1]/div[2]/div[4]/button') 
        // await ElementService.HandlefindAndClickElement(stop, '//*[@id="radix-:r1h:"]/div[2]/div/div/div[3]/div') 

        // await waitAndClick(coinbase, 'input[aria-label="Recovery phrase or private key"]')
        // await waitAndType(coinbase, 'input[aria-label="Recovery phrase or private key"]', 'syrup dawn join nurse motor shiver insane tuna link tattoo reason brown')


        // const page2fa = await PageService.openNewPage('https://example.com')
        // page2fa.on('close', async () => {
        //     connect = true;
        // });
        // await waitAndType(page2fa, '#listToken', `${workerData.twitter.user}=${workerData.twitter.pass}=${workerData.twitter.auth2fa}`)

        // const bumba = await PageService.openNewPage('https://bumba.sbs/mailbox')
        // bumba.on('close', async () => {
        //     globalState.isPageClosed = true;
        // });
        // await Util.sleep(2000)
        // await ElementService.HandlefindAndClickElement(bumba, '/html/body/div[1]/div/div[1]/div[2]/div[2]/div[2]/div[3]')
        // const clicked = await waitAndClick(bumba, 'input[placeholder="Select Domain"]');
        // console.log("Click thành công:", clicked);
        // await ElementService.HandlefindAndClickElementText(bumba, `${workerData.twitter.domain}`)
        // await Util.sleep(5000);
        // const typed = await waitAndType(bumba, '#user', workerData.twitter.usermail);
        // await waitAndClick(bumba, 'input[value="Create"]');




        // const PageStart1 = await PageService.openNewPage('https://example.com')
        // PageStart1.on('close', async () => {
        //     start = true;
        // });
        //gmail main: https://app.drops.house/invite?code=OQJZJJHCFU&ext_id=vM6ZS3fyt
        //gmail tranthaibobo1@gmail.com: https://app.drops.house/invite?code=REUDRSQZBF&ext_id=vM6ZS3fyt
        //gmail hungloverang: https://app.drops.house/invite?code=NXZVNABMLG&ext_id=vM6ZS3fyt
        //gmail inditran798@gmail.com profile14: https://app.drops.house/invite?code=TIPVISBLEP&ext_id=vM6ZS3fyt
        //gmail hitj2015@gmail.com profile15: https://app.drops.house/invite?code=YQXTGHMZFG&ext_id=vM6ZS3fyt

        // await PageService.openNewPage('https://app.drops.house/invite?code=OQJZJJHCFU&ext_id=vM6ZS3fyt')
        // await Util.sleep(20000);
        //    await PageService.openNewPage('https://app.drops.house/invite?code=OQJZJJHCFU&ext_id=vM6ZS3fyt')
        //     //await PageService.openNewPage('https://app.drops.house/invite?code=YQXTGHMZFG&ext_id=vM6ZS3fyt')
        //     while (true) {
        //         if (start) break
        //         await Util.sleep(5000)
        //     }
        //     const drops = await PageService.getTargetPage('https://app.drops.house/home?ext_id=vM6ZS3fyt')
        //     await drops.goto('https://app.drops.house/invite?code=OQJZJJHCFU&ext_id=vM6ZS3fyt')


        await Util.sleep(25000)
        const drops = await PageService.openNewPage('https://app.drops.house/invite?code=OQJZJJHCFU&ext_id=vM6ZS3fyt')
        //await  drops.reload()
        await waitAndClick(drops, '.MuiButtonBase-root.sc-9174c518-0.dWxtmS.mui-1lwvx7t')

        const costSetup = {
            login: false
        };

        if (costSetup.login) {
            console.log("Thực hiện đăng nhập...");
            await waitAndType(drops, 'input[name="email"]', `${workerData.twitter.usermail}@${workerData.twitter.domain}`);
            await waitAndType(drops, 'input[placeholder="Enter password"]', 'hunghung');
            await ElementService.HandlefindAndClickElement(drops, '/html/body/div/div[3]/div/div/div/div/div/div/div[2]/button');
            await ClickElementA(drops, '//a[@href="/create-entry?ext_id=vM6ZS3fyt&stepId=1243"]')

            // await waitAndClick(drops, 'body > main > div > div.MuiBox-root.mui-eid0jk > div > div > div.MuiBox-root.mui-ssji0h > div:nth-child(2) > button')
            // await waitAndClick(drops, 'body > div > div > button:nth-child(1)')
            // await waitAndClick(drops, 'body > div > div.sc-bf50649f-0.glTYnY > div > div > div > div > div.MuiBox-root.mui-k1m81y > div:nth-child(2) > div.MuiBox-root.mui-172hjuw > button')

            //  await Util.sleep(5000)
            // const elementHandle = await drops.$("input[type=file]");
            // // Gọi function và lấy đường dẫn ảnh ngẫu nhiên
            // const selectedImage = getRandomImage('E:\\puppeteer-auto-meta-proxy\\img');
            // console.log("✅ Đường dẫn ảnh được chọn:", selectedImage);
            // await elementHandle.uploadFile(selectedImage);
            // await Util.sleep(5000)
            // await waitAndClick1(drops, `//button/span[contains(text(), 'Confirm image')]`)
            // await Util.sleep(10000)

            // await waitAndClick(drops, 'body > div > div.sc-bf50649f-0.glTYnY > div > div > div > div > div.MuiBox-root.mui-1l3f6cq > button')
            // await waitAndClick(drops, 'body > main > div > div.MuiBox-root.mui-eid0jk > div > div > div.MuiBox-root.mui-ssji0h > div:nth-child(2) > button')
            // await waitAndClick(drops, 'body > div > div > button:nth-child(1)')
            // await clickButton(drops, 'body > div > div.sc-bf50649f-0.glTYnY > div > div > div > div > div.MuiBox-root.mui-k1m81y > div:nth-child(1) > div.MuiBox-root.mui-13vm9ex > button.MuiButtonBase-root.sc-9174c518-0.jwpHSr.mui-1yzuwfs')
            // console.log(email)
            // await ElementService.HandleWaitForSelectorTypeElement(drops, 'body > div > div.sc-bf50649f-0.glTYnY > div > div > div > div > div.MuiBox-root.mui-1wkw8lz > div > div > input', email, 10)
            // await clickButton(drops, 'body > div > div.sc-bf50649f-0.glTYnY > div > div > div > div > div.MuiBox-root.mui-1wkw8lz > button')
            // await switchToPageByIndex(0)




        






            // await Util.sleep(15000)
            // await drops.close()
            //await drops.click('selector-of-submit-button');


            //         await fileInput.uploadFile('E:\\puppeteer-auto-meta-proxy\\scr\\test\\demo.png');


            // await ClickElementA(drops, '//a[@href="/create-entry?ext_id=vM6ZS3fyt&stepId=1243"]')
        } else {
            console.log("Thực hiện tạo tài khoản...");
            await waitAndClick(
                drops,
                'body > div > div.sc-bf50649f-0.glTYnY > div > div > div > div > div > div > div.MuiFormControl-root.MuiFormControl-fullWidth.mui-18yhbev > div.MuiBox-root.mui-gdd1t7 > button'
            );

            await waitAndType(drops, 'input[name="email"]', `${workerData.twitter.usermail}@${workerData.twitter.domain}`);
            await waitAndType(drops, 'input[placeholder="Enter password"]', 'hunghung');
            await waitAndType(drops, 'input[placeholder="Confirm password"]', 'hunghung');
            await Util.sleep(500);
            await ElementService.HandlefindAndClickElement(drops, '/html/body/div/div[3]/div/div/div/div/div/div/div[2]/button');

            await waitAndType(drops, 'input[placeholder="Enter username"]', workerData.twitter.user);
            await Util.sleep(500);
            await ElementService.HandlefindAndClickElement(drops, '/html/body/div/div[3]/div/div/div/div/div[2]/button');

            await ClickElementA(drops, '//a[@href="/create-entry?ext_id=vM6ZS3fyt&stepId=1243"]')
           
            async function Await() {
                while (true) {
                    const page = await PageService.findPageByUrl('chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/notification.html')
                    if (page.check) {
                        console.log("tim thấy")
                        const pagePartalWallet = await PageService.getTargetPage('chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/notification.html')
    
                        if (!pagePartalWallet) return;

                        if (await ElementService.HandleWaitForSelectorTypeElement(
                            pagePartalWallet,
                            '#unlock-form > div > div:nth-child(3) > div > input',
                            'hunghung',
                            1
                        )) {
                            await pagePartalWallet.keyboard.press("Enter");
                        }
                        await ElementService.HandleWaitForSelectorClickElement(pagePartalWallet,
                            '#root > div > div.sc-htJRVC.Ifjhy > div > div.sc-jRQBWg.sc-pVTFL.EgSbv.cZzoXH > div > button.sc-fFeiMQ.gbIHNA',
                            1
                        )
                        
                        return;    
                    }
                    if (globalState.isPageClosed) {
                        console.log("thoat runPhantomWallet");
                        return;
                    }
                    await Util.sleep(2000)
                }
            }
            //await Await()
            // await Util.sleep(10000)
            // await Await()
            //await ClickElementA(drops, '//a[@href="/create-entry?ext_id=vM6ZS3fyt&stepId=1243"]')
            
            await waitAndClick(drops, 'body > main > div > div.MuiGrid-root.mui-el7nhs > div.MuiGrid-root.mui-9e5sfg > div > div > div > div > button');
        }
        async function mission1(drops, page1, page2) {
            while (true) {
                if (globalState.start) break

                await Util.sleep(3000)
            }
            await focusPageWhenUrlMatches('https://app.drops.house/create-entry?ext_id=vM6ZS3fyt&stepId=1243')
            // await waitAndClick(drops,
            //     '#create-entry-page > div > div.sc-803d9c0a-0.kRhkId.MuiBox-root.mui-1pa21yv > div > div > div > div.MuiBox-root.mui-1mv7f1u > div > div.MuiBox-root.mui-7jugx5 > div > div > a > div > article > div.tweet-header_header__CXzdi > div > div > div > a'
            // )
            // await ElementService.HandlefindAndClickElementText(drops, 'Open Twitter')
            await focusPageWhenUrlMatches('https://app.drops.house/create-entry?ext_id=vM6ZS3fyt&stepId=1243')
            await waitAndClick(drops,
                'body > main > div > div.MuiGrid-root.mui-el7nhs > div.MuiGrid-root.mui-9e5sfg > div > div > button.MuiButtonBase-root.sc-9174c518-0.dWxtmS.mui-1yzuwfs'
            )


            await focusPageWhenUrlMatches('https://app.drops.house/create-entry?ext_id=vM6ZS3fyt&stepId=1052')
            await Util.sleep(3000)
            await ElementService.HandlefindAndClickElementText(page1, 'Open Twitter')
            await focusPageWhenUrlMatches('https://app.drops.house/create-entry?ext_id=vM6ZS3fyt&stepId=1052')
            await waitAndClick(page1,
                'body > main > div > div.MuiGrid-root.mui-el7nhs > div.MuiGrid-root.mui-9e5sfg > div > div > button.MuiButtonBase-root.sc-9174c518-0.dWxtmS.mui-1yzuwfs'
            )


            await focusPageWhenUrlMatches('https://app.drops.house/create-entry?ext_id=vM6ZS3fyt&stepId=1210')
            await Util.sleep(3000)
            //await ElementService.HandlefindAndClickElementText(page2, 'Open Twitter')
            // await waitAndClick(page2,
            //     '#create-entry-page > div > div.sc-803d9c0a-0.kRhkId.MuiBox-root.mui-1pa21yv > div > div > div > div.MuiBox-root.mui-1mv7f1u > div > div.MuiBox-root.mui-7jugx5 > a'
            // )
            await focusPageWhenUrlMatches('https://app.drops.house/create-entry?ext_id=vM6ZS3fyt&stepId=1210')
            await waitAndClick(page2,
                'body > main > div > div.MuiGrid-root.mui-el7nhs > div.MuiGrid-root.mui-9e5sfg > div > div > button.MuiButtonBase-root.sc-9174c518-0.dWxtmS.mui-1yzuwfs'
            )



            return
        }


        // console.log("Hoàn thành tác vụ!");

        const page1 =  await PageService.openNewPage('https://app.drops.house/create-entry?ext_id=vM6ZS3fyt&stepId=1052')
        // // //await waitAndClick1(page1, `//a/span[contains(text(), 'Open Twitter')]`)

        const page2 =  await PageService.openNewPage('https://app.drops.house/create-entry?ext_id=vM6ZS3fyt&stepId=1210')
        // // //await waitAndClick1(page2, `//a/span[contains(text(), 'Open Twitter')]`)
        const PageStart = await PageService.openNewPage('https://app.drops.house/create-entry?ext_id=vM6ZS3fyt&stepId=1256')
   
        await switchToPageByIndex(1)
        // await Util.sleep(5000)

        // await waitAndClick(drops, 'body > main > div > div.MuiGrid-root.mui-el7nhs > div.MuiGrid-root.mui-9e5sfg > div > div > div > button')

        // await ElementService.Shadown(drops,
        //     'document.querySelector("body > w3m-modal").shadowRoot.querySelector("wui-flex > wui-card > w3m-router").shadowRoot.querySelector("div > w3m-connect-view").shadowRoot.querySelector("wui-flex > w3m-wallet-login-list").shadowRoot.querySelector("wui-flex > w3m-connect-announced-widget").shadowRoot.querySelector("wui-flex > wui-list-wallet").shadowRoot.querySelector("button")'
        // )
       // await PhantomWallet.Conect()
        async function runAllActions() {
            while (true) {
                if (globalState.isPageClosed) {
                    console.log(`[waitAndClick] Trang đã đóng, thoát khỏi vòng lặp.`);
                    return;
                }

                try {
                    await Promise.allSettled([
                        performTwitterAuthActions(),
                        PhantomWallet.Conect(),
                        //mission1(drops, page1, page2),
                       
                        closePageWhenUrlMatches('https://x.com/intent/retweet?tweet_id=1889742997027541270'),
                        closePageWhenUrlMatches('https://x.com/intent/like?tweet_id=1882441880669151489'),
                        closePageWhenUrlMatches('https://x.com/intent/follow?region=follow_link&screen_name=FoxyLinea'),
                        closePageWhenUrlMatches('https://x.com/intent/retweet?tweet_id=1882441880669151489'),
                        closePageWhenUrlMatches('https://x.com/intent/follow?region=follow_link&screen_name=LineaBuild'),
                        closePageWhenUrlMatches('https://www.welikethefox.io/'),
                        closePageWhenUrlMatches('https://x.com/intent/retweet?tweet_id=1887194893229187488'),
                        closePageWhenUrlMatches('https://x.com/FoxyLinea/status/1889742997027541270'),
                        closePageWhenUrlMatches('https://x.com/FoxyLinea/status/1882441880669151489'),
                        closePageWhenUrlMatches('https://twitter.com/FoxyLinea'),
                        closePageWhenUrlMatches('https://x.com/FoxyLinea/status/1882441880669151489'),
                        closePageWhenUrlMatches('https://twitter.com/LineaBuild'),
                        closePageWhenUrlMatches('https://www.welikethefox.io/'),
                        closePageWhenUrlMatches('https://x.com/FoxyLinea/status/1887194893229187488'),
                    ]);
                } catch (error) {
                    console.error("Lỗi khi thực hiện hành động:", error);
                }
            }
        }
        await runAllActions()

        while (true) {
            if (globalState.isPageClosed) break
            await Util.sleep(500)
        }
        parentPort.postMessage({ status: 'Success' });
    } catch (error) {
        console.log(`waitForSelector{workerData.Profile} that bai`, error)
        parentPort.postMessage({ status: 'Failure' });
    } finally {
        await browser.close()
    }
}

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