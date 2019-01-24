require('dotenv').config()
var {Song, sequelize} = require('./models')

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
async function getNoneImageSong(){
  const Op = sequelize.Op
  var song = await Song.findOne({
    where :{         
      albumImageUrl : {[Op.eq]: null},
      artist :{[Op.ne]: null}, 
      // album : {[Op.ne]: null},
      title : {[Op.ne]: null},
    },
    order: sequelize.random(),
    limit: 1,    
  })

  if(!song){
    return null;
  }else{
    var log = `
      id: ${song.id}  
      artist : ${song.artist}  
      title : ${song.title}      
      album : ${song.album}
      albumImageUrl : ${song.albumImageUrl}
    `  
    console.log(log)
    return song
  }
}
async function findImageFromItune(keyword){
  keyword = encodeURI(keyword);
  var api_url = `https://itunes.apple.com/search?term=${keyword}&country=JP&entity=song&lang=ja_jp&limit=1`
  var linkORequesToptions = {
    url: api_url       
  };
  var result = await requestGet(linkORequesToptions);   
  var data = JSON.parse(result.body)
  if(data && data.resultCount > 0 ){
    var imageObj = {
      artist : data.results[0].artistName,
      title : data.results[0].trackName,
      album : data.results[0].collectionName,
      albumImageUrl : data.results[0].artworkUrl100
    }
    return imageObj
  }else{
    return null;
  }
}
async function run(){
  try {
    var song = await getNoneImageSong()
    var keyword = `${song.artist} ${song.title}`    
    
    var imageObj  = await findImageFromItune(keyword);
    var isFound = false
    
    if(imageObj == null){          
      keyword = `${song.artist}`
      imageObj  = await findImageFromItune(keyword);
    }                
    song.album = song.album ? song.album : imageObj.album
    song.albumImageUrl = song.albumImageUrl ? song.albumImageUrl : imageObj.albumImageUrl
    var log = `
      id: ${song.id}  
      artist : ${song.artist}  
      title : ${song.title}      
      album : ${song.album}
      albumImageUrl : ${song.albumImageUrl}
    `  
    
    var dbSaveResult = await song.save();
    console.log(log)  
   
  } catch (error) {
    console.log(error)
  } 
}
run()
setInterval(function(){
  var randomTime = Math.floor(Math.random() * 10)
  console.log(`start after ${randomTime}sec..`)
  setTimeout(run, randomTime * 1000) 
}, 1000 * 10)
