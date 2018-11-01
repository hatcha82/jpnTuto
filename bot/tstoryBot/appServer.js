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

async function test(){
  var song = await findSong();
  
  console.log(`${song.id} ${song.title}-${song.artist}`)

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
      visibility:0,
      category:819726,
      tag:'furiganahub,jpop,일본노래추천'
    }
  };
  var postResult = await requestPost(postOption)
  console.log(JSON.parse(postResult.body))
  //819726 test category
  // id": "819448",
  //                   "name": "일본노래 가사(J-pop)",
  //                   "parent": "",
  //                   "label": "일본노래 가사(J-pop)",
}
test()

  

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

async function uploadKakaoStroyWithLink() {
  const Op = sequelize.Op
  var song = await Song.findOne({
    where :{     
      kakaoUpload : 'N', 
      albumImageUrl : {[Op.ne]: null},
      lyricsKor : {[Op.ne]: null}
    },
    limit: 1,
  })
  if(!song){
    return;
  }

  console.log("1.Upload Started..")
  var header = "Bearer " + access_token; // Bearer 다음에 공백 추가

  var linkUrl  =`http://www.furiganahub.com:8080/song/meta/${song.id}`
  var api_url = `https://kapi.kakao.com/v1/api/story/linkinfo?url=${linkUrl}`
  var linkORequesToptions = {
    url: api_url,    
    headers: {'Authorization': header}
  };
  var template = 
  `
http://www.furiganahub.com 
가수 : ${song.artist}
노래 : ${song.title}
${song.lyrics.length > 1800 ? song.lyrics.substring(0,1800) + '...더 보기' : song.lyrics}

https://blog.naver.com/hatcha82
  `
  template = template.split("[[title]]").join(song.title)
  template = template.split("[[artist]]").join(song.artist)
  var result = await requestGet(linkORequesToptions);  
  
  var link_info = JSON.parse(result.body)
  link_info.host = 'http://www.furiganahub.com'
  link_info.requested_url = `http://www.furiganahub.com/music/detail/${song.id}`
  link_info.url = `http://www.furiganahub.com/music/detail/${song.id}`
  link_info.description = `지금 [${song.artist}] ${song.title}을 Furigana Hub에서 한자와 히라가나와 함께 읽으면서 일본어를 배워보세요.`
  link_info = JSON.stringify(link_info)
  
  api_url = `https://kapi.kakao.com//v1/api/story/post/link`
  var linkPostingOption = {
    url: api_url,
    form: {link_info:link_info, content:template ,permission : 'A'}, // 'M' 비공개 / A 전체 F 친:
    headers: {'Authorization': header}
  };

  result = await requestPost(linkPostingOption);
  console.log(JSON.parse(result.body))
  var jsonError= JSON.parse(result.error);
  var jsonBody= JSON.parse(result.body);
  // console.log(!jsonError && jsonBody.id)
  // console.log(jsonError)
  // console.log(jsonBody)
  
  var kakaoUpload = 'Y'
  if(jsonBody.id){
    try {
      kakaoRefId = jsonBody.id;
      console.log(`kakaoRefId : ${kakaoRefId}`)
      kakaoUpload = 'Y'
    } catch (error) {
      console.log(error)
      kakaoUpload = 'E'
    }
    console.log(kakaoRefId)
    Song.update({
      kakaoUpload: kakaoUpload,
      kakaoRefId: kakaoRefId
    }, {
      where: { id: song.id }
    })
    .then(result =>{
      console.log(`result: ${result}  updated row song.id ${song.id} ,title ${song.title}` )
      
    })
    .catch(error =>{
      console.log(`result: ${error}  updated row song.id ${song.id} ,title ${song.title}` )
    })  
  } else {
    Song.update({
      kakaoUpload: 'E',
    }, {
      where: { id: song.id }
    })
    .then(result =>{
      console.log(`Error result: ${result}  updated row song.id ${song.id} ,title ${song.title}` )
      
    })
    .catch(error =>{
      console.log(`Db Error result: ${error}  updated row song.id ${song.id} ,title ${song.title}` )
    })  
  }
}
async function uploadBlog(){
      
  const Op = sequelize.Op
  var song = await Song.findOne({
    where :{      
      albumImageUrl : {[Op.ne]: null},
      lyricsKor : {[Op.ne]: null}
    },
    limit: 1,
  })
  if(!song){
    return;
  }

  console.log("1.Upload Started..")
  var header = "Bearer " + access_token; // Bearer 다음에 공백 추가

  var linkUrl  =`http://www.furiganahub.com:8080/song/meta/${song.id}`
  var api_url = `https://kapi.kakao.com/v1/api/story/linkinfo?url=${linkUrl}`
  var linkORequesToptions = {
    url: api_url,    
    headers: {'Authorization': header}
  };
/*
  var url = song.albumImageUrl
  var filename = ''
  if(song.albumImageUrl.toUpperCase().indexOf('JPG') != -1){
    filename = 'temp.jpg'
  }else{
    filename = 'temp.png'
  }
  var options = {
      directory: "./",
      filename: filename
  }

  //var filedownResult = await downloadFile(url,options)
  //console.log(filedownResult)

  const uploadOption = {
    url: "https://kapi.kakao.com/v1/api/story/upload/multi",    
    headers: {
        'Authorization': header,
        "Content-Type": "multipart/form-data"
    },
    formData : {
        "file" : fs.createReadStream("./temp.jpg")
    }
};
var imagUploadResult = await requestPost(uploadOption);
console.log('return '  + JSON.stringify(imagUploadResult))
  */
  var template = 
  `
http://www.furiganahub.com 
가수 : ${song.artist}
노래 : ${song.title}

${song.lyrics}

https://blog.naver.com/hatcha82

  `
  template = template.split("[[title]]").join(song.title)
  template = template.split("[[artist]]").join(song.artist)
  var result = await requestGet(linkORequesToptions);  
  var link_info = JSON.parse(result.body)
  link_info.host = 'http://www.furiganahub.com'
  link_info.requested_url = `http://www.furiganahub.com/music/detail/${song.id}`
  link_info.url = `http://www.furiganahub.com/music/detail/${song.id}`
  link_info.description = `지금 [${song.artist}] ${song.title}을 Furigana Hub에서 한자와 히라가나와 함께 읽으면서 일본어를 배워보세요.`
  //link_info.title = "FuriganaHub"  
  //link_info.description = `80년도에서 최신 J-pop 7000여곡의 노래를 후리가나를 읽으면서 일본어를 배울 수있습니다. 후리가나, 원곡가사, 번역 그리고 관련 유튜브 동영상을 보면서 노래와 일본어 읽기를 시작하세요.`;
  //link_info.image = JSON.parse(imagUploadResult.body) 
  link_info = JSON.stringify(link_info)
  
  api_url = `https://kapi.kakao.com//v1/api/story/post/link`
  var linkPostingOption = {
    url: api_url,
    form: {link_info:link_info, content:template ,permission : 'M'}, // 'M' 비공개 / A 전체 F 친:
    headers: {'Authorization': header}
  };

  result = await requestPost(linkPostingOption);
  //var image_url_list = JSON.parse(imagUploadResult.body);
  // console.log('이미지 리스트')
  //console.log(image_url_list)
  // api_url = `https://kapi.kakao.com//v1/api/story/post/photo`
  // var linkPostingOption = {
  //   url: api_url,
  //   form: {image_url_list: imagUploadResult.body, content:template ,permission : 'M'}, // 'M' 비공개 / A 전체 F 친:
  //   headers: {'Authorization': header}
  // };

  // result = await requestPost(linkPostingOption);
  console.log(result.error)
  console.log(result.body)
  return;
  request.post(options, function (error, response, body) {
    
   

    if (!error && response.statusCode == 200) {
      console.log('Blog Uploaded')
      var jsonBody
      var naverBlogRefNo
      var naverBlogUpload = 'Y'
      try {
        jsonBody= JSON.parse(body);
        console.log(jsonBody.message)
        naverBlogRefNo = jsonBody.message.result.logNo;
        console.log(`naverBlogRefNo : ${naverBlogRefNo}`)
      } catch (error) {
        console.log(error)
        naverBlogUpload = 'E'
      }
      console.log(naverBlogRefNo)
      Song.update({
        naverBlogUpload: naverBlogUpload,
        naverBlogRefNo: naverBlogRefNo
      }, {
        where: { id: song.id }
      })
      .then(result =>{
        console.log(`result: ${result}  updated row song.id ${song.id} ,title ${song.title}` )
        
      })
      .catch(error =>{
        console.log(`result: ${error}  updated row song.id ${song.id} ,title ${song.title}` )
      })  
    } else {
      Song.update({
        naverBlogUpload: 'E',
      }, {
        where: { id: song.id }
      })
      .then(result =>{
        console.log(`result: ${result}  updated row song.id ${song.id} ,title ${song.title}` )
        
      })
      .catch(error =>{
        console.log(`result: ${error}  updated row song.id ${song.id} ,title ${song.title}` )
      })  
      if(response != null) {
        
      }
    }
  });
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

//setInterval(refreshToken, 1000 * 60 * 30 ) //1hour
// setInterval(function(){
//   var ranTime = Math.floor((Math.random() * 10) + 1)
//   setTimeout(() => {
//     uploadKakaoStroyWithLink()
//   }, ranTime) 
// }, 1000 * 60 * 60)
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