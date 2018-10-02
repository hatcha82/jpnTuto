var Crawler = require("crawler")
const Kuroshiro = require('kuroshiro')
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji')
const kuroshiro = new Kuroshiro()
const {sequelize} = require('./models')
const config = require('./config/config')
const {Song} = require('./models')

var listCrawler = new Crawler({
  maxConnections : 1,
  rateLimit: 1000 * 10,    
  callback : listCrawlerCallBack
});



function listCrawlerCallBack(error, res, done) {
  if(error){
      console.log(error)
  }else{
      var $ = res.$;
      // $ is Cheerio by default
      //a lean implementation of core jQuery designed specifically for the server
      var lyrics = $(".h60")            
      var debug= true
      lyrics.each(function(){

        if(debug){
          var $rank = $(this).find(".rno")
          var $title = $(this).find(".mid")
          var $artist = $(this).find(".sml").find('a')
          var $albumImg =$(this).find(".i6l")
          var album = $albumImg.attr('alt')
          var albumImgSrc = $albumImg.attr('src') ? $albumImg.attr('src').replace('._SL75_','') : null
          var $lyricsLink = $title.find('a')
          console.log(`http://j-lyric.net${$lyricsLink.attr('href')}`)
          //listCrawler.queue(`http://j-lyric.net/lyric${lyricsLink}`)
  
          // var optionParam = {
          //   rank : $rank.text(),
          //   title : $title.text(), 
          //   artist : $artist.text(),
          //   album : album,
          //   albumImgSrc : albumImgSrc
          // }
          var optionParam = {
            title: $title.text(), 
            artist: $artist.text(),
            genre: 'J-pop',
            album: album,
            albumImageUrl: albumImgSrc,
            youtubeId: null,
            lyrics:null,
            tab: null,
            rank: $rank.text()
          }
          var crawlerparam = [{
            uri: `http://j-lyric.net${$lyricsLink.attr('href')}`,                        
            callback: lyricsCallback,
            param : optionParam
          }]
          listCrawler.queue(crawlerparam) 
          debug = true
        }
    })
      
  }
  done();
}
async function lyricsCallback(error, res, done) {
  if(error){
    console.log(error);
  }else{
    var $ = res.$;
    var optionParam = res.options.param;
    var $lyric = $("#Lyric")
    var lyricHtml = $lyric.html()
    lyricHtml =lyricHtml.replace(/<br>/g,'\n')
    var lyricsText = $(`<p>${lyricHtml}</p>`).text();
    var furigana = await kuroshiro.convert(lyricsText, {mode: 'furigana', to: 'hiragana', romajiSystem: 'passport'})
    optionParam.lyrics = lyricsText
    optionParam.tab = furigana
    var newSong = optionParam

    console.log(`
      rank : ${newSong.rank}
      title : ${newSong.title}
      artist : ${newSong.artist}
      album : ${newSong.album}
      albumImageUrl : ${newSong.albumImageUrl}
      youtubeId : ${newSong.youtubeId}
    `)
    newSong.createdUserId=3
    newSong.updatedUseId=3            
    Song.create(newSong)
    .then(result =>{
      console.log(result.dataValues.id)
    })
    .catch(error =>{
      console.log(error)
    })  

    /*

    var youtube = `https://www.google.co.kr/search?q=${optionParam.artist}+${optionParam.title}+site:youtube.com`
    youtube = encodeURI(youtube);  
   
    var crawlerparam = [{
      uri: youtube,                        
      callback: getYoutubeId,
      param : optionParam
    }]    
    listCrawler.queue(crawlerparam) 
    console.log(`[${optionParam.rank}] ${optionParam.artist}+${optionParam.title} : ${youtube} added\n`)    
    // var newSong = {
    //   title: optionParam.title,
    //   artist: optionParam.artist,
    //   genre: 'J-pop',
    //   album: optionParam.album,
    //   albumImageUrl: optionParam.albumImgSrc,
    //   youtubeId: null,
    //   lyrics: optionParam.lyricsText,
    //   tab:  optionParam.furigana
    // }
    // console.log(newSong);
    //const song = await Song.create(req.body)
    */
    
  }
  done();
}
function getYoutubeId(error, res, done){
  console.log(error)
  if(error){
    console.log(error)
  }else{
      var $ = res.$;
      var optionParam = res.options.param;
      var $a = $('a')
      var one = true;
      var youTubuId 
    
      $a.each(function(){
        console.log($(this).attr('href'))
        if(one){
          var  href = $(this).attr('href')
          
          href = decodeURIComponent(decodeURIComponent(href))
          var findString ="https://www.youtube.com/" 
          console.log(href)
          if(href.indexOf(findString) !=-1){
            //console.log($(this).text())
            youTubuId = href.replace(findString,'').split('&')[0]
            console.log(youTubuId)
            optionParam.youtubeId =youTubuId   
            var newSong = optionParam

            console.log(`
              rank : ${newSong.rank}
              title : ${newSong.title}
              artist : ${newSong.artist}
              album : ${newSong.album}
              albumImageUrl : ${newSong.albumImageUrl}
              youtubeId : ${newSong.youtubeId}
            `)
            newSong.createdUserId=3
            newSong.updatedUseId=3            
            // Song.create(newSong)
            // .then(result =>{
            //   console.log(result.dataValues.id)
            // })
            // .catch(error =>{
            //   console.log(error)
            // })                      
            one = false           
          }
        }
      })
         
  }
  done();
}

async function start(){
  await kuroshiro.init(new KuromojiAnalyzer());
  var result = await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
  console.log(`Kuroshiro Started... \n ${result}`)
  result = await sequelize.sync({force: false})
  console.log(`DB Started... \n ${result}`)
  // var song = await Song.findOne({
  //   attributes: [[Song.sequelize.fn('COUNT', Song.sequelize.col('id')), 'count']],    
  // })
  // console.log(song.dataValues.count)
  // console.log(`Song Count ${song.dataValues.count}`) 
  addQueue()   
}
async function addQueue(){   
  await listCrawler.queue(`http://j-lyric.net/lyric/p${globalPage}.html`)
  console.log(`http://j-lyric.net/lyric/p${globalPage}.html`)
  globalPage++
}
var globalPage = 356
start()

// for(var i = globalPage;i <= 500;i++){
//   addQueue() 
// }

var term = setInterval(function() {
  if(globalPage <= 500){
    addQueue() 
    console.log(globalPage + 'pages added') 
  }else{
    clearInterval(term)
  }
}, 60 * 1000)

setInterval(function() {
  console.log(`globalPage : ${globalPage} Queue Size: ${listCrawler.queueSize}`) 
},10*1000)

