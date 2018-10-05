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

module.exports = (app) => {
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
  }))
  app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
    console.log('res return: ')
    console.log(JSON.stringify(req))
    console.log(JSON.stringify(res))
    res.send('haha')
    // res.redirect('http://localhost:8082')
  })
  app.post('/register',
    AuthenticationControllerPolicy.register,
    AuthenticationController.register)
  app.post('/login',
    AuthenticationController.login)
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
