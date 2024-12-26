const fs = require('fs');
const path = require('path');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const indicesGroups = require('./config/indicesGroups');
const JsonDataService = require('./services/json.service')
const workerPromises = [];
const Util = require('./util/util')
require('dotenv').config();
async function startWorkers() {
    const jsonDataService = new JsonDataService()
    const data_wallet = jsonDataService.getJson();
    
    if (data_wallet.length === 0) {
        console.error('Không có địa chỉ nào trong file Excel.');
        return;
    }

    if (process.env.MAX_THREADS < data_wallet.length) {
        console.log('Có nhiều địa chỉ hơn số worker, sẽ xử lý tuần tự.');
    }

    indicesGroups.otherGroup = [60];
    const indicesToRun = indicesGroups.otherGroup;
    console.log('process.env.MAX_THREADS',process.env.PASS_DISCORD)
    for (let i = 0; i < data_wallet.length; i++) {
        if (indicesToRun.length > 0 && !indicesToRun.includes(i)) {
            continue;
        }
        
        const profile = data_wallet[i].profile;
        const mnemonic = data_wallet[i].mnemonic;
        const proxy = data_wallet[i].proxy
        const google = data_wallet[i].google;
        const discord = data_wallet[i].discord;
        const twitter = data_wallet[i].twitter;
        const hotmail = data_wallet[i].hotmail
        //const proxie_log = data_wallet.proxyLogs[i]
        
        const worker = new Worker(path.resolve(__dirname, 'worker', 'worker.js'), {
            workerData: { i, profile, mnemonic, proxy, google, discord, twitter, indicesToRun, hotmail }
        });

        const workerPromise = new Promise((resolve, reject) => {
            worker.on('message', (message) => resolve(message));
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Worker stopped with exit code ${code}`));
                }
            });
        });

        workerPromises.push(
            Promise.race([workerPromise])
        );

        if (workerPromises.length >= process.env.MAX_THREADS) {
            await Promise.all(workerPromises);
            workerPromises.length = 0;
        }
    }

    try {
        const results = await Promise.all(workerPromises);
        console.log('Kết quả từ tất cả worker:', results);
    } catch (error) {
        console.error('Error in worker threads:', error);
    }
}

if (isMainThread) startWorkers();
