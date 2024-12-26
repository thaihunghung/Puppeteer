const { axios } = require("../config/module.import");

class TwoFactorService {
    static async get2faToken(keypass) {
        try {
            const url = `https://2fa.live/tok/${keypass}`;
            const response = await axios.get(url);
            return response.data.token;
        } catch (error) {
            console.error('Lỗi lấy mã 2FA:', error.message);
            return null;
        }
    }
}

module.exports = TwoFactorService;
