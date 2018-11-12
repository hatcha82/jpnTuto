require('dotenv').config()
const config = require('./config/config')
var {Song,Artist,sequelize} = require('./models')
const Op = sequelize.Op
const Kuroshiro = require('kuroshiro')
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji')
const kuroshiro = new Kuroshiro()
const puppeteer = require('puppeteer')
var browser = null;
//var pageNo = 1
var maxPage = 500;

async function init(){
  sequelize.sync({force: false})
  .then(() => {
    console.log(`DB Server started on port ${config.db.options.host}`)
  })

  await kuroshiro.init(new KuromojiAnalyzer());
  browser = await puppeteer.launch({headless: true});
}
async function findOrCreateSong(song) {
  song.createdUserId=3
  song.updatedUseId=3   

  const [instance, wasCreated] = await Song.findOrCreate({ where: { artist: song.artist , title: song.title} , defaults : song });
  if(!wasCreated){    
    instance.artistId = song.artistId
    instance.songLink = song.songLink
    await instance.save();
  }

  return [instance, wasCreated];
}
async function findOrCreateArtist(artist) {
  artist.artist = artist.artistKanjiName
  artist.createdUserId=3
  artist.updatedUseId=3   
  const [instance, wasCreated] = await Artist.findOrCreate({ where: { artist: artist.artistKanjiName} , defaults : artist });
  return [instance, wasCreated];
}


async function run(){
  await init() 
  try {
  

    for(var pageNo = 1 ; pageNo <= maxPage;pageNo++ ){      
      var linkAddress = `http://j-lyric.net/artist/p${pageNo}.html`
      var page = await browser.newPage();
      await page.goto(linkAddress,  {waitUntil: 'networkidle2'});
      //var pagingInfo = await getPagingInfo(page)
      var artistInfoList = await getArtistInfo(page)      
      for(artist of artistInfoList){
        
        const [artistInstance, artistCreated] = await findOrCreateArtist(artist) 
        

        //console.log(`created result : ${artistCreated}`)
        //console.log(artistInstance)          
        var songList = await getSongsByArtist(artist.artistLink)
        for(song of songList){
          
          try {
            var songLyric = await getSongLyric(song.songLink)
            song.artist = artist.artistKanjiName;
            song.lyrics = songLyric;
            song.tab = await kuroshiro.convert(songLyric, {mode: 'furigana', to: 'hiragana', romajiSystem: 'passport'})
            song.artistId = artistInstance.id          
            const [songInstance, songCreated] = await findOrCreateSong(song) 
            console.log(`[pageNo: ${pageNo}][Created : ${songCreated}] Artist : ${song.artist} Song id : ${songInstance.id} Title : ${song.title}`)
          } catch (error) {
            console.log('Error 발생: ')
            console.log(song)
          }                    
        }
      }

      page.close();
    }    
  } catch (error) {
    console.log(error)
  }
  //await browser.close();  
  
}

run()
async function getSongsByArtist(artistLink){
  var page = await browser.newPage();
  await page.goto(artistLink,  {waitUntil: 'networkidle2'});  
  var songList = await getSongList(page)  
  page.close();
  return songList;
}

async function getSongList(page){ 
  var param = {
    selector : '.bdy'
  }  
  await page.waitForSelector(param.selector);  
  var songList = await page.evaluate( param => {      
      var divTags =  Array.from(document.querySelectorAll(param.selector));
      var songList = []
      for(divTag  of divTags){
        if(divTag.id){
          var songInfo = {
            title : divTag.querySelector('p.ttl a').textContent,
            genre : 'J-pop',
            album :  divTag.querySelector('img') ? divTag.querySelector('img').alt : null,
            youtubeId : null,
            tab: null,
            lyricsKor: null,
            songLink : divTag.querySelector('p.ttl a').href,
            albumImageUrl :  divTag.querySelector('img') ? divTag.querySelector('img').src : null
          }         
          songList.push(songInfo)
        }
      }
      return songList
  }, param);
 
  return songList
}
async function getSongLyric(songLink){
  
  var page = await browser.newPage();

  await page.goto(songLink,  {waitUntil: 'networkidle2'});    
  var param = {
    selector :'p#Lyric'
  }  
  await page.waitForSelector(param.selector);  
  var songLyric = await page.evaluate(param => {      
      var songLyricTag =  document.querySelector(param.selector)
      return songLyricTag.textContent
  }, param);  
  var randomTime = Math.floor((Math.random() * 10) + 1);  
  await page.waitFor( 1000 * ( randomTime + 30) );
  page.close()
  return songLyric
}
async function getArtistInfo(page){
  var param = {
    selector : '#mnb > div.bdy'
  }  
  await page.waitForSelector(param.selector);  
  var artistInfoList = await page.evaluate(param => {      
      var artistDivs =  Array.from(document.querySelectorAll(param.selector));
      var artistInfoList = artistDivs.map(div => {       
        var artistInfo = {
          artistLink : div.querySelector('p.mid a').href ,
          artistFullName : div.querySelector('p.mid').textContent ,
          artistKanjiName : div.querySelector('p.mid a').textContent ,          
          artistImage : div.querySelector('img') ? div.querySelector('img').src : null
        }
        artistInfo.artistHirakanaName = artistInfo.artistFullName.replace(artistInfo.artistKanjiName,'') 
        return artistInfo;
      });
      return artistInfoList;
  }, param);

  return artistInfoList
}
