const globalState = require("../../config/globalState");
const JsonDataService = require("../../services/json.service");
const PageService = require("../../services/page.service");

class UtilTwitter {
    static async UpdateCookies(page) {
        const cookies = await PageService.getCookiesByOrder(page, ['auth_token', 'twid'])
        //console.log('cookies',cookies)
        if (cookies[0]) {
            const updatedFields = {
                twitter: {
                    cookies: cookies
                }
            };
            await JsonDataService.updateJsonFields(globalState.workerData.profile, updatedFields);
            return cookies
        } else { 
            console.log('Không có cookies hợp lệ để cập nhật.');
            return []
        } 
    }
}

module.exports = UtilTwitter
