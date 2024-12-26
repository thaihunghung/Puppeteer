const globalState = require("../../config/globalState");
const { PageService, JsonDataService } = require("../../config/import.service");

class UtilTwitter {
    static async UpdateCookies(page) {
        const cookies = await PageService.getCookiesByOrder(page, ['auth_token', 'twid'])
        console.log(cookies)
        if (cookies.some(cookie => cookie !== null)) {
            const updatedFields = {
                twitter: {
                    cookies: cookies
                }
            };
            await JsonDataService.updateJsonFields(globalState.workerData.profile, updatedFields);
        } else {
            console.log('Không có cookies hợp lệ để cập nhật.');
        }
        return cookies
    }
}

module.exports = UtilTwitter
