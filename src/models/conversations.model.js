// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const conversations = sequelizeClient.define('conversations', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    paranoid:  true,
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  conversations.associate = function (models) { // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    const { messages } = models;
    // conversations.hasOne(users, { as: 'Partner', foreignKey: 'partnerId' });
    conversations.hasMany(messages, { as: 'Messages' });
  };

  return conversations;
};
