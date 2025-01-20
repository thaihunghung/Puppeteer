const fs = require('fs');
const proxy_check = require('proxy-check');

async function checkProxy(proxy) {
    const [auth, hostPort] = proxy.split('@');
    const [username, password] = auth.split(':');
    const [host, port] = hostPort.split(':');

    try {
        const result = await proxy_check({
            testHost: 'www.google.com', // Website dùng để kiểm tra
            proxyIP: host,
            proxyPort: parseInt(port),
            auth: {
                username,
                password,
            },
        });
        console.log(`✅ Proxy hoạt động: ${proxy}`);
        console.log(result);
    } catch (error) {
        console.log(`❌ Proxy không hoạt động: ${proxy}`);
    }
}

function checkProxiesFromFile(filePath) {
    fs.readFile(filePath, 'utf-8', async (err, data) => {
        if (err) {
            console.error('Lỗi khi đọc file:', err.message);
            return;
        }

        const proxies = data.split('\n').filter(line => line.trim() !== '');
        console.log(`📄 Đang kiểm tra ${proxies.length} proxy...`);
        
        for (const proxy of proxies) {
            await checkProxy(proxy.trim());
        }
    });
}

// Đường dẫn tới file proxy
const filePath = './proxy-list.txt'; // Đảm bảo file này nằm trong cùng thư mục
checkProxiesFromFile(filePath);
