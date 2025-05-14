# Hướng dẫn thiết lập dự án Puppeteer

## Bước 1: Tạo thư mục chứa dự án

Tạo một thư mục bất kỳ (giả sử tên là `my-projects`) để chứa các dự án:

```bash
mkdir my-projects
cd my-projects
```
## Bước 2: Clone repository đầu tiên (Puppeteer)
```bash
git clone https://github.com/thaihunghung/Puppeteer.git
```
## Bước 3: Clone repository thứ hai (profile) vào thư mục profile
```bash
git clone https://github.com/thaihunghung/profile.git
```
## Bước 4: Cài đặt dependencies cho Puppeteer
```bash
cd Puppeteer
npm i
```
## Bước 5: Thay đổi thông số cấu hình trong BrowserService
### BrowserService.browser = await puppeteer.launch({...});
```bash
const path = require('path');

BrowserService.browser = await puppeteer.launch({
  devtools: false, // Tắt DevTools khi khởi chạy
  headless: true, // Chạy ở chế độ không giao diện
  executablePath: null, // Dùng Chromium mặc định do Puppeteer tải
  ignoreDefaultArgs: ["--disable-extensions", "--enable-automation"],
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.91 Safari/537.36',
    // Uncomment dòng dưới nếu bạn dùng extension MetaMask:
    // `--load-extension=${path.join(__dirname, 'extensions/MetaMask/nkbihfbeogaeaoehlefnkodbefgpgknn')}`
  ].filter(Boolean),
  defaultViewport: null,
});
```
