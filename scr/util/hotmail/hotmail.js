const globalState = require("../../config/globalState");
const { PageService, JsonDataService } = require("../../config/import.service");

class UtilHotmail {
    static async generateRandomNameEmail() {
        const names = [
            "nguyen", "tran", "le", "pham", "hoang",
            "vu", "dang", "bui", "ngo", "do", "huynh", "vo",
            "kaka", "nhoc", "dongho", "thaonga", "cuongvip",
            "khokho", "gianggia", "meomeo", "chuachua", "tatdat",
            "thanhcong", "trungtin", "minhlam", "dieunhi", "hoailinh",
            "quyenru", "anhthu", "thuthao", "canhbao", "quangvinh",
            "truongan", "doanthanh", "minhchau", "ngoctrai", "quanghuy",
            "thanhha", "huuphat", "duchung", "huynhan", "khoahoc",
            "vuive", "hoanglong", "hoainam", "minhtri", "thienphuc",
            "anhngoc", "hongdao", "baoquyen", "trungkien", "duonglam"
        ]; 

        const surnames = [
            "anh", "bao", "minh", "khoa", "hai",
            "son", "tien", "nam", "quang", "phat", "long", "duong",
            "con", "tom", "susi", "gaibo", "khongbiet",
            "vohinh", "thieulam", "ancho", "dotlua", "huyhoang",
            "binhan", "baolam", "dinhquan", "trungduc", "ngocanh",
            "manhquan", "hanhphuc", "khanhhoa", "hoangminh", "vietanh",
            "phuongtrang", "nguyetanh", "hongnhung", "giaphuc", "minhhieu",
            "namphuong", "tinhyeu", "truongson", "trinhanh", "hoanghuy",
            "tuananh", "thuylinh", "hieuminh", "minhnhat", "phucloc"
        ]; 

        const firstName = names[Math.floor(Math.random() * names.length)];
        const lastName = surnames[Math.floor(Math.random() * surnames.length)];
        const randomNumber = Math.floor(Math.random() * 10000);
        return {
            mail: `${firstName}${randomNumber}${lastName}${randomNumber}@hotmail.com`,
            firstName: firstName,
            lastName: lastName
        }
    }

}

module.exports = UtilHotmail
