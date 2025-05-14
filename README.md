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
## Bước 6: Demo Tạo Hồ Sơ Profile Cho Dự Án Puppeteer
```json
[
  {
    "profile": "__Profile_1",
    "mnemonic": "example example example example example example example example example example example example",
    "private": "0xabc123...fakeprivatekey",
    "portal": {
      "ETH": "0xFakeEthAddress1234567890",
      "BTC": "tb1qfakebtcaddressxyz123456"
    },
    "mango": "0xexamplemangokey1234567890abcdef",
    "proxy": "http://username:password@123.123.123.123:8080",
    "google": {
      "gmail": "example@gmail.com"
    },
    "discord": {
      "email": "example@gmail.com",
      "token_discord": "discord_token_example",
      "pass": "your_password",
      "auth2fa": "abcd efgh ijkl mnop",
      "readmail": null
    },
    "telegram": {
      "phone": "+1 234 567 8901",
      "name": "username123"
    },
    "twitter": {
      "user": "ExampleUser123",
      "auth2fa": "2FAKEY1234567890",
      "backupcode": "backupcodeexample",
      "cookies": [
        {
          "name": "auth_token",
          "value": "exampleauthtokenvalue123456",
          "domain": ".x.com",
          "path": "/",
          "expires": 1770116037,
          "size": 50,
          "httpOnly": true,
          "secure": true,
          "session": false,
          "sameSite": "None"
        }
      ]
    },
    "hotmail": "example@hotmail.com",
    "EVM": {
      "private_key": "abc123fakeevmkey",
      "address": "0xFakeEvmAddress1234567890"
    }
  }
]
```
## Bước 7: kiểm thử
```bash
node app.js
```
