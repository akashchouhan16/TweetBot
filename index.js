require('dotenv').config();

const puppeteer = require('puppeteer');
const username = process.env.USER_ID;
const password = process.env.USER_PASSWORD;

let browser  = null;
let page = null;

// ||'tweetBo31430880' ||'tweetBot';
// || 'tweetBot1$$';
(async ()=>{
    browser = await puppeteer.launch({headless : false});
    console.log(`TweetBot is active now...`);
    
    page = await browser.newPage();
    page.setViewport({
        width : 1280,
        height : 800,
        isMobile : false
    });

    await page.goto('https://twitter.com/login', {waitUntil : 'networkidle2'});
    
    // Accessing the inputs : 
    await page.type('input[name="session[username_or_email]"]',username,{delay : 25});
    await page.type('input[name="session[password]"]',password,{delay: 25});

    // Login : 
    
    await page.click('div[data-testid="LoginForm_Login_Button"]');
    await page.waitForTimeout(5000);
    console.log(`Initiating Search for Twitter Users who have twitted #tesla .......`);
    // Searching : 
    const hastag1 = '#tesla' || 'Elon Musk' || 'Akash_Chouhan_';
    await page.type('input[data-testid="SearchBox_Search_Input"]', hastag1, {delay : 55});
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    // await page.click('a[class="css-4rbku5 css-18t94o4 css-1dbjc4n r-sdzlij r-1loqt21 r-1adg3ll r-1ny4l3l r-1udh08x r-o7ynqc r-6416eg r-13qz1uu"]');
    // await page.waitForTimeout(2000);
    // =======================================================================================
    let authorsSet = new Set()
    try {
        let previousHeight;
        for (let i = 0; i < 5; i++) {
            const elementHandles = await page.$$('a.css-4rbku5.css-18t94o4.css-1dbjc4n.r-sdzlij.r-1loqt21.r-1adg3ll.r-ahm1il.r-1udh08x.r-o7ynqc.r-6416eg.r-13qz1uu');
            // const elementHandles = await page.click('a[class="css-4rbku5 css-18t94o4 css-1dbjc4n r-sdzlij r-1loqt21 r-1adg3ll r-1ny4l3l r-1udh08x r-o7ynqc r-6416eg r-13qz1uu"]');
            // await page.waitForTimeout(1000);
            // await page.click('div[class="css-901oao r-1awozwy r-13gxpu9 r-6koalj r-18u37iz r-16y2uox r-1qd0xha r-a023e6 r-b88u0q r-1777fci r-ad9z0x r-dnmrzs r-bcqeeo r-q4m81j r-qvutc0"]');
            // await page.waitForTimeout(2000);
            // await page.goBack();

            const propertyJsHandles = await Promise.all(
              elementHandles.map(handle => handle.getProperty('href'))
            );
            const urls = await Promise.all(
              propertyJsHandles.map(handle => handle.jsonValue())
            );

            urls.forEach(item => authorsSet.add(item));
            console.log(urls);

            previousHeight = await page.evaluate('document.body.scrollHeight');
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
            await page.waitForTimeout(2000);
        }
    } catch(e) {console.log(e); }

    console.log("-----")
    console.log(authorsSet);

    // VISIT ALL AUTHORS AND CLICK FOLLOW BUTTON
    const newurls = Array.from(authorsSet)
    for (let i = 0; i < newurls.length; i++) {
      try {
        const url = newurls[i];
        console.log(url);
        await page.goto(`${url}`);

        await page.waitForTimeout(2000)
        await page.click('div[class="css-18t94o4 css-1dbjc4n r-1niwhzg r-p1n3y5 r-sdzlij r-1phboty r-rs99b7 r-1w2pmg r-1vuscfd r-1dhvaqw r-1fneopy r-o7ynqc r-6416eg r-lrvibr"]');
        
        // class="css-901oao r-1awozwy r-13gxpu9 r-6koalj r-18u37iz r-16y2uox r-1qd0xha r-a023e6 r-b88u0q r-1777fci r-ad9z0x r-dnmrzs r-bcqeeo r-q4m81j r-qvutc0"
        await page.waitForTimeout(2000)
        await page.goBack();
      }
      catch(error) {
        console.error(error);
      }
    }

})(); //IIFE
