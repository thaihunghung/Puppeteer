const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { Worker, isMainThread } = require('worker_threads');
const indicesGroups = require('./config/indicesGroups');
const JsonDataService = require('./services/json.service');
const AxiosCustomInstance = require('./util/AxiosCustomInstance');
const globalState = require('./config/globalState');
const { Util } = require('./config/import.util');
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
    // 5,8,9
    indicesGroups.otherGroup = []
    const maxThreads = parseInt(process.env.MAX_THREADS, 10) || 5;
    const results = [];
    // toi group6to10
    // , indicesGroups.group21to25
    //indicesGroups.group11to15,  chạy lại
    //const groups = [indicesGroups.group6to10, indicesGroups.group1to5, indicesGroups.group16to20]; // Các nhóm cần chạy

    //const groups = [indicesGroups.group11to15, indicesGroups.group1to5, indicesGroups.group6to10, indicesGroups.group11to15, indicesGroups.group16to20]
    // 5, 11, 39
    //const groups = [indicesGroups.mainGroup, indicesGroups.group1to5, indicesGroups.group6to10, indicesGroups.group11to15, indicesGroups.group16to20] 
    //const groups = [indicesGroups.group1to5, indicesGroups.group6to10, indicesGroups.group11to15]

    // chạy portal
    indicesGroups.otherGroup = [10]
    const groups = [indicesGroups.group16to20]
    //const groups = [indicesGroups.otherGroup=[37]] 
    //const groups = [indicesGroups.otherGroup=[30, 31,32,33,34,35]]
    //const groups = [indicesGroups.otherGroup=[0]]
    // veri ref
    //  const groups = [indicesGroups.otherGroup=[0]] 

    let currentGroupIndex = 0;
    //await Util.sleep(1020000)
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

            const { profile, mnemonic, proxy, google, discord, twitter, hotmail, portal, mango, mango_mnemonic } = data_wallet[currentIndex];
            const workerData = { i: currentIndex, profile, mnemonic, proxy, google, discord, twitter, indicesToRun, hotmail, portal, mango, mango_mnemonic };

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
        if (globalState.closeWorker) {
            const { exec } = require('child_process');
            exec('E:\\puppeteer-auto-meta-proxy\\scr\\util\\close_chrome.bat', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Lỗi khi chạy close_chrome.bat: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`Stderr khi chạy close_chrome.bat: ${stderr}`);
                    return;
                }
                console.log(`Output từ close_chrome.bat:\n${stdout}`);

                // Chạy file cleanup_temp_folders.bat sau khi close_chrome.bat hoàn thành
                exec('E:\\puppeteer-auto-meta-proxy\\scr\\util\\cleanup_temp_folders.bat', (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Lỗi khi chạy cleanup_temp_folders.bat: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.error(`Stderr khi chạy cleanup_temp_folders.bat: ${stderr}`);
                        return;
                    }
                    console.log(`Output từ cleanup_temp_folders.bat:\n${stdout}`);
                });
            });
        }
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