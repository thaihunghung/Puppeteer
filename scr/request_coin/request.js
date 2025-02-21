require("dotenv").config();
const fs = require("fs");
const https = require("https");
const { ethers } = require("ethers");
const axios = require("axios");
const { HttpsProxyAgent } = require("https-proxy-agent");

const PRIVATE_KEY_FILE = "E:\\puppeteer-auto-meta-proxy\\scr\\private_keys1.txt";
const PROXY_FILE = "E:\\puppeteer-auto-meta-proxy\\scr\\modules\\proxy\\fomat.txt";

async function readFileLines(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data.replace(/\r/g, "").trim().split("\n"));
    });
  });
}

async function runWithProxy(i, privateKey, proxyUrl) {
  let walletAddress = "Unknown";

  try {
   // console.log(`🔹 Bắt đầu xử lý địa chỉ ${i + 1} với proxy: ${proxyUrl}`);

    const agent = new HttpsProxyAgent(proxyUrl);
    const provider = new ethers.JsonRpcProvider("https://odyssey.storyrpc.io");
    const wallet = new ethers.Wallet(privateKey, provider);
    walletAddress = wallet.address; // Lưu địa chỉ ví

    //console.log(`🟢 Wallet ${i + 1}: ${walletAddress} - Đang lấy challenge...`);

    const challengeResponse = await axios.post(
      "https://cult-api-0912.ippcoin.com/auth/challenge",
      { wallet_address: walletAddress },
      { httpAgent: agent, httpsAgent: agent, timeout: 30000 }
    );

    const challenge = challengeResponse.data.data.challenge;
    //console.log(`🟢 Challenge nhận được: ${challenge}`);

    const signature = await wallet.signMessage(challenge);
    //console.log(`🟢 Chữ ký tạo thành công: ${signature}`);

    //console.log(`🟢 Đang gửi yêu cầu đăng nhập...`);
    await axios.post(
      "https://cult-api-0912.ippcoin.com/auth/login",
      {
        wallet_address: walletAddress,
        challenge: challenge,
        response: signature,
        referral_code: "d71imaebveko",
      },
      { httpAgent: agent, httpsAgent: agent, timeout: 30000 }
    );

    console.log(`✅ Địa chỉ ${i + 1}: ${walletAddress} đăng nhập thành công!`);
  } catch (error) {
    console.error(`❌ Lỗi tại địa chỉ ${i + 1}: ${walletAddress}`);
    console.error("Chi tiết lỗi:", error.message || error);
  }
}


async function main() {
  try {
    const privateKeys = await readFileLines(PRIVATE_KEY_FILE);
    const proxies = await readFileLines(PROXY_FILE);
    const batchSize = 100; // Số lượng chạy cùng lúc

    for (let i = 0; i < privateKeys.length; i += batchSize) {
      const batch = [];

      for (let j = 0; j < batchSize && i + j < privateKeys.length; j++) {
        batch.push(runWithProxy(i + j, privateKeys[i + j], proxies[(i + j) % proxies.length]));
      }

      await Promise.all(batch); // Chạy đồng thời batchSize request
    }
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
  }
}

main();
