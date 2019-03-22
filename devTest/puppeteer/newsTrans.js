require('dotenv').config()
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
var fs = require('fs');
var {Article} = require('./models')
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
    },1000 * 60 * 2)   
  } catch (error) {
    console.log(`Error : ${error}` )
  }
})();

async function getArticle(){
      
  const Op = sequelize.Op
  var article = await Article.findOne({
    where :{
      $and: [
        {  translateText : {[Op.eq]: null} },
      ]
    },    
    order: [
      ['createdAt','DESC']
    ],
    limit: 1
  })
  if(!article){
    return null;
  }else{
    return article
  }
}
async function updateArticle(article){
  Article.update({
    titleTranslate: article.titleTranslate,
    translateText: article.translateText,
    naverBlogUpload: article.naverBlogUpload,
    naverBlogRefNo: article.naverBlogRefNo
  }, {
    where: { id: article.id }
  })
  .then(result =>{
    console.log(`result: ${result}  updated row article.id ${article.id} ,title ${article.title}` )    
  })
  .catch(error =>{
    console.log(`result: ${error}  updated row article.id ${article.id} ,title ${article.title}` )
  })  
}
async function papagoTranslate(){

  var article = await getArticle();
  
  if(article == null) return;
  var sourceText = `${article.title}\n${article.article}`

  const browser = await puppeteer.launch({
    headless: false,
    args: [`--window-size=300,300`]
  });
  const page = await browser.newPage();
  page.setViewport({width:300,height:300})
  await page.goto('https://papago.naver.com', {waitUntil: 'networkidle2'});

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

        article.titleTranslate =translatedText.shift()
        
        article.translateText = translatedText.join('\n')
       
        updateArticle(article)
        //fs.writeFile('myjsonfile.text', textBody); 
          browser.close()
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
