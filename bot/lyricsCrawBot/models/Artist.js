module.exports = (sequelize, DataTypes) => {
  const Artist = sequelize.define('Artist', {
    artist : DataTypes.STRING,
    artistLink : DataTypes.STRING,
    artistFullName : DataTypes.STRING,
    artistKanjiName : DataTypes.STRING,
    artistHirakanaName : DataTypes.STRING,
    artistImage : DataTypes.STRING,       
    createdUserId: DataTypes.INTEGER,
    updatedUserId: DataTypes.INTEGER
  })
  return Artist
}
