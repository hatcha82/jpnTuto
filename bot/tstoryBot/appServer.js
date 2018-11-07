require('dotenv').config()
var fs = require('fs');
var download = require('download-file')
var uploader = require('base64-image-upload');
var image2base64 = require('image-to-base64');
var express = require('express');
var app = express();
var client_id = '3caa6a7e4805246c090dab84ac0580de';
var client_secret = '3caa6a7e4805246c090dab84ac0580de02283130523d46f487e3a2ce398e6a8da9297fe5';
var state = "RAMDOM_STATE";
var redirectURI = encodeURI("http://127.0.0.1:3002/callback");
var api_url = `https://www.tistory.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirectURI}&response_type=code`;
var request = require('request');
var access_token ='';
var refresh_token = '';
var {Song} = require('./models')
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


var template = fs.readFileSync('blogtemplate.html', 'utf-8');
//setInterval(refreshToken, 1000 * 60 * 30 ) //1hour
setInterval(function(){
  var ranTime = Math.floor((Math.random() * 10) + 1)
  setTimeout(() => {
    runPost()
  }, ranTime) 
}, 1000 * 60 * 90)
runPost()
async function runPost(){
  var song = await findSong();
  if(!song) {
    console.log(`No Song found for uploading`)
    return;
  }
  var newTemplate = template.replace('[[title]]', song.title)
  newTemplate = newTemplate.replace('[[artist]]',song.artist)
  newTemplate = newTemplate.split("[[id]]").join(song.id)
  newTemplate = newTemplate.split("[[albumImageUrl]]").join(song.albumImageUrl)  
  newTemplate = newTemplate.replace('[[youtubeId]]',song.youtubeId)


  var furigana = song.tab;
  furigana =  furigana.replace(/\n/g,'<br>')
  newTemplate = newTemplate.replace('[[furigana]]',furigana)
  
  var lyricsKor = song.lyricsKor;
  if(lyricsKor){
    lyricsKor =  lyricsKor.replace(/\n/g,'<br>')
    newTemplate = newTemplate.replace('[[lyricsKor]]',lyricsKor)
  }

  var api_url = 'https://www.tistory.com/apis/post/write'
  var postOption = {
    url: api_url,    
    form: {
      access_token:'da7a64ff1ec2eccca06b1b2907948b34_c906903066e671e1dc5ba3df1bcb19b0',
      output:'json',
      blogName:'furigana-hub',
      title:`[ J-Pop : ${song.artist} ] ${song.title}`,
      content:newTemplate,
      visibility:3,
      category:819448,
      tag:`${song.title},${song.artist},일본노래가사,furiganahub,jpop,일본노래추천`
    }
  };
  var postResult = await requestPost(postOption)
  JSONBody = JSON.parse(postResult.body);
  
  var updateResult = null
  try {
    if(JSONBody.tistory.status == '200'){
     
      song.tstoryUpload = 'Y' 
      song.tstoryRefId = JSONBody.tistory.postId
      updateResult = await uploadTstoryResult(song)  
    }else{
      console.log(JSONBody.tistory.error_message)
    }  
  } catch (error) {
    song.tstoryUpload = 'E'
    updateResult = await uploadTstoryResult(song)  
  }

  //819726 test category
  // id": "819448",
  //                   "name": "일본노래 가사(J-pop)",
  //                   "parent": "",
  //                   "label": "일본노래 가사(J-pop)",
}


  

async function findSong(){
  const Op = sequelize.Op
  var song = await Song.findOne({
    where :{          
      tstoryUpload : 'N', 
      albumImageUrl : {[Op.ne]: null},
      lyricsKor : {[Op.ne]: null}
    },
    order: sequelize.random(),
    limit: 1,
  })
  return song
}

async function uploadTstoryResult(song) {  
  Song.update({
    tstoryUpload: song.tstoryUpload,
    tstoryRefId: song.tstoryRefId
  }, {
    where: { id: song.id }
  })
  .then(result =>{
    console.log(`result: ${result} tstoryUpload : ${song.tstoryUpload} ${song.tstoryRefId} updated row song.id ${song.id} ,title ${song.title}` )    
    return result
  })
  .catch(error =>{
    console.log(`result: ${error}  updated row song.id ${song.id} ,title ${song.title}` )
    return null
  })    
}


function refreshToken(){
  var api_url = `https://kauth.kakao.com/oauth/token?grant_type=refresh_token&client_id=${client_id}&&client_secret=${client_secret}&refresh_token=${refresh_token}`
  console.log(api_url)
  var options = {
      url: api_url,      
  };
  request.post(options, function (error, response, body) {
    console.log(body)
    if (!error ) {             
      var jsonBody = JSON.parse(body);
      access_token = jsonBody.access_token      
      console.log(jsonBody)
    } else {
      //res.status(response.statusCode).end();
      console.log('error = ' + error);
    }
  });
}


app.get('/tstorylogin', function (req, res) {
   res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
   res.end("<a href='"+ api_url + "'>Tstory Login</a>");
 });
 app.get('/callback', function (req, res) {
    code = req.query.code;
    state = req.query.state;    
    api_url = `https://www.tistory.com/oauth/access_token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirectURI}&code=${code}`
    
    var request = require('request');
    var options = {
        url: api_url,        
     };
    request.post(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});        
        access_token =body.replace(`access_token=`,'')        
        res.end(body);
      } else {
        res.end(body)
        console.log('error = ' + response.body);
      }
    });
  });
 app.listen(3002, function () {
   console.log('http://127.0.0.1:3002/tstorylogin app listening on port 3002!');
 });