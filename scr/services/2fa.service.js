const axios = require('axios');
const https = require('https');

class TwoFactorService {
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
}

module.exports = TwoFactorService;
