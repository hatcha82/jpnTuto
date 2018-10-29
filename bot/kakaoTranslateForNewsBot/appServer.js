require('dotenv').config()
var fs = require('fs');
var download = require('download-file')
var uploader = require('base64-image-upload');
var image2base64 = require('image-to-base64');
var express = require('express');
var app = express();
var client_id = '70be1c3c37aeab0f3b215ca8731cc36a';
var client_secret = 'ONSQVwlB8B';
var state = "RAMDOM_STATE";
var redirectURI = encodeURI("http://127.0.0.1:3001/callback");
var api_url = `https://kauth.kakao.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirectURI}&response_type=code`;
var request = require('request');
var access_token ='';
var refresh_token = '';
var {Article} = require('./models')
const {sequelize} = require('./models')
function requestUpload(options) {
  return new Promise(resolve => {
    var image = options.base64Img //'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
    uploader.setApiUrl(options.url);
    uploader.upload(image, {headers: options.header}, function(error, response){
      var returnObj = {
        error: error,
        response : response
      }
      resolve(returnObj);
    })
  })
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
function downloadFile(url, options){
  
  return new Promise(resolve => {
    download(url, options, function(err){
      resolve(err); 
    }) 
  })
}
async function getArticle(){
      
  const Op = sequelize.Op
  var article = await Article.findOne({
    where :{            
      translateText : {[Op.eq]: null}
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
async function updataArticle(article){
      
  const Op = sequelize.Op
  var article = await Article.findOne({
    where :{            
      translateText : {[Op.eq]: null}
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
async function translate(article){
  var api_url = `https://kapi.kakao.com/v1/translation/translate`
  var header  = "KakaoAK " + client_id; // Bearer 다음에 공백 추가
  var title = article.title
  var template = `${title}\n${article.article}`
  console.log(template)
  var linkPostingOption = {
    url: api_url,
    headers: {'Authorization': header},
    form: {query : template , src_lang :'jp', target_lang:'kr'}, 
  };
  var JSONBody
  try {
    var result = await requestPost(linkPostingOption)
    JSONBody = JSON.parse(result.body)
  } catch (error) {
    console.log(error)
    JSONBody = null;
  }  
  return JSONBody
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
console.log("Started")
async function run(){
  var article
  try {
    article = await getArticle()    
  } catch (error) {
    console.log(`Error 발생: ${error}`)
    return;
  }
  var result = await translate(article)
  if(result.msg){
    console.log(`Api Error : [Code : ${result.code}] Msg : ${result.msg}`)
  }else{
    
    article.titleTranslate = result.translated_text.shift()
    article.titleTranslate = article.titleTranslate.join('')
    article.translateText = result.translated_text.join('\n');  

    var updateResult =  await updateArticle(article)    
  } 
  
}
run()
setInterval(run, 1000 * 60 * 10)




