const fs = require('fs');
const filePath = 'E:\\puppeteer-auto-meta-proxy\\scr\\lo\\lo3.txt';

const processFile = async () => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');

    // Loại bỏ ký tự \r và tách file thành các dòng
    const cleanedData = data.replace(/\r/g, '');
    const lines = cleanedData.split('\n');

    // Phạm vi profile
    const startProfile = 41;
    const endProfile = 65;

    const result = [];
    let profileIndex = startProfile;

    // Duyệt qua các dòng
    for (const line of lines) {
      const linesSlip = line.trim().split(' ');
      if (profileIndex <= endProfile && linesSlip.length >= 4) {
        const jsonObject = {
          profile: `__Profile _${profileIndex}`,
          updatedFields: {

            // twitter: {
            //   user: linesSlip[0],
            //   auth2fa: linesSlip[2],
            //   backupcode: linesSlip[3],
            //   cookies: [], // Cookies rỗng
            // },
          },
          data: line
        };

        result.push(jsonObject); // Thêm vào mảng kết quả
        profileIndex++;
      }
    }


    console.log('Mảng kết quả JSON:', result);
  } catch (err) {
    console.error('Lỗi khi xử lý file:', err);
  }
};

// Gọi hàm xử lý file
processFile();
