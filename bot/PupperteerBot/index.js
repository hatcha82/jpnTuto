const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  //await page.setViewport({ width: 1366, height: 768});
  await page.goto('http://www.furiganahub.com/twitter/list/_FURIGANA');
  
  // const bodyHandle = await page.$('body');
  // const { width, height } = await bodyHandle.boundingBox();
  // const screenshot = await page.screenshot({
  //   clip: {
  //     x: 0,
  //     y: 0,
  //     width,
  //     height
  //   },
  //   type: 'png'
  // });
  console.log('wait')
  await page.waitFor(5000);
//await bodyHandle.dispose();
console.log('start')
  await page.screenshot({path: 'furiganaKanji.png',fullPage : true});
  console.log('done')
  await browser.close();
})();