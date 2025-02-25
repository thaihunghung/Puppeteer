const fs = require('fs').promises;
const path = require('path');

async function generateInteractionScript(inputFile, outputFile) {
    try {
        const content = await fs.readFile(inputFile, 'utf-8');
        const entries = content
            .split('----------------')
            .map(line => {
                const jsonMatch = line.match(/{[\s\S]*}/);
                return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
            })
            .filter(entry => entry !== null)
            .sort((a, b) => a.timestamp - b.timestamp);

        // Gộp các sự kiện input liên tiếp
        const consolidatedEntries = [];
        let lastInput = null;

        for (const entry of entries) {
            if (entry.eventType === 'input' && lastInput) {
                const sameElement =
                    lastInput.xpath === entry.xpath &&
                    lastInput.frameUrl === entry.frameUrl &&
                    lastInput.pageUrl === entry.pageUrl;
                const timeDiff = entry.timestamp - lastInput.timestamp;

                if (sameElement && timeDiff < 500) {
                    lastInput.inputValue = entry.inputValue;
                    continue;
                }
            }

            if (lastInput) consolidatedEntries.push(lastInput);
            if (entry.eventType === 'input') {
                lastInput = { ...entry };
            } else {
                consolidatedEntries.push(entry);
                lastInput = null;
            }
        }
        if (lastInput) consolidatedEntries.push(lastInput);

        // Tạo nội dung script
        let scriptContent = `
// Giả sử bạn đã có ElementService và PageService trong dự án


(async () => {
`;

        // Theo dõi các page đã mở
        const pageMap = new Map();

        for (const entry of consolidatedEntries) {
            const { eventType, xpath, pageUrl, inputValue } = entry;

            // Mở page mới nếu chưa có
            if (!pageMap.has(pageUrl)) {
                const pageVar = pageUrl === 'https://2fa.live/' ? '2fa_live' : `page_${pageMap.size}`;
                scriptContent += `
    const ${pageVar} = await PageService.openNewPage('${pageUrl}', 'load');
`;
                pageMap.set(pageUrl, pageVar);
            }

            const pageVar = pageMap.get(pageUrl);

            if (eventType === 'click') {
                scriptContent += `
    await ElementService.waitAndClick1(${pageVar}, \`${xpath}\`);
`;
            } else if (eventType === 'input') {
                scriptContent += `
    await ElementService.HandlefindAndTypeElement(${pageVar}, \`${xpath}\`, '${inputValue || ''}');
`;
            }
        }

        // Đóng các browser
        scriptContent += `
    // Đóng các browser (giả sử page object có browser)
    await Promise.all([${Array.from(pageMap.values()).map(p => `${p}.browser.close()`).join(', ')}]);
})();
`;

        await fs.writeFile(outputFile, scriptContent, 'utf-8');
        console.log(`Script đã được tạo tại: ${outputFile}`);
    } catch (error) {
        console.error('Lỗi khi tạo script:', error);
    }
}

(async () => {
    const inputFile = path.join(__dirname, 'elements.txt');
    const outputFile = path.join(__dirname, 'output.txt');
    await generateInteractionScript(inputFile, outputFile);
})();