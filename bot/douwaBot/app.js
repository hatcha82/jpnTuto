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
var rateLimit = 1000
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
      tables.shift()
      tables.forEach(function(table){
        var aTags = table.querySelectorAll('a')
        var title = Array.from(table.querySelectorAll('a'))[0].textContent
        var aHref = Array.from(table.querySelectorAll('a'))[0].href;
        if(aTags.length > 1){

          Array.from(aTags).forEach(function(a){
            if(a.textContent.indexOf('第') != -1){
              titleIndex = Array.from(aTags).indexOf(a)
              }
          })
          

          title = Array.from(aTags)[titleIndex].textContent
          aHref = Array.from(aTags)[titleIndex].href;
        }
        
        var embedSrc = table.querySelector('embed') ? table.querySelector('embed').src : null;

        if(embedSrc == null){
          embedSrc = table.querySelector('audio') ? table.querySelector('audio').src : null;
        }

        embedSrc = (embedSrc.indexOf('http') != -1) ? embedSrc : embedSrc + imgSrc
        aHref = (aHref.indexOf('http') != -1) ? aHref : fileDir + aHref

        var episod = (title.split(':')[0] != undefined) ? title.split(':')[0].trim() :title.split(':')[0]
        title = (title.split(':')[1] != undefined) ? title.split(':')[1].trim() :title.split(':')[1]
        
        var imgSrc = table.querySelector('img').src

        imgSrc = (imgSrc.indexOf('http') != -1) ? imgSrc : fileDir + imgSrc
        
console.log(`
${episod} 
${title}
${aHref}
${imgSrc}
${embedSrc}
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
      var src = imgs[0].src
      var imgSrc = (src.indexOf('http') != -1) ? src : fileDir + src
      var imgTag = imgs[0].outerHTML;
      imgTag = replaceAll(imgTag,`"${src}"`,`"${imgSrc}"`)      
      html = `<p>${imgTag}</p>`
    }
    
    
    paragraphs.pop()
    paragraphs.forEach(function(p){
      html += p.outerHTML
    })
    imgs.forEach(function(img){
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


    async function findOrCreateSong(param) {
      param.createdUserId=3
      param.updatedUseId=3   
    
      const [instance, wasCreated] = await Douwa.findOrCreate({ where: {  episod : param.episod , title: param.title , linkUrl: param.linkUrl} , defaults : param });      
      if(!wasCreated){            
        instance.audioUrl = param.songLiaudioUrlnk
        await instance.save();
      }
      return [instance, wasCreated];
    }
    const [douwaInstance, douwaCreated]  = await findOrCreateSong(param);
  
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

  var pagelist = [	
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


  pagelist.forEach(function(link){
    addQueue(link)
  })
  
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
