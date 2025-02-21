const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AnonymizeUAPlugin = require("puppeteer-extra-plugin-anonymize-ua");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");

puppeteer.use(StealthPlugin());
puppeteer.use(AnonymizeUAPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

module.exports = {
    fs: require('fs'),
    path: require('path'),
    axios: require('axios'),
    xlsx: require('xlsx'),
    proxyChain: require("proxy-chain"),
    puppeteer, 
};
