const clipboardy = require('clipboardy');
const fs = require('fs');

// Tên file để lưu lịch sử clipboard
const fileName = 'clipboard-history.txt';

// Kiểm tra clipboard mỗi giây
setInterval(async () => {
  try {
    const currentContent = await clipboardy.read();

    // Kiểm tra nếu nội dung không rỗng
    if (currentContent.trim() !== '') {

      // Kiểm tra xem file có tồn tại không
      fs.open(fileName, 'a', (err, fd) => {
        if (err) {
          console.error('Lỗi khi mở file:', err);
          return;
        }

        // Đọc nội dung trong file
        fs.readFile(fileName, 'utf8', (err, data) => {
          if (err) {
            console.error('Lỗi khi đọc file:', err);
            return;
          }

          // Kiểm tra xem currentContent đã có trong file hay chưa
          if (!data.includes(currentContent)) {
            // Nếu không có trong file, ghi thêm vào file mà không ghi đè
            fs.appendFile(fileName, currentContent + '\n', 'utf8', (err) => {
              if (err) {
                console.error('Lỗi khi ghi nội dung vào file:', err);
              } else {
                console.log('Đã thêm vào lịch sử clipboard:', currentContent);
              }
            });
          } else {
            console.log('Nội dung đã có trong lịch sử clipboard:', currentContent);
          }
        });
      });
    }
  } catch (err) {
    console.error('Lỗi khi đọc clipboard:', err);
  }
}, 1000);
