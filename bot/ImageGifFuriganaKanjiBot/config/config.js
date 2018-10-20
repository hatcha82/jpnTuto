module.exports = {
  twitter : {
    consumer_key: 'u68GbxObuBeq8IHy4BCOV0E92',
    consumer_secret: 'WjZnAX4hfYMqvvBmJluJiSfz5E8Gq2vWwJ8Md8ePLb35pPvIGH',
    access_token_key: '1045274717471485953-39o9BhBv52X7sJ0zFZZEXQA36SWkZr',
    access_token_secret: 'Ukt28QRMBhBlasFvTgEshtEUXn4akkMAEAVp5Zs7XKuip'
  },
  db: {
    database: process.env.DB_NAME || 'jpn_tuto',
    user: process.env.DB_USER || 'jpn_tuto',
    password: process.env.DB_PASS || 'jpn_tuto',
    options: {
      dialect: process.env.DIALECT || 'mysql',
      host: process.env.HOST || 'db.furiganahub.com',
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  }
}
