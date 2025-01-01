const axios = require('axios');
const http = require('http');
const https = require('https');

class AxiosCustomInstance {
  static instance;

  static getInstance() {
    if (!AxiosCustomInstance.instance) {
      const httpAgent = new http.Agent({
        keepAlive: true,
        timeout: 30000,  // Timeout cho các request HTTP (30 giây)
        scheduling: 'fifo',
      });

      const httpsAgent = new https.Agent({
        keepAlive: true,
        timeout: 30000,  // Timeout cho các request HTTPS (30 giây)
        scheduling: 'fifo',
      });

      AxiosCustomInstance.instance = axios.create({
        httpAgent,
        httpsAgent,
        timeout: 30000, // Timeout cho tất cả các request
      });
    }

    return AxiosCustomInstance.instance;
  }
}

module.exports = AxiosCustomInstance;
