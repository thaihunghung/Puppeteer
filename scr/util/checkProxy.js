const fs = require('fs');
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

// Hàm kiểm tra proxy
async function checkProxyIP(proxy) {
    try {
        const proxyAgent = new HttpsProxyAgent(proxy);
        const response = await axios.get('https://api.ipify.org?format=json', {
            httpsAgent: proxyAgent,
            timeout: 5000, // Thêm timeout để tránh treo nếu proxy không phản hồi
        });
        if (response.status === 200) {
            console.log(`Proxy hợp lệ: ${proxy}, IP: ${response.data.ip}`);
            return true;
        } else {
            throw new Error(`Không thể kiểm tra IP của proxy. Status code: ${response.status}`);
        }
    } catch (error) {
        console.error(`Proxy không hợp lệ: ${proxy}. Lỗi: ${error.message}`);
        return false;
    }
}

// Hàm chính
async function main() {
    const inputFile = 'formattedProxy.txt';
    const outputFile = 'ValueCheckProxy.txt';

    // Đọc danh sách proxy từ file
    const proxies = fs.readFileSync(inputFile, 'utf-8').split('\n').filter(line => line.trim());

    const validProxies = [];

    // Kiểm tra từng proxy
    for (const proxy of proxies) {
        const isValid = await checkProxyIP(proxy);
        if (isValid) {
            validProxies.push(proxy);
        }
    }

    // Ghi các proxy hợp lệ vào file
    fs.writeFileSync(outputFile, validProxies.join('\n'), 'utf-8');
    console.log(`Hoàn thành! Các proxy hợp lệ đã được lưu vào ${outputFile}`);
}


main();
