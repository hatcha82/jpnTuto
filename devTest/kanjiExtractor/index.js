require('dotenv').config()
var fs = require('fs');
var {Article} = require('./models')
const {sequelize} = require('./models')
const Kuroshiro = require('kuroshiro')
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji')
const kuroshiro = new Kuroshiro();
const jishoApi = require('unofficial-jisho-api');
const jisho = new jishoApi();
async function findArticle(){

  
  const Op = sequelize.Op
  var song = await Article.findOne({
    where :{                
      article : {[Op.ne]: null},     
    },
    order: sequelize.random(),
    limit: 1,
  })
  return song
}

async function init(){
  await kuroshiro.init(new KuromojiAnalyzer());
}
function requestGet(options) {
  return new Promise(resolve => {
    var request = require('request');
    request.get(options, function (error, response, body) {
      var returnObj = {
        error: error,
        response : response,
        body : body
      }
      resolve(returnObj);
    })
  })
}
function requestPost(options) {
  return new Promise(resolve => {
    var request = require('request');
    request.post(options, function (error, response, body) {
      var returnObj = {
        error: error,
        response : response,
        body : body
      }
      resolve(returnObj);
    })
  })
}
function findKanjiWordFromText(text){
  var wordList = []
  var textArray =  text.split('\n').join('').split('')
  var preChar = null
  var word = '';
  textArray.forEach(char => {
    var isKanji = Kuroshiro.Util.isKanji(char)
    if(isKanji){
      preChar = true
      word += char;
    }else{
      if(word != ''){
        wordList.push(word)
        word = ''
      }
    }
  });
  console.log(wordList)
}
function findUniqueKanjiList(text){
  var textArray =  text.split('\n').join('').split('')
  var uniqueChars = Array.from(new Set(textArray))
  var kanjiArray = []
  uniqueChars.forEach(char => {
    var isKanji = Kuroshiro.Util.isKanji(char)
    if(isKanji){
      kanjiArray.push(char)
    }    
  });
  return kanjiArray
}
async function transGlosbe(query){  
  var api_url = encodeURI(`https://glosbe.com/gapi/translate?from=ja&dest=ko&format=json&phrase=${query}&pretty=true`)
  var postingOption = {
    url: api_url    
  };   
  result = await requestGet(postingOption)  
  return result
}
async function transPapago(query){
  var api_url = 'https://openapi.naver.com/v1/papago/n2mt';
  var postingOption = {
    url: api_url,
    form: {'source':'en', 'target':'ko', 'text':query},
    headers: {'X-Naver-Client-Id':process.env.NAVER_CLIENT_ID, 'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET}
  };   
  result = await requestPost(postingOption)
  return result
}
async function kanjiInfomation(kanji){
  var kanjiDetail = await jisho.searchForKanji(kanji) 
  console.log(kanjiDetail.meaning) 
  //var transResult = await transGlosbe(kanji); 
  //console.log(transResult.body)
  //var JSONBody = JSON.parse(transResult.body)

  var papagoResult = await transPapago(kanjiDetail.meaning);
  var JSONBody = JSON.parse(papagoResult.body)
  console.log(JSONBody.message.result.translatedText)
  // for( var example of kanjiDetail.onyomiExamples){
  //   //var transResult = await transPapago(example.meaning);
  //   var transResult = await transGlosbe(example.meaning); 
  //   var JSONBody = JSON.parse(transResult.body)    
  //   console.log(JSONBody)
  //   //example.translateKor = JSONBody.result.translatedText    
  // }
  // for( var example of kanjiDetail.kunyomiExamples){
  //   //var transResult = await transPapago(example.meaning);
  //   var transResult = await transGlosbe(example.meaning); 
  //   var JSONBody = JSON.parse(transResult.body)    
  //   //example.translateKor = JSONBody.message.result.translatedText    
  // }
 
  return kanjiDetail
}
async function run(){

  var article = await findArticle()
  
  await init()
  var articleText = article.article
  var kanjiArray = findUniqueKanjiList(articleText)
  //findKanjiWordFromText(articleText)
    
  
  //kanjiArray = [kanjiArray[0]]
  console.log(kanjiArray)

  for( var kanji of kanjiArray){
    var result = await kanjiInfomation(kanji)  
  }
  
  //var result2 = await jisho.searchForPhrase('方向')
  //console.log(JSON.stringify(result2, null, 2))
}

run();