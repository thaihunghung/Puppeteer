const fs = require('fs');
const path = require('path');
const { Worker, isMainThread } = require('worker_threads');
const indicesGroups = require('./config/indicesGroups');
const JsonDataService = require('./services/json.service');
require('dotenv').config();

async function createWorker(workerData) {
    const worker = new Worker(path.resolve(__dirname, 'worker', 'worker.js'), {
        workerData,
    });

    return new Promise((resolve, reject) => {
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    });
}

async function startWorkers() {
    const jsonDataService = new JsonDataService();
    const data_wallet = jsonDataService.getJson();

    if (data_wallet.length === 0) {
        console.error('Không có địa chỉ nào trong file Excel.');
        return;
    }

    const maxThreads = parseInt(process.env.MAX_THREADS, 10) || 3;
    indicesGroups.otherGroup = [];
    const indicesToRun = indicesGroups.otherGroup;

    let activeWorkers = 0; // Số lượng luồng hiện tại đang chạy
    let currentIndex = 15; // Vị trí bắt đầu
    const results = []; // Kết quả từ tất cả các luồng

    async function processNextWorker() {
        if (currentIndex >= data_wallet.length) return; // Hết công việc để xử lý

        if (indicesToRun.length > 0 && !indicesToRun.includes(currentIndex)) {
            currentIndex++;
            return processNextWorker(); // Bỏ qua nếu không nằm trong indicesToRun
        }

        const { profile, mnemonic, proxy, google, discord, twitter, hotmail } = data_wallet[currentIndex];
        const workerData = { i: currentIndex, profile, mnemonic, proxy, google, discord, twitter, indicesToRun, hotmail };

        currentIndex++;
        activeWorkers++;

        try {
            const result = await createWorker(workerData);
            results.push(result); 
        } catch (error) {
            console.error(`Lỗi trong worker ${workerData.i}:`, error);
            results.push({ error: error.message }); 
        } finally {
            activeWorkers--;
            processNextWorker(); 
        }
    }

    const initialWorkers = Math.min(maxThreads, data_wallet.length - 12);
    const workerPromises = [];
    for (let i = 0; i < initialWorkers; i++) {
        workerPromises.push(processNextWorker());
    }


    await Promise.all(workerPromises);
    console.log('Kết quả từ tất cả các worker:', results);
}

if (isMainThread) {
    startWorkers()
        .then(() => console.log('Hoàn thành tất cả công việc.'))
        .catch((error) => console.error('Lỗi trong luồng chính:', error));
}

