const { Twitter, Hotmail } = require("../config/import.social.media");

async function MissionPortal() {
    try {     
       // await Twitter.loginAndCheckCookie(false)
        await Hotmail.CreateHotMail()
    } catch (error) {
        console.log(` that bai`, error)
    } 
}

module.exports = MissionPortal;