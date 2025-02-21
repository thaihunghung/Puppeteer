const { closeBrowser } = require("../services/browser.service");

const globalState = {
    workerData: null,
    browser: null,
    stopfaucet: false,
    swap: false,
    checkCountTimePartal: false,
    timeout: 10000,
    Worker: [],
    showXpath: true,
    showPage: false,
    MetaOpen: true,
    MangoOpen: true,
    ProxyOpen: false,
    jsonPath:'E:/puppeteer-auto-meta-proxy/scr/data.json',
    excelPath:'E:/puppeteer-auto-meta-proxy/scr/wallet.xlsx',
    closeWorker: true,
    isPageClosed: false,
    start: false
};

//Referrals 163 Earned 15900
module.exports = globalState;
