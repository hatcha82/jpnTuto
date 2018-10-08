const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')

const ArticleController = require('./controllers/ArticleController')
const SongsController = require('./controllers/SongsController')
const TwitterController = require('./controllers/TwitterController')

const BookmarksController = require('./controllers/BookmarksController')
const HistoriesController = require('./controllers/HistoriesController')
const FuriganaController = require('./controllers/FuriganaController')

const isAuthenticated = require('./policies/isAuthenticated')
const passport = require('passport')
var Request = require('request')

module.exports = (app) => {
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
  }))
  app.post('/auth/google', (req, res) => {
    Request({
      method: 'post',
      url: 'https://accounts.google.com/o/oauth2/token',
      form: {
        code: req.body.code,
        client_id: '101271609028-qt8p60ktp498m87ectb1arhsq1pbvj7f.apps.googleusercontent.com',
        client_secret: 'mmTCA9ZdlC2I6RDw0_mzC79d',
        redirect_uri: req.body.redirectUri,
        grant_type: 'authorization_code'
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }, function (err, response, body) {
      try {
        if (!err && response.statusCode === 200) {
          var responseJson = JSON.parse(body)
          res.json(responseJson)
        } else {
          res.status(response.statusCode).json(err)
        }
      } catch (e) {
        res.status(500).json(err || e)
      }
    })
    // res.redirect('http://localhost:8081')
  })
  app.post('/register',
    AuthenticationControllerPolicy.register,
    AuthenticationController.register)
  // app.post('/login',
  //   AuthenticationController.login)
  app.post('/auth/login', (req, res) => {
    res.json({login:'ok'})
  })
  app.post('/furigana',
    FuriganaController.convert)

  app.get('/articles',
    ArticleController.index)
  app.get('/articles/:articleId',
    ArticleController.show)
  app.put('/articles/:articleId',
    ArticleController.put)
  app.post('/articles',
    ArticleController.post)
  app.delete('/articles/:articleId',
    isAuthenticated,
    ArticleController.remove)

  app.get('/twitters/userTimeLine', TwitterController.userTimeLine)
  app.get('/twitters/homeTimeline', TwitterController.homeTimeline)

  app.get('/songs',
    SongsController.index)
  app.get('/songs/:songId',
    SongsController.show)
  app.put('/songs/:songId',
    SongsController.put)
  app.post('/songs',
    SongsController.post)
  app.delete('/songs/:songId',
    isAuthenticated,
    SongsController.remove)

  app.get('/bookmarks',
    isAuthenticated,
    BookmarksController.index)
  app.post('/bookmarks',
    isAuthenticated,
    BookmarksController.post)
  app.delete('/bookmarks/:bookmarkId',
    isAuthenticated,
    BookmarksController.remove)
  app.get('/histories',
    isAuthenticated,
    HistoriesController.index)
  app.post('/histories',
    isAuthenticated,
    HistoriesController.post)
}
