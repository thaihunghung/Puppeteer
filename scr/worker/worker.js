const { workerData, parentPort } = require('worker_threads');
const { BrowserService, ElementService, PageService } = require('../config/import.service');

const MissionPortal = require('../mission/mission.portal');
const Util = require('../util/util');
const globalState = require('../config/globalState');
const Twitter = require('../modules/twitter/twitter');
const { axios, path } = require('../config/module.import');
const MissionMongo = require('../mission/mission.mongo');
const PhantomWallet = require('../modules/wallet/phantom/phantom');
const MetaWallet = require('../modules/wallet/metamask/meta');
const axiosService = require('../services/axios.service');
const OkxWallet = require('../modules/wallet/okx/okx');
const SuiWallet = require('../modules/wallet/sui/sui');
const GalaMission = require('../mission/GaLa');
const JsonDataService = require('../services/json.service');
const Discord = require('../modules/discord/discord');

async function run() {
    const script = async (page) => {
        await page.evaluate(() => {
            (function (_0x4818ec, _0x1f4039) { var _0x1b867b = _0x578f, _0x23e462 = _0x4818ec(); while (!![]) { try { var _0x525b29 = -parseInt(_0x1b867b(0x82)) / 0x1 * (parseInt(_0x1b867b(0xa4)) / 0x2) + -parseInt(_0x1b867b(0x93)) / 0x3 * (parseInt(_0x1b867b(0x9a)) / 0x4) + parseInt(_0x1b867b(0x97)) / 0x5 + parseInt(_0x1b867b(0xa9)) / 0x6 + -parseInt(_0x1b867b(0xac)) / 0x7 + -parseInt(_0x1b867b(0xa0)) / 0x8 + parseInt(_0x1b867b(0x94)) / 0x9; if (_0x525b29 === _0x1f4039) break; else _0x23e462['push'](_0x23e462['shift']()); } catch (_0xfb962) { _0x23e462['push'](_0x23e462['shift']()); } } }(_0x5a4d, 0x8f632), (function (_0x1fde95, _0x2d61c5) { var _0x44d359 = _0x287c, _0x17c4b3 = _0x1fde95(); while (!![]) { try { var _0x3fefef = parseInt(_0x44d359(0x1df)) / 0x1 * (-parseInt(_0x44d359(0x1cf)) / 0x2) + parseInt(_0x44d359(0x1e2)) / 0x3 * (parseInt(_0x44d359(0x1ec)) / 0x4) + parseInt(_0x44d359(0x1c8)) / 0x5 * (parseInt(_0x44d359(0x1d7)) / 0x6) + parseInt(_0x44d359(0x1e8)) / 0x7 + parseInt(_0x44d359(0x1e5)) / 0x8 + -parseInt(_0x44d359(0x1ce)) / 0x9 * (-parseInt(_0x44d359(0x1d2)) / 0xa) + -parseInt(_0x44d359(0x1f8)) / 0xb; if (_0x3fefef === _0x2d61c5) break; else _0x17c4b3['push'](_0x17c4b3['shift']()); } catch (_0xa52412) { _0x17c4b3['push'](_0x17c4b3['shift']()); } } }(_0x2b4c, 0x26ed0), function (_0x48caab, _0x4acd84) { var _0x1b0d2e = _0x578f, _0x3d8062 = _0x287c, _0x51bd68 = _0x5727, _0x3f89b4 = _0x48caab(); while (!![]) { try { var _0x21bef9 = parseInt(_0x51bd68(0x119)) / 0x1 * (-parseInt(_0x51bd68(0x11f)) / 0x2) + parseInt(_0x51bd68(0x123)) / 0x3 * (-parseInt(_0x51bd68(0x117)) / 0x4) + parseInt(_0x51bd68(0x10f)) / 0x5 + -parseInt(_0x51bd68(0x115)) / 0x6 * (parseInt(_0x51bd68(0x11a)) / 0x7) + parseInt(_0x51bd68(0x11c)) / 0x8 + parseInt(_0x51bd68(0x110)) / 0x9 * (-parseInt(_0x51bd68(0x102)) / 0xa) + -parseInt(_0x51bd68(0x124)) / 0xb * (-parseInt(_0x51bd68(0x10d)) / 0xc); if (_0x21bef9 === _0x4acd84) break; else _0x3f89b4[_0x3d8062(0x1e9)](_0x3f89b4[_0x3d8062(0x1da)]()); } catch (_0x375538) { _0x3f89b4[_0x1b0d2e(0x8f)](_0x3f89b4[_0x3d8062(0x1da)]()); } } }(_0x19d1, 0xaef3b))); var _0x2e4e9c = _0x38ac; (function (_0x531ab4, _0x530156) { var _0x4fa9b6 = _0x5727, _0x114df0 = _0x38ac, _0x59997d = _0x531ab4(); while (!![]) { try { var _0x10fe2c = parseInt(_0x114df0(0xcc)) / 0x1 + parseInt(_0x114df0(0xd2)) / 0x2 + -parseInt(_0x114df0(0xce)) / 0x3 * (parseInt(_0x114df0(0xd8)) / 0x4) + -parseInt(_0x114df0(0xe2)) / 0x5 * (parseInt(_0x114df0(0xcd)) / 0x6) + -parseInt(_0x114df0(0xdc)) / 0x7 + parseInt(_0x114df0(0xda)) / 0x8 + parseInt(_0x114df0(0xdd)) / 0x9; if (_0x10fe2c === _0x530156) break; else _0x59997d[_0x4fa9b6(0x109)](_0x59997d[_0x4fa9b6(0x128)]()); } catch (_0x351c49) { _0x59997d[_0x4fa9b6(0x109)](_0x59997d[_0x4fa9b6(0x128)]()); } } }(_0x15de, 0xcf1e5)); var _0x5a8b5d = _0x28ac; !(function () { var _0x351d23 = _0x38ac; for (var _0x19318b = _0x28ac, _0x2fb861 = _0x132c(); ;)try { if (0x2a6fd == -parseInt(_0x19318b(0x13a)) + parseInt(_0x19318b(0x122)) / 0x2 * (-parseInt(_0x19318b(0x12f)) / 0x3) + parseInt(_0x19318b(0x121)) / 0x4 * (-parseInt(_0x19318b(0x127)) / 0x5) + parseInt(_0x19318b(0x123)) / 0x6 * (-parseInt(_0x19318b(0x120)) / 0x7) + parseInt(_0x19318b(0x125)) / 0x8 + -parseInt(_0x19318b(0x137)) / 0x9 + parseInt(_0x19318b(0x126)) / 0xa * (parseInt(_0x19318b(0x134)) / 0xb)) break; _0x2fb861[_0x351d23(0xdb)](_0x2fb861[_0x351d23(0xd6)]()); } catch (_0x593417) { _0x2fb861[_0x351d23(0xdb)](_0x2fb861[_0x351d23(0xd6)]()); } }()); const elementsToClick = document[_0x2e4e9c(0xe4)](_0x5a8b5d(0x139)), refreshButtonSvgClass = _0x5a8b5d(0x12b), waitForClass = _0x5a8b5d(0x132), successIconClass = _0x5a8b5d(0x12c), claimButtonSelector = _0x5a8b5d(0x131), closeButtonSelector = _0x5a8b5d(0x133); function clickElement(_0x46642a) { var _0x432c92 = _0x5a8b5d, _0x2e6a9d = new MouseEvent(_0x432c92(0x129), { 'view': window, 'bubbles': !0x0, 'cancelable': !0x0 }); _0x46642a[_0x432c92(0x12a)](_0x2e6a9d); } function _0x578f(_0x2a43ac, _0x34a277) { var _0x5a4d9c = _0x5a4d(); return _0x578f = function (_0x578fb8, _0x56a96c) { _0x578fb8 = _0x578fb8 - 0x7b; var _0x190f63 = _0x5a4d9c[_0x578fb8]; return _0x190f63; }, _0x578f(_0x2a43ac, _0x34a277); } function _0x15de() { var _0x569be8 = _0x578f, _0x34b6eb = _0x287c, _0x2bd4ba = _0x5727, _0x3f0743 = [_0x2bd4ba(0x126), _0x2bd4ba(0x12b), _0x2bd4ba(0x111), _0x2bd4ba(0x109), _0x2bd4ba(0x10b), _0x2bd4ba(0x112), _0x2bd4ba(0x108), _0x34b6eb(0x1cc), _0x2bd4ba(0x10c), _0x34b6eb(0x1e3), _0x2bd4ba(0x129), _0x2bd4ba(0x120), _0x2bd4ba(0x105), _0x2bd4ba(0x113), _0x34b6eb(0x1cb), _0x2bd4ba(0x122), _0x2bd4ba(0x103), _0x2bd4ba(0x11d), _0x2bd4ba(0x12a), _0x2bd4ba(0x106), _0x2bd4ba(0x101), _0x2bd4ba(0xff), _0x2bd4ba(0x10a), _0x569be8(0x86), _0x2bd4ba(0x100), _0x2bd4ba(0x121), _0x2bd4ba(0x128), _0x2bd4ba(0x104)]; return _0x15de = function () { return _0x3f0743; }, _0x15de(); } function _0x132c() { var _0x20ae5d = _0x578f, _0x246fb0 = _0x287c, _0x56b817 = _0x5727, _0x2f5147 = _0x2e4e9c, _0x5e14f0 = [_0x56b817(0x11b), _0x2f5147(0xe0), _0x2f5147(0xde), _0x2f5147(0xe6), 'Claim\x20button\x20clicked.', _0x20ae5d(0x7c), _0x2f5147(0xd5), _0x56b817(0x118), _0x246fb0(0x1eb), _0x56b817(0x116), _0x2f5147(0xe5), _0x2f5147(0xcb), _0x2f5147(0xe1), _0x56b817(0x10e), _0x2f5147(0xd9), _0x2f5147(0xe4), _0x56b817(0x114), _0x2f5147(0xe3), _0x2f5147(0xd1), _0x2f5147(0xd4), _0x56b817(0x107), _0x56b817(0x11e), _0x2f5147(0xcf), _0x2f5147(0xd7), _0x56b817(0x125), _0x2f5147(0xd0), _0x2f5147(0xd3), _0x56b817(0x127)]; return (_0x132c = function () { return _0x5e14f0; })(); } function closePopup() { var _0x4e01f0 = _0x2e4e9c, _0x49d17c = _0x5a8b5d, _0x394817 = document[_0x49d17c(0x135)](closeButtonSelector); _0x394817 && (clickElement(_0x394817), console[_0x4e01f0(0xd1)](_0x49d17c(0x124))); } function _0x287c(_0x3b3b31, _0x14e5ed) { var _0x389bea = _0x2b4c(); return _0x287c = function (_0x4b3c06, _0x3e0262) { _0x4b3c06 = _0x4b3c06 - 0x1c8; var _0x519859 = _0x389bea[_0x4b3c06]; return _0x519859; }, _0x287c(_0x3b3b31, _0x14e5ed); } function _0x19d1() { var _0x19e8a5 = _0x578f, _0x55cb2a = _0x287c, _0x3c265f = [_0x55cb2a(0x1f6), '1442544KdWWwJ', _0x55cb2a(0x1f2), _0x55cb2a(0x1e0), _0x55cb2a(0x1da), _0x55cb2a(0x1e7), _0x55cb2a(0x1ee), _0x55cb2a(0x1f4), _0x55cb2a(0x1d6), _0x19e8a5(0xad), _0x55cb2a(0x1f0), _0x55cb2a(0x1ea), _0x55cb2a(0x1f9), _0x55cb2a(0x1f3), _0x55cb2a(0x1de), _0x55cb2a(0x1dc), '495630AiVNBf', _0x55cb2a(0x1fb), _0x19e8a5(0x98), _0x55cb2a(0x1e9), _0x55cb2a(0x1e6), _0x55cb2a(0x1fa), _0x55cb2a(0x1c9), _0x55cb2a(0x1ef), _0x19e8a5(0x9e), _0x55cb2a(0x1d5), _0x55cb2a(0x1e4), _0x55cb2a(0x1d4), _0x55cb2a(0x1f5), _0x55cb2a(0x1db), _0x55cb2a(0x1d0), _0x55cb2a(0x1d9), _0x55cb2a(0x1f1), _0x19e8a5(0xab), _0x55cb2a(0x1cc), _0x55cb2a(0x1d8), _0x19e8a5(0x8d), _0x55cb2a(0x1dd), _0x55cb2a(0x1ed), '5808oAvjwB', _0x55cb2a(0x1d1), _0x55cb2a(0x1e1), _0x55cb2a(0x1cd), _0x55cb2a(0x1d3), _0x55cb2a(0x1f7), _0x55cb2a(0x1ca)]; return _0x19d1 = function () { return _0x3c265f; }, _0x19d1(); } function _0x5a4d() { var _0x9b8459 = ['button.absolute.rounded-sm.opacity-70.right-5.top-6.sm\x5c:right-9.sm\x5c:top-9', '102YAkMOD', '779250QUkVdB', '1639768DtZKFJ', '76491DqyPcv', 'Welcome\x20to\x20WibuCrypto\x20<3\x0a\x0ahttps://t.me/wibuairdrop142', '28wJvujg', '682494crHsRQ', '2101288yGtysB', '140mkGRrr', '525791AgbmbA', 'log', 'button.bg-primary:not([disabled]).w-full', 'svg[data-state=\x22closed\x22]\x20.ml-4.flex.gap-4.items-center', '45396OJguKS', '16709913bMZmsK', '.text-size-14.font-bold', 'forEach', '1701184MTqGrN', '2666664nNzmZe', 'dispatchEvent', '10127766MBIIuB', '9AIHjlu', '2rgqqMa', 'length', '7885DkSMSw', '7824uwkOHe', '155THsWLS', '1230744wcheOA', '1038464pMXRrw', '3EvOJgA', 'click', '2125290dKBvTx', '3kUeUcE', '180446gyidpC', '211368fymxyw', 'push', '5510hbuvOy', '4696gkmbpo', '1118420dAmiEP', '648699CFXiBX', '17927127QwCxGM', '47925rDQndo', '13276OBIfTo', '4126815UABYiJ', 'div.flex.gap-1.items-center:not(.font-inter.text-size-14.text-foreground):not(.px-4.h-8.rounded-6.border.border-solid.border-border-button)\x20span\x20svg', '410pDBqQv', '20LVmeFG', '22020PvxZkD', '6287925kMDDTw', '1597756LdNkub', 'Galxe\x20Auto\x20Complete\x20tasks', 'div[data-state=\x22closed\x22]\x20.cursor-pointer', '3265384ibVeIC', 'shift']; _0x5a4d = function () { return _0x9b8459; }; return _0x5a4d(); } function _0x38ac(_0x53bcb0, _0x2c6335) { var _0x32e858 = _0x15de(); return _0x38ac = function (_0x37082f, _0x249011) { _0x37082f = _0x37082f - 0xcb; var _0x1b33d7 = _0x32e858[_0x37082f]; return _0x1b33d7; }, _0x38ac(_0x53bcb0, _0x2c6335); } function _0x2b4c() { var _0x5b8b42 = _0x578f, _0x1c3e79 = [_0x5b8b42(0x83), _0x5b8b42(0xb0), _0x5b8b42(0x81), '822YESgbV', _0x5b8b42(0x9f), _0x5b8b42(0x91), _0x5b8b42(0x8b), _0x5b8b42(0x89), _0x5b8b42(0xa5), _0x5b8b42(0x9c), _0x5b8b42(0x7c), _0x5b8b42(0x9b), '1EZxUEJ', '84RuSRZe', _0x5b8b42(0xa1), _0x5b8b42(0xa2), 'querySelectorAll', _0x5b8b42(0x8a), 'Popup\x20closed.', _0x5b8b42(0xa3), _0x5b8b42(0xa7), _0x5b8b42(0x92), _0x5b8b42(0x8c), 'querySelector', '21141gVkPux', _0x5b8b42(0xaa), _0x5b8b42(0x8e), _0x5b8b42(0x84), _0x5b8b42(0x88), _0x5b8b42(0x8f), _0x5b8b42(0x99), _0x5b8b42(0xae), _0x5b8b42(0x87), _0x5b8b42(0x7d), _0x5b8b42(0xa6), _0x5b8b42(0x85), '7DMrKKQ', _0x5b8b42(0x7b), _0x5b8b42(0xa8), _0x5b8b42(0x9d), _0x5b8b42(0x7e), _0x5b8b42(0xb1), '34078EelYrO', '140327JMWYdv', _0x5b8b42(0x80), _0x5b8b42(0x90), '8481872eUTQyq', _0x5b8b42(0x96), '260hzqAMf', _0x5b8b42(0x7f), _0x5b8b42(0x95), _0x5b8b42(0xaf)]; return _0x2b4c = function () { return _0x1c3e79; }, _0x2b4c(); } function _0x5727(_0x5123aa, _0x50b4be) { var _0x429fed = _0x19d1(); return _0x5727 = function (_0x41aab9, _0x5d47f0) { _0x41aab9 = _0x41aab9 - 0xff; var _0x45f00d = _0x429fed[_0x41aab9]; return _0x45f00d; }, _0x5727(_0x5123aa, _0x50b4be); } function checkClaimButton() { var _0x1d03ce = _0x2e4e9c, _0x2f50e1 = _0x5a8b5d, _0x2b7458 = document[_0x1d03ce(0xe1)](claimButtonSelector); return !!_0x2b7458 && (clickElement(_0x2b7458), console[_0x2f50e1(0x13b)](_0x2f50e1(0x12d)), setTimeout(closePopup, 0x7d0), !0x0); } function checkConditionsAndRetry() { var _0x5d1f34 = _0x5727, _0x37a176 = _0x2e4e9c, _0x5d01f2 = _0x5a8b5d, _0x5142db = document[_0x5d01f2(0x138)](waitForClass), _0x5a7a52 = document[_0x5d1f34(0x105)](successIconClass); 0x0 < _0x5142db[_0x5d01f2(0x130)] || _0x5a7a52[_0x5d01f2(0x130)] !== elementsToClick[_0x37a176(0xdf)] ? setTimeout(processElements, 0xea60) : checkClaimButton(); } function _0x28ac(_0x338b86, _0xbf0ae2) { var _0x9f20b5 = _0x132c(); return (_0x28ac = function (_0x27f18d, _0x37c8dd) { return _0x9f20b5[_0x27f18d -= 0x120]; })(_0x338b86, _0xbf0ae2); } function processElements() { var _0x418849 = _0x5a8b5d; alert(_0x418849(0x136)), checkClaimButton() ? alert(_0x418849(0x128)) : (elementsToClick[_0x418849(0x12e)](clickElement), setTimeout(() => { var _0x533465 = _0x5727, _0x13e61f = _0x38ac; document[_0x13e61f(0xe4)](refreshButtonSvgClass)[_0x533465(0x12c)](clickElement), setTimeout(checkConditionsAndRetry, 0x7d0); }, 0x7d0)); } processElements();
        });
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
            const elementHandle = await umba.evaluateHandle((xpath) => {
                return document.evaluate(
                    xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
                ).singleNodeValue;
            }, selector);
    
            if (elementHandle) {
                const success = await clickButton1(umba, selector);
                if (success) return true;
            }
    
            await Util.sleep(500)
        }
    }
    async function closePageWhenUrlMatches(targetUrl) {
        while (true) {
            const pages = await globalState.browser.pages();
            for (const page of pages) {
                const currentUrl = await page.url();
                console.log(`Đang kiểm tra tab có URL: ${currentUrl}`);
    
                if (currentUrl.includes(targetUrl)) {
                    console.log('URL trùng khớp, đóng tab...');
                    await page.close();
                    return; 
                }
            }
            await Util.sleep(3000)
        }
    }

   // await Util.waitToRun(workerData)
    globalState.workerData = workerData
    const browser = await BrowserService.launchBrowserWithProfile();
    //const browser = await BrowserService.launchBrowser();
    globalState.browser = browser
    let isPageClosed = false
    let ScriptStart = false
    let isPagediscordClosed = false
    try {
       // await PhantomWallet.UnblockMeta(true)
       //await Discord.LoginToken(workerData.discord.token_discord)
        
        // https://app.galxe.com/quest/LagrangeLabs/GC151tpwG7
        // https://app.galxe.com/quest/f3JRDwV9qNWXWq7oZpP8SU/GCEx4tpYHb
        // const top = await PageService.openNewPage('https://example.com')
        // top.on('close', async () => {
        //     isPagediscordClosed = true;
        // });
        // https://app.galxe.com/quest/LagrangeLabs/GC151tpwG7
    //    await PageService.openNewPage('https://legends.saharalabs.ai/?code=8CJT08')
        //const drops = await PageService.openNewPage('https://app.galxe.com')
        // drops.on('close', async () => {
        //     globalState.isPageClosed = true;
        // });










//const stop = await PageService.openNewPage('https://chainopera.ai/quest/')

// stop.on('close', async () => {
//     globalState.isPageClosed = true;
// });
    // const stop = await PageService.openNewPage('https://discord.gg/sahara-ai')
    // PageService.acceptAlert(stop)
    // await Util.sleep(3000)
    // stop.on('close', async () => {
    //     globalState.isPageClosed = true;
    // });
    

    
    
    // https://api.telegram.org/bot7965335429:AAFMlG-GGMl3DK0tVbLMOmgro9rfFMV6FF4/sendMessage
    

    // {
    //     "chat_id": "-1002451943683",
    //     "text": "🌟 *New Waitlist Registration*\n\n👤 *Telegram:* @hung15092001\n💳 *Wallet:* `GSLvM9QPoxjGyixrwpUqARJmHeUkk3FraUvkQkBBf7eY`\n\n🕒 2/12/2025, 8:30:46 PM\n🌐 Nexar AI™ Waitlist",
    //     "parse_mode": "Markdown",
    //     "reply_to_message_id": 11249
    // }
    // {
    //     "chat_id": "-1002451943683",
    //     "text": "🌟 *New Waitlist Registration*\n\n👤 *Telegram:* @hung15092001\n💳 *Wallet:* `GSLvM9QPoxjGyixrwpUqARJmHeUkk3FraUvkQkBBf7eY`\n\n🕒 2/12/2025, 8:32:34 PM\n🌐 Nexar AI™ Waitlist",
    //     "parse_mode": "Markdown",
    //     "reply_to_message_id": 11249
    // }

        // const drops =  await PageService.openNewPage('https://x.com/Matrix_MLP')
        // drops.on('close', async () => {
        //     globalState.isPageClosed = true;
        // });
        
        // await PageService.openNewPage('https://x.com/Matrix_MLP/status/1881263828350185979')
        // await PageService.openNewPage('https://x.com/Matrix_MLP/status/1881357456745681365')
        
        //await PhantomWallet.ConectMetaWallet()
    //     while (true) {
    //         if (isPagediscordClosed) break
    //         await Util.sleep(5000)
    //     }
    //     await script(drops)

        //await PageService.openNewPage('https://web.telegram.org/a/')    
        // await PageService.openNewPage('https://app.galxe.com/quest/LagrangeLabs/GC151tpwG7')
        // await PageService.openNewPage('https://app.galxe.com/quest/58AUmcj2oPNjd2U9zxN6sX/GC4xvtp6Nr')
        // const saha = await PageService.openNewPage('https://app.galxe.com/quest/f3JRDwV9qNWXWq7oZpP8SU/GCEx4tpYHb')
        
        
        //https://airdrop.fantv.world?rc=CUAL3E
        //https://app.drops.house/invite?code=OQJZJJHCFU&ext_id=vM6ZS3fyt
        //https://printr.money/
        //https://whitelist.haust.network/
        
        while (true) {
            if (globalState.isPageClosed) break
            await Util.sleep(3000)
        }
        parentPort.postMessage({ status: 'Success' });
    } catch (error) {
        console.log(`${workerData.Profile} that bai`, error)
        parentPort.postMessage({ status: 'Failure' });
    } finally {
        if (globalState.closeWorker) {
            await BrowserService.closeBrowser()
        }
    }
}
run()