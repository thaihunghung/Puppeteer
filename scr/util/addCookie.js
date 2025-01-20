async function addCookie(pagecookie, cookies) {
    // Click vào nút thêm cookie
    const add = await Auto.ElementXpath(pagecookie, '//*[@id="main"]/div[1]/div[3]');
    if (add.found) {
        await add.element.click();
    }

    // Điền giá trị vào textarea
    const input2 = await Auto.ElementXpath(pagecookie, '//textarea[@class="el-textarea__inner" and @rows="2"]');
    if (input2.found) {
        await input2.element.type(cookies.value);
    }

    // Điền tên và domain vào các input
    const elements = await pagecookie.$$('xpath=//input[contains(@class, "el-input__inner") and @autocomplete="off"]');
    if (elements[0]) {
        await elements[0].type(cookies.name);
        console.log('Typed into Element 1:', await pagecookie.evaluate(el => el.id, elements[0]));
    }
    if (elements[1]) {
        await pagecookie.evaluate(el => el.value = '', elements[1]); // Xóa giá trị cũ
        await elements[1].type(cookies.domain);
        console.log('Typed into Element 2:', await pagecookie.evaluate(el => el.id, elements[1]));
    }

    // Click chọn Secure
    if (cookies.secure) {
        const secure = await Auto.ElementXpath(pagecookie, '//*[@id="main"]/div[2]/div/div[2]/form/div[7]/div/label[3]');
        if (secure.found) {
            await secure.element.click();
        }
    }


    if (cookies.httpOnly) {
        const httpOnly = await Auto.ElementXpath(pagecookie, '//*[@id="main"]/div[2]/div/div[2]/form/div[7]/div/label[4]');
        if (httpOnly.found) {
            await httpOnly.element.click();
        }
    }

    // Click nút Done
    const buttonDone = await Auto.ElementXpath(pagecookie, '//*[@id="main"]/div[3]/button');
    if (buttonDone.found) {
        await buttonDone.element.click();
    }
}