const axios = require("axios");

const API_URL = "https://aurelia.portaltobitcoin.com/api/v2/addresses/0x3084DbafE51b63759ad5e8777DD142F716B102af/transactions";

async function countItemsLessThan6Hours() {
    try {
        const response = await axios.get(API_URL);
        const data = response.data;
        
        const currentTime = new Date();

        const lessThan6HoursCount = data.items.filter(item => {
            console.log("data", item.timestamp);
            const timestamp = new Date(item.timestamp);
            const timeDifferenceMs = currentTime - timestamp;
            const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60); 
            console.log("timeDifferenceHours", timeDifferenceHours);
            return timeDifferenceHours < 12;
        }).length;

        console.log(`Số lượng mục có thời gian nhỏ hơn 6 giờ: ${lessThan6HoursCount}`);
        return lessThan6HoursCount
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        return null
    }
}

countItemsLessThan6Hours();
