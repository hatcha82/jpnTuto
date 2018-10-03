require('dotenv').config()
var request = require('request');
const {sequelize} = require('./models')
const config = require('./config/config')
const {Song} = require('./models')
var interval = 60 * 60 * 2; //2Hour
init()
function init(){
  run()
  setInterval(run, 1000 * interval)
}
async function run(param){

  const Op = sequelize.Op
  var song = await Song.findOne({
    where :{
      lyricsKor : null,
      title : {[Op.notLike]: '%\\%%'},
      artist: {[Op.notLike]: '%\\%%'}
    },
    order: [
      [sequelize.random()],
    ],
    limit: 1
  })
  
  var query = song.lyrics
  
  papago(query,function(returnObj){
    var lyricsKor = '';
    if(returnObj.message){
      console.log(`callback called`)
      lyricsKor = returnObj.message.result.translatedText 
     
    }else{
      lyricsKor = ''
    }
    
    console.log(`
      id : ${song.id}
      rank : ${song.rank}
      title : ${song.title}
      artist : ${song.artist}
      ${lyricsKor}
    `)

    Song.update({
      lyricsKor: lyricsKor,
    }, {
      where: { id: song.id }
    })
    .then(result =>{
      console.log(`result: ${result}  updated row song.id ${song.id} ,title ${song.title}` )
      
    })
    .catch(error =>{
      console.log(`result: ${error}  updated row song.id ${song.id} ,title ${song.title}` )
    })  
    
  });
  
    
}
async function papago(query, callbac){
  var client_id = process.env.NAVER_CLIENT_ID
  var client_secret = process.env.NAVER_CLIENT_SECRET
  var api_url = 'https://openapi.naver.com/v1/language/translate';
  var options = {
    url: api_url,
    form: {'source':'ja', 'target':'ko', 'text':query},
    headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
  };
  request.post(options, function (error, response, body) {

    if (!error && response.statusCode == 200) {
      console.log('Ok: Responsed')
      var returnObj = JSON.parse(body)
      
      callbac(returnObj)

      // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      // res.end(body);
    } else {
      var returnObj = JSON.parse(body)
      callbac(returnObj)
      // res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  });
}
