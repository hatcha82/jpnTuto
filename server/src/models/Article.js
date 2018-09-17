module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    title: DataTypes.STRING,
    type: DataTypes.STRING,
    newsUrl: DataTypes.STRING,
    newsImageUrl: DataTypes.STRING,
    article: DataTypes.TEXT,
    furigana: DataTypes.TEXT
  })

  Article.associate = function (models) {
  }

  return Article
}
