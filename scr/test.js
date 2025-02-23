require("dotenv").config();
const fs = require("fs");
const { ethers } = require("ethers");
const axios = require("axios");

const PRIVATE_KEY_FILE = "E:\\puppeteer-auto-meta-proxy\\scr\\python\\wallet\\private_keys2.txt";

// Hàm sleep để chờ giữa các request (tránh bị block)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Đọc file danh sách Private Key
async function readFileLines(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data.replace(/\r/g, "").trim().split("\n"));
    });
  });
}

// Xử lý đăng nhập không có proxy
async function runWithoutProxy(i, privateKey) {
  let walletAddress = "Unknown";
  let attempts = 0; // Đếm số lần thử lại
  
  while (attempts < 15) {  // Giới hạn số lần thử lại (ví dụ: thử tối đa 5 lần)
    try {
      const provider = new ethers.JsonRpcProvider("https://odyssey.storyrpc.io");
      const wallet = new ethers.Wallet(privateKey, provider);
      walletAddress = wallet.address; // Lưu địa chỉ ví

      // Gửi request lấy challenge
      const challengeResponse = await axios.post(
        "https://cults-apis-1181.ippcoin.com/auth/challenge",
        { wallet_address: walletAddress },
        { timeout: 30000 }
      );

      const challenge = challengeResponse.data.data.challenge;

      // Ký challenge
      const signature = await wallet.signMessage(challenge);

      // Gửi yêu cầu đăng nhập
      await axios.post(
        "https://cults-apis-1181.ippcoin.com/auth/login",
        {
          wallet_address: walletAddress,
          challenge: challenge,
          response: signature,
          referral_code: "d71imaebveko",
        },
        { timeout: 30000 }
      );

      console.log(`✅ Wallet ${i + 1}: Đăng nhập thành công!`);
      return; // Nếu thành công, thoát khỏi vòng lặp

    } catch (error) {
      if (error.response?.status === 429) {
        // console.log(`❌ Wallet ${i + 1}: Lỗi 429 - Quá nhiều yêu cầu. Thử lại sau 60 giây...`);
        attempts++;
        await sleep(1000); // Chờ 60 giây rồi thử lại
      } else {
        console.error(`❌ Wallet ${i + 1}: Lỗi với việc đăng nhập`);
        console.error("Chi tiết lỗi:", error.response?.data || error.message);
        return; // Nếu gặp lỗi khác, thoát khỏi vòng lặp
      }
    }
  }

  console.log(`❌ Wallet ${i + 1}: Đã thử 5 lần nhưng vẫn gặp lỗi 429. Dừng lại.`);
}


// Hàm chính
async function main() {
  try {
    const privateKeys = await readFileLines(PRIVATE_KEY_FILE);
    const batchSize = 2; // Giảm batchSize xuống để tránh bị block

    for (let i = 0; i < privateKeys.length; i += batchSize) {
      const batch = [];

      for (let j = 0; j < batchSize && i + j < privateKeys.length; j++) {
        batch.push(runWithoutProxy(i + j, privateKeys[i + j]));
      }

      await Promise.allSettled(batch); // Chạy đồng thời batchSize request
    }
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
  }
}

main();
