require('dotenv').config()
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
var fs = require('fs');
var {Article} = require('./models')
const {sequelize} = require('./models')
const sourceText = '';
var browser = null;
(async () => {

  try {
    browser = await puppeteer.launch({
      headless: false,
     
    });
    //console.log(sourceTex)    
    await mySiteTravel('http://www.furiganahub.com')    
    // var ranTime = Math.floor((Math.random() * 10) + 1)
    // setInterval( async() => {
    //   var ranTime = Math.floor((Math.random() * 10) + 1)
    //   console.log(`${ranTime}Sec 후 시작...`)
    //   setTimeout(async()=>{
    //     await mySiteTravel('http://www.furiganahub.com')    
    //   },ranTime)
    // }, (1000 * 60 ) * 3  + (1000 * 60) * ranTime)   
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
        sequelize.where(
           sequelize.fn('DATE', sequelize.col('createdAt')),
           sequelize.literal('CURRENT_DATE')
        )
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
async function mySiteTravel(url){
 
  const page = await browser.newPage();
  await page.setViewport({width:1920,height:1080}); //Custom Width
  await page.goto(url,{
    waitLoad: 'load', 
    timeout:0    
  });
//  await page.waitForNavigation();

  var aLinks = await page.evaluate(() => {
    var links = Array.from(document.querySelectorAll('a'))
    var targetLink = []
    links.map(link => {
      if(link.href == 'http://www.furiganahub.com/'){
        }
      else if(link.href == 'http://www.furiganahub.com/music/list'){
        }
      else if(link.href == 'http://www.furiganahub.com/article/list'){
        }else{
        targetLink.push(link.href)
        }        
    })
    return targetLink
  })
  var rIdx = Math.floor(Math.random() * aLinks.length);    

  setTimeout(async function() {  
    const linkPage = await browser.newPage();

    setTimeout(function(){
      page.close()
    }, (rIdx +3 * 1000 ) )
    await linkPage.setViewport({width:1920,height:1080}); //Custom Width
    console.log(`Site : ${aLinks[rIdx]}`)
    await linkPage.goto(aLinks[rIdx],{
      waitLoad: 'load', 
      timeout:0    
      });
      setTimeout( async function(){
        setTimeout(function(){
          linkPage.close();
        }, ( (rIdx + 3) * 1000 ) )
        await mySiteTravel('http://www.furiganahub.com')    
      },1000 * 60  * 1000)     
  },1000 * (rIdx +  1))     
}
async function papagoTranslate(){

  var article = await getArticle();
  
  if(article == null) return;
  var sourceText = `${article.title}\n${article.article}`

  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto('https://papago.naver.com');

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
  //await page.emulate(devices['iPhone 6']);
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
