const fs = require('fs');
const path = require('path');
const { Worker, isMainThread } = require('worker_threads');
const indicesGroups = require('./config/indicesGroups');
const JsonDataService = require('./services/json.service');
const AxiosCustomInstance = require('./util/AxiosCustomInstance');
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
        console.error('Không có địa chỉ nào trong file Json.');
        return;
    }
    indicesGroups.otherGroup = []
    const maxThreads = parseInt(process.env.MAX_THREADS, 10) || 3;
    const results = [];
    // indicesGroups.group1to5, , indicesGroups.group16to20
    const groups = [indicesGroups.group26to30]; // Các nhóm cần chạy
    let currentGroupIndex = 0;

    async function processGroup(indicesToRun) {
        let activeWorkers = 0;
        let currentIndex = 0;
        const groupResults = []; 

        async function processNextWorker() {
            if (currentIndex >= data_wallet.length) return;

            if (indicesToRun.length > 0 && !indicesToRun.includes(currentIndex)) {
                currentIndex++;
                return processNextWorker();
            }

            const { profile, mnemonic, proxy, google, discord, twitter, hotmail, portal } = data_wallet[currentIndex];
            const workerData = { i: currentIndex, profile, mnemonic, proxy, google, discord, twitter, indicesToRun, hotmail, portal };

            currentIndex++;
            activeWorkers++;

            try {
                const result = await createWorker(workerData);
                groupResults.push(result); 
            } catch (error) {
                console.error(`Lỗi trong worker ${workerData.i}:`, error);
                groupResults.push({ status: 'Failure', error: error.message });
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
        return groupResults;
    }

    while (currentGroupIndex < groups.length) {
        const indicesToRun = groups[currentGroupIndex];
        console.log(`Chạy nhóm: ${currentGroupIndex + 1}`);
        const groupResults = await processGroup(indicesToRun);

        // Kiểm tra kết quả của nhóm hiện tại
        const allSuccess = groupResults.every((result) => result.status === 'Success');
        results.push({ group: currentGroupIndex + 1, results: groupResults });

        if (!allSuccess) {
            console.error(`Nhóm ${currentGroupIndex + 1} không thành công hoàn toàn.`);
            break;
        }

        currentGroupIndex++; // Chuyển sang nhóm tiếp theo
    }

    console.log('Kết quả từ tất cả các nhóm:', results);
}

if (isMainThread) {
    startWorkers()
        .then(() => console.log('Hoàn thành tất cả công việc.'))
        .catch((error) => console.error('Lỗi trong luồng chính:', error));
}


