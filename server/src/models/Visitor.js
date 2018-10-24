module.exports = (sequelize, DataTypes) => {
  const Visitor = sequelize.define('Visitor', {
    visitedDate: DataTypes.STRING,
    visitorIp: DataTypes.STRING,
    visitorRoute: DataTypes.STRING(2000),
    vistedCount: DataTypes.INTEGER
  })
  Visitor.associate = function (models) {
  }
  return Visitor
}
