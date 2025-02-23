const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { Worker, isMainThread } = require('worker_threads');
const indicesGroups = require('../config/indicesGroups');
const globalState = require('../config/globalState');
require('dotenv').config();
const outputFilePath = 'E:\\puppeteer-auto-meta-proxy\\scr\\modules\\proxy\\fomat.txt';
function getProxiesInRange(filePath, startIndex, endIndex) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject('Lỗi khi đọc file: ' + err);
                return;
            }

            // Loại bỏ tất cả ký tự \r để tránh lỗi format
            const proxyList = data.replace(/\r/g, '').trim().split('\n');

            // Đảm bảo index không vượt quá độ dài mảng
            if (startIndex >= proxyList.length) {
                reject('Start index vượt quá số lượng proxy');
                return;
            }

            const selectedProxies = proxyList.slice(startIndex, endIndex + 1); // Lấy từ start đến end
            resolve(selectedProxies);
        });
    });
}
async function createWorker(workerData) {
    const worker = new Worker(path.resolve(__dirname, 'worker.js'), { workerData });

    return new Promise((resolve) => {
        worker.on('message', resolve);
        worker.on('error', (err) => {
            console.error("Worker error:", err);
            resolve({ status: 'Failure', reason: err.message });
        });
        worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Worker exited with code ${code}`);
                resolve({ status: 'Failure', reason: `Exit code ${code}` });
            }
        });
    });
}


async function startWorkers() {
    const data = fs.readFileSync('E:\\puppeteer-auto-meta-proxy\\scr\\test\\address.txt', 'utf8');

    const dataArray = data.split('\n').map((item) => item.trim()).filter((item) => item);

    const datakey12 = fs.readFileSync('private_keys.txt', 'utf8');
    const dataArraykey12 = datakey12.split('\n').map((item) => item.trim()).filter((item) => item);

    const dataTwitter = fs.readFileSync('twitter.txt', 'utf8');

    const dataTwitterArray = dataTwitter.split('\n').map((item) => item.trim()).filter((item) => item);

    // const dataToken = fs.readFileSync('tokendiscord.txt', 'utf8');
    // const dataTokenArray = dataToken.split('\n').map((item) => item.trim()).filter((item) => item);

    const tokens = [
        "MTMyNzkwNTM0MTE5OTA5MzgyMQ.GxWlJE.QuP7L4VajSw-a2MVLPNZI3GTiY9-8bH860GmUA",
        "MTMyNDMwNDk3MjM1NDk0NTA3Ng.G75MSp.voMYm3x-9MT3xHnOFB7mRiFyYuR1it1gWQwMhE",
        "MTMyNDUxMzc0NTkzMzgzMjI4NQ.Gh30y6.n6jMbU7Z1yqOP3cFx5YY-rDI0fFHjIQvZ40qrU",
        "MTMyNDUyNTI1MTkyODkxNjE1Mg.G4oxcP.D7pnNdBNT0m9ZmDKJ40KHLXtXshAYglKjTWtYQ",
        "MTMyNDQyMDI0ODQwOTIxMDk3Ng.GWTelk.8vtRLqjoh-FyqhJh44obF9Sj78XFInjY0GxRho",
        "MTMxODQxMDQ4NjYyMjE5MTY0OA.G6vAny.5fLGxN6x2GxMHV2PPtmIiemOJ7_GGr8rSPDyNw",
        "MTMyNTIxNjg2NTUyNTY5NDU1MA.GIre9b.6-0NLoccV0GhR-e-Cx-YbqB3Z3q0Y5W9ZATwK4",
        "MTMyNTIxNTM3MzE0MTc0MTU3OQ.GoYl71.eDi-eg_MPLc1wbNb2l7_9g2HmArqwtS4a8umZQ",
        "MTMyNDgwOTYzNTU3MTU2NDY5Nw.GYheGq.mQyBAiB_HNymcgHvUsYpVgrzurDHAbtDwANWYE",
        "MTMyNDEwNTM4MTkyODI0MzMwNA.Gvm8QS.5tnmtAerHunZ6U0gXueUJCNxzLWIJOQZS4V0vQ",
        "MTMxODYwNzk2MzQzODU3OTc3Mw.Gh56_d._y1EBg-MTsYPNxf5nZp2BQul2alAqglqC-DncU",
        "MTMyNTIxNDcxMjEyNzk0NjgyMg.GmH65K.VzQi-muaqT1w996K50uwsaEnZmiDeW35iaWgCc",
        "MTMyNDIwMjY3MTI3OTcwNjE3Mw.GDJPpD.00dekOxok0jE904LcE0cRYAxUv3Hq1-eOo4ER8",
        "MTMyNDQ5NDAwNDMzNDc1NTk1MA.GmQ9lI.zPEc79oHxmVCit212VXri3vGQgrw7NEyrUQOrc",
        "MTMyNDE4MjQ5NzAyOTkxODgwMg.GUlph_.IlS5pAqDZz1UTcNwXt0caBvmjD-LJ9E_t56ntw"
    ];

    const proxies = await getProxiesInRange(outputFilePath, 0, 49);
    const numRepeats = 5;
    const items = [];

    for (let i = 0; i < numRepeats; i++) {
        items.push(...proxies); // Thêm nguyên danh sách proxies vào items mỗi lần lặp
    }

    //console.log('items', items);

    const token = [];
    tokens.forEach(discord => {
        for (let i = 0; i < 15; i++) {
            token.push(discord);
        }
    });

    const resultArray = items.slice(0, 250);
    const tokenArray = token.slice(0, 200);


    if (dataArray.length === 0) {
        console.error('Không có dữ liệu trong file data.txt.');
        return;
    }

    //console.log(`Số lượng mục trong data.txt: ${250}`);
    console.log(`Số lượng mục trong twiteer.txt: ${dataTwitterArray.length}`);
    console.log(`Số lượng mục trong proxies.txt: ${resultArray.length}`);
    console.log('tokenArray', tokenArray.length)

    const results = [];

    // const groups = [
    //     indicesGroups.group1to5, indicesGroups.group6to10, indicesGroups.group11to15,
    //     indicesGroups.group16to20, indicesGroups.group21to25, indicesGroups.group26to30,
    //     indicesGroups.group31to35, indicesGroups.group36to39, indicesGroups.group41to45,
    //     indicesGroups.group46to50, indicesGroups.group51to55, indicesGroups.group56to60,
    //     indicesGroups.group61to65, indicesGroups.group66to70, indicesGroups.group71to75,
    //     indicesGroups.group76to80, indicesGroups.group81to85, indicesGroups.group86to90,
    //     indicesGroups.group91to95, indicesGroups.group96to100, indicesGroups.group101to105,
    //     indicesGroups.group106to110, indicesGroups.group111to115, indicesGroups.group116to120,
    //     indicesGroups.group121to125, indicesGroups.group126to130, indicesGroups.group131to135,
    //     indicesGroups.group136to140, indicesGroups.group141to145, indicesGroups.group146to150,
    //     indicesGroups.group151to155, indicesGroups.group156to160, indicesGroups.group161to165,
    //     indicesGroups.group166to170, indicesGroups.group171to175, indicesGroups.group176to180,
    //     indicesGroups.group181to185, indicesGroups.group186to190, indicesGroups.group191to195,
    //     indicesGroups.group196to200, indicesGroups.group201to205, indicesGroups.group206to210,
    //     indicesGroups.group211to215, indicesGroups.group216to220, indicesGroups.group221to225,
    //     indicesGroups.group226to230, indicesGroups.group231to235, indicesGroups.group236to240,
    //     indicesGroups.group241to245, indicesGroups.group246to250
    //   ];

    const groups = [
        indicesGroups.group1to10, indicesGroups.group11to20, indicesGroups.group21to30,
        indicesGroups.group31to40, indicesGroups.group41to50, indicesGroups.group51to60,
        indicesGroups.group61to70, indicesGroups.group71to80, indicesGroups.group81to90,
        indicesGroups.group91to100, indicesGroups.group101to110, indicesGroups.group111to120,
        indicesGroups.group121to130, indicesGroups.group131to140, indicesGroups.group141to150,
        indicesGroups.group151to160, indicesGroups.group161to170, indicesGroups.group171to180,
        indicesGroups.group181to190, indicesGroups.group191to200, indicesGroups.group201to210,
        indicesGroups.group211to220, indicesGroups.group221to230, indicesGroups.group231to240,
        indicesGroups.group241to250, indicesGroups.group251to260, indicesGroups.group261to270,
        indicesGroups.group271to280, indicesGroups.group281to290, indicesGroups.group291to300,
        indicesGroups.group301to310, indicesGroups.group311to320, indicesGroups.group321to330,
        indicesGroups.group331to340, indicesGroups.group341to350, indicesGroups.group351to360,
        indicesGroups.group361to370, indicesGroups.group371to380, indicesGroups.group381to390,
        indicesGroups.group391to400, indicesGroups.group401to410, indicesGroups.group411to420,
        indicesGroups.group421to430, indicesGroups.group431to440, indicesGroups.group441to450,
        indicesGroups.group451to460, indicesGroups.group461to470, indicesGroups.group471to480,
        indicesGroups.group481to490, indicesGroups.group491to500
    ];
    
    module.exports = groups;
    

    const maxThreads = 10;
    let currentGroupIndex = 25; 
    async function processGroup(indicesToRun) {
        let activeWorkers = 0;
        let currentIndex = 0;
        const groupResults = [];

        async function processNextWorker() {
            if (currentIndex >= dataTwitterArray.length) return;

            if (indicesToRun.length > 0 && !indicesToRun.includes(currentIndex)) {
                currentIndex++;
                return processNextWorker();
            }

            //const mnemonics = dataArray[currentIndex].split(':__ ');

            const Datatwitter = dataTwitterArray[currentIndex].split('|')
            const bumba = Datatwitter[3].split('@');
            const twitter = {
                user: Datatwitter[0],
                pass: Datatwitter[1],
                auth2fa: Datatwitter[2],
                usermail: bumba[0],
                domain: bumba[1],
            }
            const key12 = dataArraykey12[currentIndex]
            const proxy = resultArray[currentIndex]
            //console.log(`Lỗi trong proxy `, proxy);
            // const mnemonic = mnemonics[1]
            const mnemonic = Datatwitter[5] || ''

            const token = tokenArray[currentIndex]
            //console.log('Processing mnemonic:', mnemonic);
            //, token, key12, mnemonic, twitter, 
            const address = dataArray[500 + currentIndex]
            const workerData = { i: 0 + currentIndex, proxy, address };

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

        const initialWorkers = Math.min(maxThreads, dataTwitterArray.length);
        const workerPromises = [];
        for (let i = 0; i < initialWorkers; i++) {
            workerPromises.push(processNextWorker());
        }
        const results = await Promise.allSettled(workerPromises);

        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(`Worker ${index} failed:`, result.reason);
            } else {
                console.log(`Worker ${index} succeeded:`, result.value);
            }
        });

        if (globalState.closeWorker) {
            const { exec } = require('child_process');
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
        }
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
