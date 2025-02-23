require("dotenv").config();
const fs = require("fs");
const { ethers } = require("ethers");
const axios = require("axios");
const { HttpsProxyAgent } = require("https-proxy-agent");

const PRIVATE_KEY_FILE = "E:\\puppeteer-auto-meta-proxy\\scr\\python\\wallet\\part4.txt";
const PROXY_FILE = "E:\\puppeteer-auto-meta-proxy\\scr\\modules\\proxy\\fomat.txt";

// Hàm sleep để chờ giữa các request (tránh bị block)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Đọc file danh sách Private Key hoặc Proxy
async function readFileLines(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data.replace(/\r/g, "").trim().split("\n"));
    });
  });
}

// Xử lý đăng nhập với proxy
async function runWithProxy(i, privateKey, proxyUrl) {
  let walletAddress = "Unknown";
  
  try {
    const agent = new HttpsProxyAgent(proxyUrl);
    const provider = new ethers.JsonRpcProvider("https://odyssey.storyrpc.io");
    const wallet = new ethers.Wallet(privateKey, provider);
    walletAddress = wallet.address; // Lưu địa chỉ ví

   // console.log(`🔹 Wallet ${i + 1}: Đang xử lý với proxy ${proxyUrl}`);

    // Chờ random 3-7 giây để tránh bị block
    //await sleep(3000 + Math.random() * 4000);

    // Gửi request lấy challenge
    const challengeResponse = await axios.post(
      "https://cults-apis-1181.ippcoin.com/auth/challenge",
      { wallet_address: walletAddress },
      { httpAgent: agent, httpsAgent: agent, timeout: 30000 }
    );

    const challenge = challengeResponse.data.data.challenge;
    //console.log(`🟢 Wallet ${i + 1}: Challenge nhận được - ${challenge}`);

    // Ký challenge
    const signature = await wallet.signMessage(challenge);
    //console.log(`🟢 Wallet ${i + 1}: Chữ ký tạo thành công`);

    // Chờ random 3-7 giây trước khi gửi tiếp
    //await sleep(3000 + Math.random() * 4000);

    // Gửi yêu cầu đăng nhập
    await axios.post(
      "https://cults-apis-1181.ippcoin.com/auth/login",
      {
        wallet_address: walletAddress,
        challenge: challenge,
        response: signature,
        referral_code: "d71imaebveko",
      },
      { httpAgent: agent, httpsAgent: agent, timeout: 30000 }
    );

    console.log(`✅ Wallet ${i + 1}: Đăng nhập thành công!`);
  } catch (error) {
    console.error(`❌ Wallet ${i + 1}: Lỗi với Proxy ${proxyUrl}`);
    //console.error("Chi tiết lỗi:", error.response?.data || error.message);

    // if (error.response?.status === 429) {
    //   console.log("⏳ Phát hiện lỗi 429, chờ 60 giây rồi thử lại...");
    //   await sleep(30000); // Chờ 60 giây nếu gặp lỗi 429
    // }
  }
}

// Hàm chính
async function main() {
  try {
    const privateKeys = await readFileLines(PRIVATE_KEY_FILE);
    const proxies = await readFileLines(PROXY_FILE);
    const batchSize = 5; // Giảm batchSize xuống để tránh bị block

    for (let i = 0; i < privateKeys.length; i += batchSize) {
      const batch = [];

      for (let j = 0; j < batchSize && i + j < privateKeys.length; j++) {
        const proxyUrl = proxies[(i + j) % proxies.length]; // Chọn proxy theo vòng lặp
        batch.push(runWithProxy(i + j, privateKeys[i + j], proxyUrl));
      }
      await sleep(15000);
      await Promise.allSettled(batch); // Chạy đồng thời batchSize request
    }
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
  }
}

main();
