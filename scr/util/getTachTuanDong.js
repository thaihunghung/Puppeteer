const fs = require('fs');

// Đọc file
fs.readFile('clipboard-history.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Lỗi khi đọc file:', err);
    return;
  }

  // Tách từng dòng
  const lines = data.split('\n');

  // Từ khóa để lọc
  const keywords = ['west', 'trouble'];

  // Lọc các dòng chứa đủ tất cả từ khóa (khớp chính xác)
  const filteredLines = lines.filter(line =>
    keywords.every(keyword => new RegExp(`\\b${keyword}\\b`).test(line))
  );

  // In kết quả
  console.log('Các dòng chứa đủ tất cả từ khóa (khớp chính xác):', filteredLines);
});
