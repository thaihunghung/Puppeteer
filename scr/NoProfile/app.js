const fs = require('fs');
const path = require('path');
const { Worker, isMainThread } = require('worker_threads');
const JsonDataService = require('../services/json.service');
const globalState = require('../config/globalState');
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
    const maxThreads = parseInt(process.env.MAX_THREADS, 10) || 5;
    
    let activeWorkers = 0; 
    let currentIndex = 0; 
    const results = []; 
    
    async function processNextWorker() {
        if (currentIndex >= 5) return; 

        const workerData = { proxy: `proxy${currentIndex + 1}`, noti: temp }; 
        
        currentIndex++;
        activeWorkers++;
        try {
            const result = await createWorker(workerData);
            results.push(result); 
        } catch (error) {
            console.error(`Lỗi trong worker ${workerData.proxy}:`, error);
            results.push({ error: error.message }); 
        } finally {
            activeWorkers--;
            processNextWorker();  // Gọi tiếp để xử lý công việc tiếp theo
        }
    }

    // Khởi tạo số worker ban đầu
    const initialWorkers = Math.min(maxThreads, 10); // 10 là ví dụ
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
