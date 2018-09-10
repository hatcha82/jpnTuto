// const path = require('path')
module.exports = {
  port: process.env.PORT || 8081,
  db: {
    database: process.env.DB_NAME || 'DB_JPN_TYPER',
    user: process.env.DB_USER || 'JPN_TYPER',
    password: process.env.DB_PASS || 'JPN_TYPER',
    options: {
      dialect: process.env.DIALECT || 'mysql',
      host: process.env.HOST || 'omv.rateinquiry.co.kr',
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
