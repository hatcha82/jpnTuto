var express = require('express');
var app = express();
var client_id = 'w7FsuKKmd0_0nh3h_yIb';
var client_secret = 'ONSQVwlB8B';
var state = "RAMDOM_STATE";
var redirectURI = encodeURI("http://127.0.0.1:3000/callback");
var api_url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirectURI}`;
var request = require('request');
var access_token ='';
var refresh_token = '';


function refreshToken(){
  var api_url = `https://nid.naver.com/oauth2.0/token?grant_type=refresh_token&client_id=${client_id}&&client_secret=${client_secret}&refresh_token=${refresh_token}`
  console.log(api_url)
  var options = {
      url: api_url,
      headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
  };
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {             
      var jsonBody = JSON.parse(body);
      access_token = jsonBody.access_token      
      console.log(jsonBody)
    } else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  });
}

setInterval(refreshToken, 1000 * 60 * 30)
app.get('/naverlogin', function (req, res) {
   res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
   res.end("<a href='"+ api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
 });
 app.get('/callback', function (req, res) {
    code = req.query.code;
    state = req.query.state;
    // api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
    //  + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state +'';

    api_url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirectURI}&code=${code}&state=${state}`
    var request = require('request');
    var options = {
        url: api_url,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
     };
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
        jsonBody = JSON.parse(body);
        access_token = jsonBody.access_token
        refresh_token = jsonBody.refresh_token        
      
        res.end(body);
      } else {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
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

 app.listen(3000, function () {
   console.log('http://127.0.0.1:3000/naverlogin app listening on port 3000!');
 });