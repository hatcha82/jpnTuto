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


async function uploadKakaoStroyWithLink(){
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
  link_info = JSON.stringify(link_info)
  
  api_url = `https://kapi.kakao.com//v1/api/story/post/link`
  var linkPostingOption = {
    url: api_url,
    form: {link_info:link_info, content:template ,permission : 'M'}, // 'M' 비공개 / A 전체 F 친:
    headers: {'Authorization': header}
  };

  result = await requestPost(linkPostingOption);
  var jsonError= JSON.parse(result.error);
  var jsonBody= JSON.parse(result.body);
  // console.log(!jsonError && jsonBody.id)
  // console.log(jsonError)
  // console.log(jsonBody)
  var kakaoUpload = 'Y'
  if(!jsonError && jsonBody.id){
    try {
      kakaoRefId = jsonBody.id;
      console.log(`kakaoRefId : ${kakaoRefId}`)
      kakaoUpload = 'Y'
    } catch (error) {
      console.log(error)
      kakaoUpload = 'E'
    }
    console.log(naverBlogRefNo)
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
      kakaoRefId: 'E',
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

setInterval(refreshToken, 1000 * 60 * 30 ) //1hour
setInterval(function(){
  var ranTime = Math.floor((Math.random() * 10) + 1)
  setTimeout(() => {
    uploadKakaoStroyWithLink()
  }, ranTime) 
}, 1000 * 60 * 60)
app.get('/kakaologin', function (req, res) {
   res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
   res.end("<a href='"+ api_url + "'>Kakao Login</a>");
 });
 app.get('/callback', function (req, res) {
    code = req.query.code;
    state = req.query.state;
    // api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
    //  + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state +'';
   
    api_url = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${client_id}&redirect_uri=${redirectURI}&code=${code}`
    var request = require('request');
    var options = {
        url: api_url,
        //headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
     };
    request.post(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
        
        jsonBody = JSON.parse(body);
        console.log(jsonBody)
        access_token = jsonBody.access_token
        refresh_token = jsonBody.refresh_token        
        uploadKakaoStroyWithLink()
        res.end(body);
      } else {
        res.end(body)
        console.log('error = ' + response.body);
      }
    });
  });
  app.get('/blog/post', function (req, res) {
    var title = "네이버 블로그 api Test node js";
    var contents = "<span style='color:blue'>네이버 블로그 api로 글을 블로그에 올려봅니다.</span>";

    var api_url = 'https://openapi.naver.com/blog/writePost.json';
    var request = require('request');
    var header = "Bearer " + access_token; // Bearer 다음에 공백 추가
    var options = {
        url: api_url,
        form: {'title':title, 'contents':contents},
        headers: {'Authorization': header}
     };
    request.post(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
        res.end(body);
      } else {
        console.log('error');
        if(response != null) {
          res.status(response.statusCode).end();
          console.log('error = ' + response.statusCode);
        }
      }
    });
  });
  app.get('/blog/category', function (req, res) {
   
    var header = "Bearer " + access_token; 
    console.log(header)
    var api_url = 'https://openapi.naver.com/blog/listCategory.json';
    var request = require('request');
    var options = {
        url: api_url,
        headers: {'Authorization': header}
     };
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
        res.end(body);
      } else {
        console.log('error');
        if(response != null) {
          res.status(response.statusCode).end();
          console.log('error = ' + response.statusCode);
        }
      }
    });
  });

 app.listen(3001, function () {
   console.log('http://127.0.0.1:3001/kakaologin app listening on port 3000!');
 });