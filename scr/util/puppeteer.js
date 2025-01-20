const puppeteer = require('puppeteer');
const proxyChain = require('proxy-chain');

(async () => {
  // Proxy ban đầu (username:password@proxyHost:port)
  const proxy = 'http://fnfbonxl:3u02c3h2w0n8@45.67.2.245:5819';

  // Tạo proxy ẩn danh :
  const newProxyUrl = await proxyChain.anonymizeProxy(proxy);

  // Khởi chạy Puppeteer với proxy
  const browser = await puppeteer.launch({
    headless: false,
    args: [`--proxy-server=${newProxyUrl}`], // Sử dụng proxy
    defaultViewport: null,
  });

  // Mở một tab mới và kiểm tra IP
  const page = await browser.newPage();
  await page.goto('https://whatismyipaddress.com/');

  console.log('Đang kiểm tra IP thông qua proxy...');

  // Đóng proxy ẩn danh sau khi sử dụng
  await proxyChain.closeAnonymizedProxy(newProxyUrl);


})();
