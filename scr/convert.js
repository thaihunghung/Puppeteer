const fs = require('fs');

// Đọc file results.txt
const content = fs.readFileSync('results.txt', 'utf-8');

// Tách các block JSON
const rawEntries = content.trim().split('\n\n');
const entries = rawEntries.map(entry => JSON.parse(entry));

// Xử lý dữ liệu
const pages = [...new Set(entries.map(entry => entry.page))];
const actions = entries.map(entry => ({
    id: entry.id,
    page: entry.page, // Gán thông tin page vào action
    click: entry.event === "click",
    action_click: {
        wait_click_elemet: true,
        action_xpath: Boolean(entry.xpath),
        action_xpath_text: Boolean(entry["xpath text"]),
        action_selecter: Boolean(entry.selectorcss),
        shadown: false, // Giả định không có shadow DOM
        xpath: entry.xpath,
        selecter: entry.selectorcss,
        jspath: entry["js path"]
    },
    input: Boolean(entry["value input"]),
    action_input: {
        wait_input_elemet: true,
        action_xpath: Boolean(entry.xpath),
        action_xpath_text: Boolean(entry["xpath text"]),
        action_selecter: Boolean(entry.selectorcss),
        xpath: entry.xpath,
        selecter: entry.selectorcss,
        input: entry["value input"]
    }
}));

// Tạo cấu trúc JSON mong muốn
const outputData = {
    pages,
    action: actions
};

// Xuất ra file JSON
fs.writeFileSync('output.json', JSON.stringify(outputData, null, 4), 'utf-8');

console.log("File output.json đã được tạo!");
