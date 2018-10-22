require('dotenv').config()
var Twitter = require('twitter');
var twitterText = require('twitter-text')
var config = require('./config/config')
const jishoApi = require('unofficial-jisho-api');
const image2base64 = require('image-to-base64');
const jisho = new jishoApi();
var fs = require('fs');
const {sequelize} = require('./models/')
const {Kanji} = require('./models')

sequelize.sync({force: false})
.then(() => {
  console.log(`DB is connected...`)
  botRun()
  var internval = 20
  setInterval(botRun,1000 * internval)
})


var word = '日'

async function botRun(){
  var kanjis = await Kanji.findAll({
    where: {
      strokeOrderGifUri: null
    },
    limit : 1,
  })
  
  word = kanjis[0].kanji;


  try {
    var result = await jisho.searchForKanji(word)
    console.log('1.Jisho Ok')
    // var strokeOrderDiagramB64 = await image2base64(result.strokeOrderDiagramUri) // GIF
    // var strokeOrderSvgb64 = await image2base64(result.strokeOrderSvgUri) // GIF
    var twitText = `
漢字 : ${result.query}
JLPT Levl :  ${result.jlptLevel}
音読 :  ${result.onyomi}
例) 
[[kunyomiExamples]]
訓読 : ${result.kunyomi}
例) 
[[onyomiExamples]]
意味: ${result.meaning}
#Jisho
    `
    
    var template = ''
    result.kunyomiExamples.forEach( (examObj,index) =>{
      if(index < 1){
        var example = `${examObj.example} (${examObj.reading})\n`;
        template += example
      }
    })
    twitText =  twitText.replace('[[kunyomiExamples]]',template)
    template = ''
    result.onyomiExamples.forEach( (examObj,index) =>{
      if(index < 1){
        var example = `${examObj.example} (${examObj.reading})\n`;
        template += example
      }
    })
    twitText =  twitText.replace('[[onyomiExamples]]',template)
    
    console.log("Tweet!!")
    var updatedAt = new Date()
    Kanji.update({
      strokeOrderGifUri : result.strokeOrderGifUri
    }, {
      where: { id: kanjis[0].id }
    })
    .then(result =>{
      console.log(`Db Id: ${kanjis[0].id} / ${kanjis[0].kanji} UpdatedAt :${new Date().toString()}`)
      console.log(result)
    })
    .catch(error =>{
      console.log(error)
    }) 
    
  } catch (error) {
    console.log(error)
  }
}

/*
jisho.searchForKanji(word).then(result => {
  console.log(JSON.stringify(result))
  var jsonString = JSON.stringify(result, null, 2);
  var imageUploadResult = await image2base64(result.strokeOrderGifUri) // you can also to use url
  console.log(imageUploadResult)




  
  //updateTwitStatus(twitText + " " + new Date().toString())
  console.log(twitText)

  // fs.writeFile(`${word}.json`, jsonString, 'utf8', function(err) {
  //   console.log(`${word}.json 완료`);
  // });

})
*/
var client = new Twitter({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token_key:config.twitter.access_token_key,
  access_token_secret :config.twitter.access_token_secret
})
async function uploadMeidaToTweeter(base64){
  return await client.post('media/upload', {media_data: base64})
}
function updateTwitStatus(text){
  client.post('statuses/update', {status: text},  function(error, tweet, response) {
    if(error){
      console.log('Error: ' + JSON.stringify(error))
    }else{
      console.log(tweet);  // Tweet body.
    }
    
    //console.log(response);  // Raw response object.
  });
}

function getUserTimeLine(){
  var params = {screen_name: 'nodejs'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      tweets.forEach(tweet => {
        console.log(tweet.text);  
      });
    }else{
      console.log(error)
    }
  });
}


