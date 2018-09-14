// const path = require('path')
module.exports = {
  port: process.env.PORT || 8080,
  db: {
    database: process.env.DB_NAME || 'jpn_tuto',
    user: process.env.DB_USER || 'jpn_tuto',
    password: process.env.DB_PASS || 'jpn_tuto',
    options: {
      dialect: process.env.DIALECT || 'mysql',
      host: process.env.HOST || '211.174.239.137',
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
  }
}
