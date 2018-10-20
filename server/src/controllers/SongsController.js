const {Song, sequelize} = require('../models')
// import YahooWebAnalyzer from "kuroshiro-analyzer-yahoo-webapi";
const Kuroshiro = require('kuroshiro')
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji')
// const YahooWebAnalyzer = require('kuroshiro-analyzer-yahoo-webapi')
// const analyzer = new YahooWebAnalyzer({
//   appId: 'dj00aiZpPVVJcmZ3R3kzdTZEaiZzPWNvbnN1bWVyc2VjcmV0Jng9MWU-'
// })
const kuroshiro = new Kuroshiro()
kuroshiro.init(new KuromojiAnalyzer())
module.exports = {
  async index (req, res) {
    try {
      let songs = null
      const search = req.query.search
      const offset = parseInt(req.query.offset)
      var count = 0
      if (search) {
        count = await Song.findOne({
          attributes: [[Song.sequelize.fn('COUNT', Song.sequelize.col('id')), 'count']],
          where: {
            $or: [
              'title', 'artist'
            ].map(key => ({
              [key]: {
                $like: `%${search}%`
              }
            }))
          }
        })

        songs = await Song.findAll({
          attributes: {exclude: ['lyrics', 'tab']},
          where: {
            $or: [
              'title', 'artist'
            ].map(key => ({
              [key]: {
                $like: `%${search}%`
              }
            }))
          },
          order: [
            ['rank', 'ASC'],
            ['updatedAt', 'DESC']
          ],
          limit: 30,
          offset: offset
        })
      } else {
        count = await Song.findOne({
          attributes: [[Song.sequelize.fn('COUNT', Song.sequelize.col('id')), 'count']]
        })

        songs = await Song.findAll({
          attributes: {exclude: ['lyrics', 'tab']},
          order: [
            ['rank', 'ASC'],
            ['updatedAt', 'DESC']
          ],
          limit: 30,
          offset: offset
        })
      }
      res.send({data: songs, count: count})
    } catch (err) {
      res.status(500).send({
        error: err
      })
    }
  },
  async randomeSong (req, res) {
    try {
      const Op = sequelize.Op
      const songs = await Song.findAll({
        attributes: {exclude: ['lyrics', 'tab']},
        where: {
          albumImageUrl: {
            [Op.ne]: null
          }
        },
        order: [
          [sequelize.random()]
        ],
        limit: 10
      })
      res.send({data: songs})
    } catch (err) {
      res.status(500).send({
        error: err
      })
    }
  },
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
