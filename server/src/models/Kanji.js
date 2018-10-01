module.exports = (sequelize, DataTypes) => {
  const Song = sequelize.define('Kanji', {
    kanji: DataTypes.STRING,
    onyomi: DataTypes.STRING,
    kunyomi: DataTypes.STRING,
    english: DataTypes.STRING,
    grade: DataTypes.STRING,
    twitterUploaded: DataTypes.STRING,
    createdUserId: DataTypes.INTEGER,
    updatedUserId: DataTypes.INTEGER
  })

  Song.associate = function (models) {
  }
  return Song
}
