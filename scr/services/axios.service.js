const axios = require('axios');
const https = require('https');
require('dotenv').config();
const timeEnv = process.env.TIME;

class axiosService {
    static async get2faToken(keypass) {
        try {
            const agent = new https.Agent({ family: 4 });
            const url = `https://2fa.live/tok/${keypass}`;
            const response = await axios.get(url, { httpsAgent: agent });
            const currentTime = new Date().toLocaleString(); // Get the current time in local format
            console.log(`[${currentTime}] Token: ${response.data.token}`);
            return response.data.token;
        } catch (error) {
            console.error('Lỗi lấy mã 2FA:', error.message);
            return null;
        }
    }
    static async checkTimeTransactionsportal(address) {
        const API_URL = `https://aurelia.portaltobitcoin.com/api/v2/addresses/${address}/transactions`;
        const timeAsNumber = Number(timeEnv);
        if (isNaN(timeAsNumber)) {
            console.error("Giá trị của process.env.TIME không phải là số hợp lệ");
        } else {
            //console.log("Giá trị sau khi chuyển đổi:", timeAsNumber);
        }
        try {
                const response = await axios.get(API_URL);
                const data = response.data;
        
                const currentTime = new Date();
        
                const lessThanCount = data.items.filter(item => {
                    const timestamp = new Date(item.timestamp);
                    const timeDifferenceMs = currentTime - timestamp;
                    const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60); 
                    return timeDifferenceHours < timeAsNumber;
                }).length; 
                console.log(`${address} có thời gian nhỏ hơn ${timeAsNumber} giờ: ${lessThanCount}`);
                return lessThanCount
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                return null
        }
    }
}

module.exports = axiosService;

