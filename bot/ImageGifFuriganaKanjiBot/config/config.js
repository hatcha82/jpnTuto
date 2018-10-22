module.exports = {
  twitter : {
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
  },
  db: {
    database: process.env.DB_NAME || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASS || '',
    options: {
      dialect: process.env.DIALECT || '',
      host: process.env.HOST || '',
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  }
}
