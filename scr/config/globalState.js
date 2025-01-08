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
    showPage: true,
    MangoOpen: false,
    ProxyOpen: false,
    jsonPath:'E:/puppeteer-auto-meta-proxy/scr/data.json',
    excelPath:'E:/puppeteer-auto-meta-proxy/scr/wallet.xlsx',
    closeWorker: false,
};

module.exports = globalState;
