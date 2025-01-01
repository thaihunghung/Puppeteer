const { fs } = require("../config/module.import");

class Util {
    static sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }
    static readCookiesFile(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf-8', (err, data) => {
                if (err) {
                    console.error('Lỗi khi đọc file cookies:', err);
                    return reject(err);
                }
                try {
                    const json = JSON.parse(data);
                    resolve(json);
                } catch (parseError) {
                    console.error('Lỗi khi phân tích JSON:', parseError);
                    reject(parseError);
                }
            });
        });
    }

    static saveCookiesToFile(cookies, filePath) {
        try {
            //const fileName = `${nameProfile || 'defaultProfile'}.json`;
            const fileExists = fs.existsSync(filePath);
            console.log(fileExists ? `File ${filePath} đã tồn tại, ghi đè dữ liệu cookies mới.` : `Tạo mới file ${filePath}`);

            fs.writeFileSync(filePath, JSON.stringify(cookies, null, 2), 'utf-8');
            console.log(`Cookies đã được lưu vào ${filePath}`);
        } catch (error) {
            console.error('Không thể lưu cookies:', error);
        }
    }

    static async waitToRun( workerData ) {
        const { indicesToRun, i } = workerData;
        if (indicesToRun.length === 0) return;
        if (indicesToRun.length < 2 || indicesToRun.length > 5) return;
        
        const index = indicesToRun.indexOf(i);
        if (index === 0)  return;
        const sleepTime = index * 3000; 

        await this.sleep(sleepTime);
    }

    static async CreateMouse(page) {
        await page.evaluateOnNewDocument(() => {
          if (window !== window.parent)
            return;
          window.addEventListener('DOMContentLoaded', () => {
            const box = document.createElement('puppeteer-mouse-pointer');
            const styleElement = document.createElement('style');
            styleElement.innerHTML = `
                puppeteer-mouse-pointer {
                  pointer-events: none;
                  position: absolute;
                  top: 0;
                  z-index: 10000;
                  left: 0;
                  width: 20px;
                  height: 20px;
                  background: rgba(0,0,0,.4);
                  border: 1px solid white;
                  border-radius: 10px;
                  margin: -10px 0 0 -10px;
                  padding: 0;
                  transition: background .2s, border-radius .2s, border-color .2s;
                }
                puppeteer-mouse-pointer.button-1 {
                  transition: none;
                  background: rgba(0,0,0,0.9);
                }
                puppeteer-mouse-pointer.button-2 {
                  transition: none;
                  border-color: rgba(0,0,255,0.9);
                }
                puppeteer-mouse-pointer.button-3 {
                  transition: none;
                  border-radius: 4px;
                }
                puppeteer-mouse-pointer.button-4 {
                  transition: none;
                  border-color: rgba(255,0,0,0.9);
                }
                puppeteer-mouse-pointer.button-5 {
                  transition: none;
                  border-color: rgba(0,255,0,0.9);
                }
              `;
            document.head.appendChild(styleElement);
            document.body.appendChild(box);
            document.addEventListener('mousemove', event => {
              box.style.left = event.pageX + 'px';
              box.style.top = event.pageY + 'px';
              updateButtons(event.buttons);
            }, true);
            document.addEventListener('mousedown', event => {
              updateButtons(event.buttons);
              box.classList.add('button-' + event.which);
            }, true);
            document.addEventListener('mouseup', event => {
              updateButtons(event.buttons);
              box.classList.remove('button-' + event.which);
            }, true);
            function updateButtons(buttons) {
              for (let i = 0; i < 5; i++)
                box.classList.toggle('button-' + i, buttons & (1 << i));
            }
          }, false);
        });
    }
    
    static async waitFor1sAnd30s () {
      while (true) {
          const currentSeconds = new Date().getSeconds();
          if (currentSeconds === 1 || currentSeconds === 31) {
              console.log(currentSeconds)
              break;
          }
    }
    
  }
}

module.exports = Util
