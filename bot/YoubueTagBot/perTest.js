var Crawler = require("crawler")
const {sequelize} = require('./models')
const config = require('./config/config')
const {Song} = require('./models')

var youTubeCrawler = new Crawler({
  maxConnections : 1,
  rateLimit: 1000 * 10,    
  callback : youTubeCrawlerCallBack
});

function youTubeCrawlerCallBack(error, res, done){
  
  if(error){
    console.log(error)
  }else{
      var $ = res.$;
      var optionParam = res.options.param;
      var $a = $('a')
      var one = true;
      var youTubuId 
      var findString ="/url?q=https://www.youtube.com/watch?v=" 
      $a.each(function(){
        var  href = $(this).attr('href')        
        if(one){
          var  href = $(this).attr('href')
          href = decodeURIComponent(decodeURIComponent(href))
          if(href.indexOf(findString) !=-1){
            console.log(href)
            youTubuId = href.replace(findString,'').split('&')[0]
            optionParam.youtubeId =youTubuId   
            var song = optionParam
           
            song.createdUserId=3
            song.updatedUserId=3 
            
            Song.update({
              youtubeId: youTubuId,
              updatedUserId : 3,
			  updatedAt : new Date()
            }, {
              where: { id: song.id }
            })
            .then(result =>{
              console.log(result)
              console.log(`
              id : ${song.id}
              rank : ${song.rank}
              title : ${song.title}
              artist : ${song.artist}
              album : ${song.album}
              albumImageUrl : ${song.albumImageUrl}
              youtubeId : ${song.youtubeId}
            `)
            })
            .catch(error =>{
              console.log(error)
            })                      
            
            one = false           
          }
        }
      })
         
  }
  done();
}
var tryCount = 0;
async function start(){
  
  result = await sequelize.sync({force: false})
  console.log(`DB Started... \n`)
  addQueue()   
}

async function addQueue(){   
  const Op = sequelize.Op
  var song = await Song.findOne({
    where :{
      youtubeId : null,
      title : {[Op.notLike]: '%\\%%'},
      artist: {[Op.notLike]: '%\\%%'}
    },
    limit: 10
  });
  console.log(song)
  
}
console.log(console.log(`${new Date()} Queue Size: ${youTubeCrawler.queueSize}`) )

start()

var term = setInterval(function() {
  console.log(`${new Date()} Queue Size: ${youTubeCrawler.queueSize}`) 
  addQueue() 
}, 60 * 1000)


