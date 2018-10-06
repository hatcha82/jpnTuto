require('dotenv').config()
var Crawler = require("crawler")
const Kuroshiro = require('kuroshiro')
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji')
const kuroshiro = new Kuroshiro()
const {sequelize} = require('./models')
const config = require('./config/config')
const {Article} = require('./models') 
var debug = true
var listCrawler = new Crawler({
  maxConnections : 1,
  rateLimit: 1000 * 10,    
  callback : listCrawlerCallBack
});
var detailCrawler = new Crawler({
  maxConnections : 1,
  rateLimit: 1000 * 10,    
  callback : listCrawlerCallBack
});



 function listCrawlerCallBack(error, res, done) {
  if(error){
      console.log(error)
  }else{
      var $ = res.$;
      var newslogo = $('.logo').find('img').attr('src');
      var newsCompanyName = $('.logo').find('img').attr('alt');
      var newsLit = $('ul.ymuiList li');
      
      newsLit.each(async function(){
        if(debug){
          
          var title = $(this).find('.fsmt').text()
          var newsURL = $(this).find('.fsmt').find('a').attr('href')
          var newsImagURL =$(this).find('img').attr('src')  
          var date = $(this).find('.ymuiDate').text().replace('配信','')
          newsURL = `https://headlines.yahoo.co.jp${newsURL}`
          
          var param = {
            title: title,
            type: 'NEWS',
            newsUrl: newsURL,
            newsImageUrl: newsImagURL,
            newsPublisher: newsCompanyName,
            newsPubllisherImageUrl: newslogo,
            newsPublishedDate: new Date(`${new Date().getFullYear()} ${date}`),
            article: null,
            furigana: null,
          }
          var article = await Article.findOne({
            where: {
              newsUrl : newsURL
            } 
          })   
          
          if(article){
            console.log(`${newsCompanyName} 새로운 뉴스가 없습니다.`)
          }else{
            console.log(`새로운 뉴스가 있습니다. 본문을 찾습니다.`)
            var crawlerparam = [{
              uri: newsURL,                        
              callback: detailCrawlerCallBack,
              param : param,
              preRequest: function(options, done) {
                  var ranTime = Math.floor((Math.random() * 10) + 1)
                  console.log(`본문 접속 ${ranTime}Sec 후에 진행... : ${newsURL} `)
                  setTimeout(function() {
                    done();
                  }, 1000)
              }
            }] 
            detailCrawler.queue(crawlerparam)   
          }
          debug = true
        }
    })
  }
  done();
}
async function detailCrawlerCallBack(error, res, done){
  if(error){
    console.log(error);
  }else{
    var $ = res.$;
    var param = res.options.param;
    var article = $('.yjDirectSLinkTarget').text();
    
    param.article = article
    param.titleFurigana = await kuroshiro.convert(param.title,{mode: 'furigana', to: 'hiragana', romajiSystem: 'passport'})
    param.furigana = await kuroshiro.convert(article,{mode: 'furigana', to: 'hiragana', romajiSystem: 'passport'})
    param.createdUserId = 3
    param.updatedUserId = 3
    const newArticle = await Article.create(param)
    if(newArticle){
      console.log(
        `
        ${newArticle.id}
        ${JSON.stringify(param)}
        `
            )
    }else{
      console.log(
        `
        DB Create Error : ${param.title}
        `
            )
    }
  }
  done();
}

async function start(){
  await kuroshiro.init(new KuromojiAnalyzer());
  var result = await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
  console.log(`Kuroshiro Started... \n ${result}`)
  result = await sequelize.sync({force: false})
  console.log(`DB Started... \n ${result}`)
  var article = await Article.findOne({
    attributes: [[Article.sequelize.fn('COUNT', Article.sequelize.col('id')), 'count']],    
  })
  
  console.log(`Article Count ${article.dataValues.count}`) 
  var nnn = `https://headlines.yahoo.co.jp/videonews/nnn` //니테레
  var ann = `https://headlines.yahoo.co.jp/videonews/ann` //Nippon NewsNetwork(ANN)
  var jnn = `https://headlines.yahoo.co.jp/videonews/jnn` //TBS
  var fnn = `https://headlines.yahoo.co.jp/videonews/fnn` //fnn
  
  addQueue(nnn)
  addQueue(ann)
  addQueue(jnn)
  addQueue(fnn)
}
async function addQueue(page, param){   
  
  var crawlerparam = [{
    uri: page,                        
    callback: listCrawlerCallBack,
    param : param,
    preRequest: function(options, done) {
        var ranTime = Math.floor((Math.random() * 10) + 1)
        console.log(`${ranTime}Sec 후에 진행...`)
        setTimeout(function() {
          done();
        }, 1000)
    }
  }] 
  await listCrawler.queue(crawlerparam)
  
  
}



// for(var i = globalPage;i <= 500;i++){
//   addQueue() 
// }
start()
var lasctCalledDate = new Date()
setInterval(function() {
  start()
  lasctCalledDate = new Date()
  console.log(`Now : ${new Date().toDateString()} Queue Size: ${listCrawler.queueSize}`) 
},60 * 60 * 1000)

setInterval(function() {
  var currentDate = new Date()
  var duration = ((new Date() - lasctCalledDate)  ) /100 /6 /60
  var nextCall =  60 - duration
  nextCall = Math.floor(nextCall)
  console.log(`Now : ${new Date().toString()} NextCall : ${nextCall}Min Left  Queue Size: ${listCrawler.queueSize}`) 
},60 * 1000)
