require('dotenv').config()
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
var fs = require('fs');
var {Douwa} = require('./models')
const {sequelize} = require('./models')
const sourceText = '';

(async () => {

  try {
   
    //console.log(sourceTex)    
    await papagoTranslate()    
    setInterval( async() => {
      var ranTime = Math.floor((Math.random() * 10) + 1)
      console.log(`${ranTime}Sec 후 시작...`)
      setTimeout(async()=>{
        await papagoTranslate()
      },ranTime)
    },1000 * 20)   
  } catch (error) {
    console.log(`Error : ${error}` )
  }
})();

async function getDouwa(){
      
  const Op = sequelize.Op
  var douwa = await sequelize.query("SELECT * FROM `Douwas` WHERE  translateText is null and LENGTH(articelOnlyText) < 5000 limit 1", { type: sequelize.QueryTypes.SELECT})     
  if(!douwa){
    return null;
  }else{
    return douwa[0]
  }
}
async function updateDouwa(douwa){
  Douwa.update({
    titleTranslate: douwa.titleTranslate,
    translateText: douwa.translateText,    
  }, {
    where: { id: douwa.id }
  })
  .then(result =>{
    console.log(`result: ${result}  updated row douwa.id ${douwa.id} ,title ${douwa.title}` )    
  })
  .catch(error =>{
    console.log(`result: ${error}  updated row douwa.id ${douwa.id} ,title ${douwa.title}` )
  })  
}
async function papagoTranslate(){

  var douwa = await getDouwa();
  
  if(douwa == null) return;
  var sourceText = `${douwa.title}\n${douwa.articelOnlyText}`

  const browser = await puppeteer.launch({
    headless: false,
    args: [`--window-size=300,300`]
  });
  const page = await browser.newPage();
  await page.goto('https://papago.naver.com' ,{waitUntil: 'networkidle2'});

  const param = {
    selector : '#txtSource',
    sourceText : sourceText
  }

  await page.evaluate(param => {
      document.querySelector(param.selector).value = param.sourceText
  }, param);
  await page.type(param.selector,'\n', {delay: 1000});
  await page.click("#btnTranslate");

  page.on('response', response => {
    var url = response.url()
    if(url === 'https://papago.naver.com/apis/n2mt/translate'){
      response.text().then( async function (textBody) {
        JSONObj = JSON.parse(textBody)
        var translatedText =  JSONObj.translatedText.split('\n')

        douwa.titleTranslate =translatedText.shift()
        
        douwa.translateText = translatedText.join('\n')
        console.log(douwa.translateText)
        updateDouwa(douwa)
        //fs.writeFile('myjsonfile.text', textBody); 
        setTimeout(async ()=>{
          browser.close()
        },1000 * 10)
      })
    }
  })
}
async function furiganaLyrics(){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.emulate(devices['iPhone 6']);
  await page.goto('http://www.furiganahub.com/music/detail/700');
  const resultsSelector = '#undefined > div > div > div';
  await page.waitForSelector(resultsSelector);
  const lyrics = await page.evaluate(resultsSelector => {
    const elems = Array.from(document.querySelectorAll(resultsSelector));
    return elems.map(elem => {
      const title = elem.textContent;
      return `${title}`;
    });
  }, resultsSelector);
  console.log(lyrics[0]);

  // await page.screenshot({path: 'full.png', fullPage: true});
  await browser.close();
}
