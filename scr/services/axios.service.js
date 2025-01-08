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
        const timeAsNumber = Number(process.env.TIME);
        if (isNaN(timeAsNumber)) {
            console.error("Giá trị của process.env.TIME không phải là số hợp lệ");
            return null;
        }
    
        try {
            const response = await axios.get(API_URL);
            const data = response.data;
    
            const currentTime = new Date();
    
            const lessThanCount = data.items.filter(item => {
                // Kiểm tra điều kiện tx_types
                if (!item.tx_types || !item.tx_types.includes("contract_call")) {
                    return false;
                }
    
                const timestamp = new Date(item.timestamp);
                const timeDifferenceMs = currentTime - timestamp;
                const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);
                return timeDifferenceHours < timeAsNumber;
            }).length;
    
            console.log(`${address} có thời gian nhỏ hơn ${timeAsNumber} giờ với loại giao dịch 'contract_call': ${lessThanCount}`);
            return lessThanCount;
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            return null;
        }
    }
    
}

module.exports = axiosService;

