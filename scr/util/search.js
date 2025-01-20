const fs = require('fs');

// Tên file để lưu lịch sử clipboard
const fileName = 'clipboard-history.txt';

// Hàm tìm kiếm nội dung trong file và trả về mảng các từ chứa chuỗi tìm kiếm
function searchContent(queries) {
  // Đọc nội dung trong file
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      console.error('Lỗi khi đọc file:', err);
      return;
    }

    // Tách nội dung của file thành mảng các dòng
    const historyArray = data.split('\n').filter(line => line.trim() !== '');

    // Mảng để lưu kết quả
    let result = [];

    // Lặp qua từng dòng và tìm các từ có chứa chuỗi tìm kiếm
    historyArray.forEach(line => {
      const words = line.split(' '); // Tách dòng thành các từ
      words.forEach(word => {
        // Kiểm tra nếu từ chứa một trong các chuỗi tìm kiếm
        queries.forEach(query => {
          if (word.includes(query)) {
            // Thêm từ vào kết quả nếu chứa chuỗi tìm kiếm
            result.push(word);
          }
        });
      });
    });

    // In kết quả tìm kiếm
    if (result.length > 0) {
      console.log('Kết quả tìm kiếm cho queries:', queries);
      console.log(result);
    } else {
      console.log('Không tìm thấy kết quả nào.');
    }
  });
}

// Ví dụ: Tìm kiếm với chuỗi 'west' hoặc 'found'
const searchQueries = ['west', 'found']; // Thay đổi chuỗi tìm kiếm
searchContent(searchQueries);
