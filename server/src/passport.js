const passport = require('passport')
const {User} = require('./models')
const GoogleStrategy = require('passport-google-oauth20')
const NaverStrategy = require('passport-naver').Strategy
const KakaoStrategy = require('passport-kakao').Strategy
const FacebookStrategy = require('passport-facebook').Strategy

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const config = require('./config/config')
const keys = require('./config/keys')
passport.use(
  new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.authentication.jwtSecret
  }, async function (jwtPayload, done) {
    try {
      const user = await User.findOne({
        where: {
          id: jwtPayload.id
        }
      })
      if (!user) {
        return done(new Error(), false)
      }
      return done(null, user)
    } catch (err) {
      return done(new Error(), false)
    }
  })
)
passport.use(
  new GoogleStrategy(keys.google, // options for google strategy  end
    (accessToken, refreshTokken, profile, done) => { // passport callback function    
    // upsertUserInfo({
    //   name: profile.displayName,
    //   provider:'GOOGLE',
    //   providerId: profile.id,
    //   profileImage: profile._json.image.url
    // },done);              
    })
)
passport.use(
  new NaverStrategy(keys.naver, // options for naver strategy  end
    (accessToken, refreshTokken, profile, done) => { // passport callback function

    // upsertUserInfo({
    //   name: profile.displayName,
    //   provider:'NAVER',
    //   providerId: profile.id,
    //   profileImage: profile._json.profile_image
    // },done);   
    })
)
passport.use(
  new KakaoStrategy(keys.kakao, // options for kakao strategy  end
    (accessToken, refreshTokken, profile, done) => { // passport callback function
      console.log(profile)
    // upsertUserInfo({
    //   name: profile.displayName,
    //   provider:'KAKAO',
    //   providerId: profile.id,
    //   profileImage: profile._json.properties.profile_image
    // },done);   
    })
)

passport.use(
  new FacebookStrategy(keys.facebook, // options for facebook strategy  end
    (accessToken, refreshTokken, profile, done) => { // passport callback function
      console.log(profile)
    // upsertUserInfo({
    //   name: profile.displayName,
    //   provider:'FACEBOOK',
    //   providerId: profile.id,
    //   profileImage: profile._json.picture.data.url,
    // },done);  
    })
)
module.exports = null
