const fs = require('fs');

const rawData = `
{
  "id": 1,
  "event": "click",
  "page": "https://tunproxy.com/check-proxy",
  "xpath": "body/div[3]/div[4]/div[2]/button[1]/span[3]/i[1]",
  "xpath text": "",
  "selectorcss": "i.v-icon.notranslate.v-theme--dark.tabler-x.v-icon.notranslate.v-theme--dark",
  "js path": "document.body.children[4].children[3].children[1].children[0].children[2].children[0]",
  "value input": ""
}

{
  "id": 2,
  "event": "click",
  "page": "https://2fa.live/",
  "xpath": "//*[@id="submit"]",
  "xpath text": "Submit",
  "selectorcss": "a#submit.btn.btn-primary",
  "js path": "document.body.children[4].children[2].children[1].children[0].children[0]",
  "value input": ""
}
`;

// Tách các object từ chuỗi text
const actions = rawData.trim().split('\n\n').map(item => JSON.parse(item));

// Nhóm actions theo page
const groupedByPage = actions.reduce((acc, action) => {
    if (!acc[action.page]) {
        acc[action.page] = [];
    }
    acc[action.page].push(action);
    return acc;
}, {});

// Tạo JSON cho từng page
Object.entries(groupedByPage).forEach(([pageUrl, pageActions]) => {
    const jsonData = {
        pages: [pageUrl],
        actions: pageActions.map(action => ({
            id: action.id,
            wait_click_element: action.event === "click",
            action_xpath: !!action.xpath,
            action_xpath_text: action["xpath text"] !== "",
            action_selecter: !!action.selectorcss,
            shadow: !!action["js path"],
            xpath: action.xpath,
            selecter: action.selectorcss,
            jspath: action["js path"],
            input: action["value input"]
        }))
    };

    // Tạo tên file dựa trên URL
    const fileName = `results_${pageUrl.split('/')[2].replace(/\./g, '_')}.json`;
    fs.writeFileSync(fileName, JSON.stringify(jsonData, null, 2));
    console.log(`Đã tạo ${fileName}`);
});