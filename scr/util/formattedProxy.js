const fs = require('fs');

fs.readFile('listProxy.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Lỗi khi đọc file:', err);
    return;
  }

  const proxyList = data.split('\n').map(line => line.trim()).filter(line => line !== '');

  const formattedProxies = proxyList.map(proxyString => {
    const [host, port, username, password] = proxyString.split(':');
    return `http://${username}:${password}@${host}:${port}`;
  });

  fs.writeFile('formattedProxy.txt', formattedProxies.join('\n'), 'utf8', (err) => {
    if (err) {
      console.error('Lỗi khi ghi file:', err);
    } else {
      console.log('Đã ghi danh sách proxy vào file formattedProxy.txt');
    }
  });
});
