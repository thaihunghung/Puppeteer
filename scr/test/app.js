const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { Worker, isMainThread } = require('worker_threads');
const indicesGroups = require('../config/indicesGroups');
const globalState = require('../config/globalState');
require('dotenv').config();

async function createWorker(workerData) {
    const worker = new Worker(path.resolve(__dirname, 'worker.js'), { workerData });

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
    const data = fs.readFileSync('secret-recovery-phrase.txt', 'utf8');
    const dataArray = data.split('\n').map((item) => item.trim()).filter((item) => item);

    const dataTwitter = fs.readFileSync('twitter.txt', 'utf8');
    const dataTwitterArray = dataTwitter.split('\n').map((item) => item.trim()).filter((item) => item);

    const proxies = [
        "27mdvanlinh:vanlinh@118.70.85.218:27434",
        "26mdvanlinh:vanlinh@118.70.85.206:27434",
        "25mdvanlinh:vanlinh@118.70.85.201:31423",
        "24mdvanlinh:vanlinh@118.70.85.200:37432",
        "23mdvanlinh:vanlinh@1.54.234.79:36254",
        "22mdvanlinh:vanlinh@1.54.234.80:36254",
        "21mdvanlinh:vanlinh@118.71.235.184:23270",
        "20mdvanlinh:vanlinh@118.70.85.172:48818",
        "19mdvanlinh:vanlinh@42.114.0.130:35270",
        "18mdvanlinh:vanlinh@118.70.85.170:31423",
        "17mdvanlinh:vanlinh@42.114.0.24:23270",
        "16mdvanlinh:vanlinh@118.70.85.156:27434",
        "15mdvanlinh:vanlinh@1.54.234.58:47822",
        "14mdvanlinh:vanlinh@1.54.234.47:31423",
        "13mdvanlinh:vanlinh@42.114.0.11:31423",
        "12mdvanlinh:vanlinh@1.54.234.41:37432",
        "11mdvanlinh:vanlinh@118.71.235.190:23283",
        "10mdvanlinh:vanlinh@118.70.85.2:23270",
        "QAH1XYt6zLf6:QEJjzKaUi65DMrs@45.3.34.127:9090",
        "QAH1XYt6zLf6:QEJjzKaUi65DMrs@45.3.35.239:9090"
    ];
    
    const items = [];

    proxies.forEach(proxy => {
        for (let i = 0; i < 5; i++) {
            items.push(proxy);
        }
    });
    
    const resultArray = items.slice(0, 100);
    
    console.log(resultArray);
    if (dataArray.length === 0) {
        console.error('Không có dữ liệu trong file data.txt.');
        return;
    }

    console.log(`Số lượng mục trong data.txt: ${dataArray.length}`);
    const maxThreads = 5;
    const results = [];

    const groups = [
        indicesGroups.group1to5,
        indicesGroups.group6to10,
        indicesGroups.group11to15,
        indicesGroups.group16to20,
        indicesGroups.group21to25,
        indicesGroups.group26to30,
        indicesGroups.group31to35,
        indicesGroups.group36to39,
        indicesGroups.group41to45,
        indicesGroups.group46to50,
        indicesGroups.group51to55,
        indicesGroups.group56to60,
        indicesGroups.group61to65,
        indicesGroups.group66to70,
        indicesGroups.group71to75,
        indicesGroups.group76to80,
        indicesGroups.group81to85,
        indicesGroups.group86to90,
        indicesGroups.group91to95,
        indicesGroups.group96to100,
    ];

    let currentGroupIndex = 0;
//8 95
    async function processGroup(indicesToRun) {
        let activeWorkers = 0;
        let currentIndex = 0;
        const groupResults = [];

        async function processNextWorker() {
            if (currentIndex >= dataArray.length) return;

            if (indicesToRun.length > 0 && !indicesToRun.includes(currentIndex)) {
                currentIndex++;
                return processNextWorker();
            }

            const mnemonic = dataArray[currentIndex];
            const Datatwitter = dataTwitterArray[currentIndex].split('|')
            const twitter = {
                user: Datatwitter[0],
                pass: Datatwitter[1],
                auth2fa: Datatwitter[2],
            }
            console.log('Processing mnemonic:', mnemonic);

            const workerData = { i: currentIndex, mnemonic, twitter };

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

        const initialWorkers = Math.min(maxThreads, dataArray.length);
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

        const allSuccess = groupResults.every((result) => result.status === 'Success');
        results.push({ group: currentGroupIndex + 1, results: groupResults });

        if (!allSuccess) {
            console.error(`Nhóm ${currentGroupIndex + 1} không thành công hoàn toàn.`);
            break;
        }

        currentGroupIndex++;
    }

    console.log('Kết quả từ tất cả các nhóm:', results);
}

if (isMainThread) {
    startWorkers()
        .then(() => console.log('Hoàn thành tất cả công việc.'))
        .catch((error) => console.error('Lỗi trong luồng chính:', error));
}
