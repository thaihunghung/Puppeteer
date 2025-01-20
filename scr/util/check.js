const axios = require('axios');

const proxies = [
  'acyQRi:Date-06-01@45.3.42.154:9090',
  'acyQRi:Date-06-01@45.3.40.84:9090',
  'acyQRi:Date-06-01@45.3.41.183:9090',
  'acyQRi:Date-06-01@45.3.40.236:9090',
  'aTIE58:Date-07-01@45.3.53.106:9090',
  'aTIE58:Date-07-01@45.3.59.22:9090',
  'aTIE58:Date-07-01@45.3.58.235:9090',
  'aTIE58:Date-07-01@45.3.58.134:9090',
  'aTIE58:Date-07-01@45.3.55.167:9090',
  'aTIE58:Date-07-01@45.3.56.150:9090',
];


async function checkProxySpeed(proxy) {
  const [userPass, hostPort] = proxy.split('@');
  const [user, pass] = userPass.split(':');
  const [host, port] = hostPort.split(':');

  const proxyUrl = `http://${user}:${pass}@${host}:${port}`;
  
  const start = Date.now();
  try {
    await axios.get('http://example.com', {
      proxy: {
        host,
        port: parseInt(port, 10),
        auth: { username: user, password: pass },
      },
      timeout: 5000, // Thời gian chờ 5 giây
    });
    const latency = Date.now() - start;
    console.log(`${proxy} - Speed: ${latency} ms`);
    return { proxy, latency };
  } catch (error) {
    console.error(`${proxy} - Error: ${error.message}`);
    return { proxy, latency: null };
  }
}

async function checkAllProxies() {
  const results = await Promise.all(proxies.map(checkProxySpeed));
  console.log('\nSummary:');
  results.forEach(result => {
    if (result.latency !== null) {
      console.log(`${result.proxy} - Speed: ${result.latency} ms`);
    } else {
      console.log(`${result.proxy} - Unreachable`);
    }
  });
}

checkAllProxies();
