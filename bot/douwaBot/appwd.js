require('dotenv').config()
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var Crawler = require("crawler")
const Kuroshiro = require('kuroshiro')
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji')
const kuroshiro = new Kuroshiro()
const {sequelize} = require('./models')
const config = require('./config/config')
const {Douwa} = require('./models') 
var debug = true
var rateLimit = 1000 * 10
var listCrawler = new Crawler({
  maxConnections : 1,
  rateLimit: rateLimit,
  callback : listCrawlerCallBack
});
var detailCrawler = new Crawler({
  maxConnections : 1,
  rateLimit: rateLimit,    
  callback : listCrawlerCallBack
});


function replaceAll(str, searchStr, replaceStr) {
  return str.split(searchStr).join(replaceStr);
}
 function listCrawlerCallBack(error, res, done) {
  if(error){
      console.log(error)
  }else{
      var requestURIInfo = JSON.stringify(res.request.uri);
      requestURIInfo = JSON.parse(requestURIInfo);
      var host = requestURIInfo.host
      var filePath = requestURIInfo.path;
      var fileName = requestURIInfo.path.split('/').pop()
      var href=requestURIInfo.href;
      var fileDir = href.replace(fileName, '')
      const dom = new JSDOM(res.body);
      var document = dom.window.document;
      var tables = document.querySelectorAll('body > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(3) > table');
      tables = Array.from(tables)
      var idx = 1;
      tables.forEach(function(table){        
        var td = table.querySelector('td:nth-child(2)');
        var img = table.querySelector('img')
        var atag = td.querySelector('a')
        var audio = table.querySelector('audio');
      
        if(atag){
          var aHref = atag.href;
          aHref = (aHref.indexOf('http') != -1) ? aHref : fileDir + aHref

          var episod = td.textContent;
          var title = td.textContent;
          if(td.textContent.indexOf(":") != -1){
            episod = td.textContent.split(':')[0].trim();
            title = td.textContent.split(':')[1].trim();
          }
         
          var imgSrc = img.src;
          var embedSrc = audio ? audio.src : null
          imgSrc = (imgSrc.indexOf('http') != -1) ? imgSrc : fileDir + imgSrc
          embedSrc = (embedSrc.indexOf('http') != -1) ? embedSrc : fileDir + embedSrc
          
          console.log(`
          episod: ${episod}
          title: ${title} 
          link : ${aHref}
          imgURL : ${imgSrc}
          audio: ${embedSrc}
          `)


          var param = {
            episod : episod,
            title : title,
            href : aHref,
            imageURL : imgSrc,
            embedSrc : embedSrc
          }
          var crawlerparam = [{
            uri: aHref,                        
            callback: detailCrawlerCallBack,
            param : param                   
          }] 
          detailCrawler.queue(crawlerparam)   
        }
      })             
  }
  done();
}
async function detailCrawlerCallBack(error, res, done){
  if(error){
    console.log(error);
  }else{
   
    var param = res.options.param;
    const dom = new JSDOM(res.body);
    var document = dom.window.document;
    var requestURIInfo = JSON.stringify(res.request.uri);
    requestURIInfo = JSON.parse(requestURIInfo);
    var host = requestURIInfo.host
    var filePath = requestURIInfo.path;
    var fileName = requestURIInfo.path.split('/').pop()
    var href=requestURIInfo.href;
    var fileDir = href.replace(fileName, '')


    
    var tables = document.querySelectorAll('body > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(3) > table');
    var html = ''
    var imgs = document.querySelectorAll('body > table > tbody > tr:nth-child(3) > td:nth-child(3) img')
    var paragraphs = document.querySelectorAll('body > table > tbody > tr:nth-child(3) > td:nth-child(3) p')
    imgs = Array.from(imgs)
    paragraphs = Array.from(paragraphs)

  

    if(imgs.length > 0){
      var headerParagraph = paragraphs.shift();
      html = headerParagraph.outerHTML;  
      imgs[0].alt = '';
      var src = imgs[0].src
      var imgSrc = (src.indexOf('http') != -1) ? src : fileDir + src
      var imgTag = imgs[0].outerHTML;
      imgTag = replaceAll(imgTag,`"${src}"`,`"${imgSrc}"`)      
      html = `<p>${imgTag}</p>`
    }
    
    
    paragraphs.shift()
    paragraphs.pop()
    paragraphs.forEach(function(p){
      html += p.outerHTML
    })
    imgs.forEach(function(img){
      img.alt = '';
      var src = img.src

      var imgSrc = (src.indexOf('http') != -1) ? src : fileDir + src
      var imgTag = img.outerHTML;
      imgTag = replaceAll(imgTag,`"${src}"`,`"${imgSrc}"`)      
      html = replaceAll(html, img.outerHTML,imgTag)
    })

    param = {
      episod: param.episod,
      title: param.title,
      titleFurigana: await kuroshiro.convert(param.title, {mode: 'furigana', to: 'hiragana', romajiSystem: 'passport'}) ,   
      titleTranslate: null,
      linkUrl: param.href,
      ImageUrl: param.imageURL,
      audioUrl : param.embedSrc,    
      article:html,      
      furigana: await kuroshiro.convert(html, {mode: 'furigana', to: 'hiragana', romajiSystem: 'passport'}) ,  
      translateText: null,
      createdUserId: 3,
      updatedUserId: 3
    }

    console.log(param)
    done();
    return;
    async function findOrCreateDouwa(param) {
      param.createdUserId=3
      param.updatedUseId=3   
      param.articleType = 'JPN02'
      const [instance, wasCreated] = await Douwa.findOrCreate({ where: {  episod : param.episod , title: param.title , linkUrl: param.linkUrl} , defaults : param });      
      if(!wasCreated){            
        instance.audioUrl = param.songLiaudioUrlnk
        await instance.save();
      }
      return [instance, wasCreated];
    }
    const [douwaInstance, douwaCreated]  = await findOrCreateDouwa(param);
  
    console.log(`
    [
      Created : ${douwaCreated}] 
      episod : ${param.episod}
      title : ${param.title} 
      audio : ${param.audioUrl}
      id : ${douwaInstance.id} 
      link :  ${param.linkUrl}
    ]`)
    // const textOnly = new JSDOM(`<!DOCTYPE html><body>${html}</body>`);
    // console.log(textOnly.window.document.querySelector("body").textContent)
  }
  done();
}

async function start(){
  await kuroshiro.init(new KuromojiAnalyzer());
  var result = await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
  console.log(`Kuroshiro Started... \n ${result}`)
  result = await sequelize.sync({force: false})
  console.log(`DB Started... \n ${result}`)
  var douwa = await Douwa.findOne({
    attributes: [[Douwa.sequelize.fn('COUNT', Douwa.sequelize.col('id')), 'count']],    
  })
  
  console.log(`Douwa Count ${douwa.dataValues.count}`) 

  var pagelistJP01 = [	
    'http://hukumusume.com/douwa/koe/jap/001_010.htm'
  ,	'http://hukumusume.com/douwa/koe/jap/011_020.htm'
  ,	'http://hukumusume.com/douwa/koe/jap/021_030.htm'
  ,	'http://hukumusume.com/douwa/koe/jap/031_040.htm'
  ,	'http://hukumusume.com/douwa/koe/jap/041_050.htm'
  , 'http://hukumusume.com/douwa/koe/jap/051_060.htm'
  ,	'http://hukumusume.com/douwa/koe/jap/061_070.htm'
  ,	'http://hukumusume.com/douwa/koe/jap/071_080.htm'
  ,	'http://hukumusume.com/douwa/koe/jap/081_090.htm'
  ,	'http://hukumusume.com/douwa/koe/jap/091_100.htm'
  ,	'http://hukumusume.com/douwa/koe/jap/101_110.htm'
  ,	'http://hukumusume.com/douwa/koe/jap/111_120.htm'
  ,	'http://hukumusume.com/douwa/koe/jap/121_130.html'
  ,	'http://hukumusume.com/douwa/koe/jap/131_140.html'
  ,	'http://hukumusume.com/douwa/koe/jap/141_150.html'
  ,	'http://hukumusume.com/douwa/koe/jap/151_160.html'
  ,	'http://hukumusume.com/douwa/koe/jap/161_170.html'
  ,	'http://hukumusume.com/douwa/koe/jap/171_180.html'
  ,	'http://hukumusume.com/douwa/koe/jap/181_190.html'
  ,	'http://hukumusume.com/douwa/koe/jap/191_200.html'
  ,	'http://hukumusume.com/douwa/koe/jap/201_210.html'
  ,	'http://hukumusume.com/douwa/koe/jap/211_220.html'
  ,	'http://hukumusume.com/douwa/koe/jap/221_230.html'
  ,	'http://hukumusume.com/douwa/koe/jap/231_240.html'
  ,	'http://hukumusume.com/douwa/koe/jap/241_250.html'
  ,	'http://hukumusume.com/douwa/koe/jap/251_260.html'
  ,	'http://hukumusume.com/douwa/koe/jap/261_270.html'
  ,	'http://hukumusume.com/douwa/koe/jap/271_280.html'
  ,	'http://hukumusume.com/douwa/koe/jap/281_290.html'
  ,	'http://hukumusume.com/douwa/koe/jap/291_300.html'
  ,	'http://hukumusume.com/douwa/koe/jap/301_310.html'
  ,	'http://hukumusume.com/douwa/koe/jap/311_320.html'
  ,	'http://hukumusume.com/douwa/koe/jap/321_330.html'
  ,	'http://hukumusume.com/douwa/koe/jap/331_340.html'
  ,	'http://hukumusume.com/douwa/koe/jap/341_350.html'
  ,	'http://hukumusume.com/douwa/koe/jap/index.html'
  ]
  pagelistWD01 = [
      'http://hukumusume.com/douwa/pc/world/itiran/01gatu.htm'
    ,	'http://hukumusume.com/douwa/pc/world/itiran/02gatu.htm'
    ,	'http://hukumusume.com/douwa/pc/world/itiran/03gatu.htm'
    ,	'http://hukumusume.com/douwa/pc/world/itiran/04gatu.htm'
    ,	'http://hukumusume.com/douwa/pc/world/itiran/05gatu.htm'
    ,	'http://hukumusume.com/douwa/pc/world/itiran/06gatu.htm'
    ,	'http://hukumusume.com/douwa/pc/world/itiran/07gatu.htm'
    ,	'http://hukumusume.com/douwa/pc/world/itiran/08gatu.htm'
    ,	'http://hukumusume.com/douwa/pc/world/itiran/09gatu.htm'
    ,	'http://hukumusume.com/douwa/pc/world/itiran/10gatu.htm'
    ,	'http://hukumusume.com/douwa/pc/world/itiran/11gatu.htm'
    ,	'http://hukumusume.com/douwa/pc/world/itiran/12gatu.htm'
  ]
  pagelistWD01.forEach(function(link){
    addQueue(link)
  })

  // pagelistJP01.forEach(function(link){
  //   addQueue(link)
  // })
  
}
async function addQueue(page, param){   
  
  var crawlerparam = [{
    uri: page,                        
    callback: listCrawlerCallBack,
    param : param    
  }] 
  await listCrawler.queue(crawlerparam)  
}



// for(var i = globalPage;i <= 500;i++){
//   addQueue() 
// }
start()


// var lasctCalledDate = new Date()
// var nnn = `https://headlines.yahoo.co.jp/videonews/nnn` //니테레
// var ann = `https://headlines.yahoo.co.jp/videonews/ann` //Nippon NewsNetwork(ANN)
// var jnn = `https://headlines.yahoo.co.jp/videonews/jnn` //TBS
// var fnn = `https://headlines.yahoo.co.jp/videonews/fnn` //fnn

// setInterval(function() {  
//   addQueue(nnn)
//   addQueue(ann)
//   addQueue(jnn)
//   addQueue(fnn)
//   lasctCalledDate = new Date()
//   console.log(`Now : ${new Date().toDateString()} Queue Size: ${listCrawler.queueSize}`) 
// },60 * 60 * 1000)

// setInterval(function() {
//   var currentDate = new Date()
//   var duration = ((new Date() - lasctCalledDate)  ) /100 /6 /60
//   var nextCall =  60 - duration
//   nextCall = Math.floor(nextCall)
//   console.log(`
//   Now : ${new Date().toString()} 
//   NextCall : ${nextCall}Min Left  
//   List Queue Size: ${listCrawler.queueSize}
//   detailCrawler
//   Detail Queue Size: ${listCrawler.queueSize}`
//   ) 
// },60 * 1000)
