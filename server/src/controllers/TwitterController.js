const {Song} = require('../models')
var Twitter = require('twitter')
// import YahooWebAnalyzer from "kuroshiro-analyzer-yahoo-webapi";

const Kuroshiro = require('kuroshiro')
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji')
// const YahooWebAnalyzer = require('kuroshiro-analyzer-yahoo-webapi')
// const analyzer = new YahooWebAnalyzer({
//   appId: 'dj00aiZpPVVJcmZ3R3kzdTZEaiZzPWNvbnN1bWVyc2VjcmV0Jng9MWU-'
// })
const kuroshiro = new Kuroshiro()
kuroshiro.init(new KuromojiAnalyzer())
var client = new Twitter({
  consumer_key: 'WT8RWbxohsKLo7GYlrpPQzQ0A',
  consumer_secret: 'ufSb1xxaViCcP0HaOL7Ltl3g4JCTC7VzxfdNaZGzyqyL2kCTGx',
  access_token_key: '154533392-ERqhvCpOYDbjgGalpW18SMakNWXhxplXlMx7XDtC',
  access_token_secret: 'K2QjekGhokvzBbBLvvW7D2AmHLltVZWAUmB9DDfHHnofM'
})
async function getData (screenName, endPoint) {
  return new Promise(function (resolve, reject) {
    var params = {screen_name: screenName, count: 15, exclude_replies: false, include_entities: true}
    client.get(endPoint, params, function (error, tweets, response) {
      if (!error) {
        if (tweets.length === 0) {
          resolve(tweets)
        } else {
          tweets.forEach(async function (element, index, array) {
            if (element.lang === 'ja') {
              var result = await kuroshiro.convert(element.text, {mode: 'furigana', to: 'hiragana', romajiSystem: 'passport'})
              element.furigana = result
            } else {
              element.furigana = element.text
            }
            if (index + 1 === array.length) {
              resolve(tweets)
            }
          })
        }
      } else {
        reject(new Error(error))
      }
    })
  })
}

module.exports = {
  async userTimeLine (req, res) {
    var search = req.query.search
    if (!search) {
      search = '_FURIGANA'
    }
    getData(search, 'statuses/user_timeline').then(function (data) {
      res.send(data)
      // res.send(data); // response 값 출력
    }).catch(function (err) {
      res.send(err)// Error 출력
    })
  },
  async  homeTimeline (req, res) {
    var search = '_FURIGANA'
    getData(search, 'favorites/list').then(function (data) {
      res.send(data)
      // res.send(data); // response 값 출력
    }).catch(function (err) {
      res.send(err)// Error 출력
    })
  },
  // async index (req, res) {
  //   try {
  //     let songs = null
  //     const search = req.query.search
  //     const offset = parseInt(req.query.offset)
  //     var count = 0
  //     if (search) {
  //       count = await Song.findOne({
  //         attributes: [[Song.sequelize.fn('COUNT', Song.sequelize.col('id')), 'count']],
  //         where: {
  //           $or: [
  //             'title', 'artist', 'genre', 'album'
  //           ].map(key => ({
  //             [key]: {
  //               $like: `%${search}%`
  //             }
  //           }))
  //         }
  //       })

  //       songs = await Song.findAll({
  //         attributes: {exclude: ['lyrics', 'tab']},
  //         where: {
  //           $or: [
  //             'title', 'artist', 'genre', 'album'
  //           ].map(key => ({
  //             [key]: {
  //               $like: `%${search}%`
  //             }
  //           }))
  //         }
  //       })
  //     } else {
  //       count = await Song.findOne({
  //         attributes: [[Song.sequelize.fn('COUNT', Song.sequelize.col('id')), 'count']]
  //       })

  //       songs = await Song.findAll({
  //         attributes: {exclude: ['lyrics', 'tab']},
  //         order: [
  //           ['createdAt', 'DESC']
  //         ],
  //         limit: 100,
  //         offset: offset
  //       })
  //     }
  //     res.send({data: songs, count: count})
  //   } catch (err) {
  //     res.status(500).send({
  //       error: err
  //     })
  //   }
  // },
  async show (req, res) {
    try {
      const song = await Song.findById(req.params.songId)
      res.send(song)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to show the songs'
      })
    }
  },
  async post (req, res) {
    try {
      const song = await Song.create(req.body)
      res.send(song)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to create the song'
      })
    }
  },
  async put (req, res) {
    try {
      await Song.update(req.body, {
        where: {
          id: req.params.songId
        }
      })
      res.send(req.body)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to update the song'
      })
    }
  },
  async remove (req, res) {
    try {
      const songId = req.params.songId
      console.log('param:')
      console.log(req.params)
      const song = await Song.findOne({
        where: {
          id: songId
        }
      })
      if (!song) {
        return res.status(403).send({
          error: 'you do not have access to this bookmark'
        })
      }
      await song.destroy()
      res.send(song)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to delete the bookmark'
      })
    }
    // try {
    //   await Song.destroy(req.body, {
    //     where: {
    //       id: req.params.songId
    //     }
    //   })
    //   res.send(req.body)
    // } catch (err) {
    //   res.status(500).send({
    //     error: 'an error has occured trying to update the song'
    //   })
    // }
  }
}
