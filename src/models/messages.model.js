// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get('sequelizeClient');
  const messages = sequelizeClient.define(
    'messages',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      type: {
        type: DataTypes.ENUM('TEXT', 'CALL'),
        allowNull: false
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      attachmentUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ip: {
        type: DataTypes.STRING,
        // allowNull: false,
        validate: {
          isIP: true
        }
      },
      status: {
        type: DataTypes.ENUM('READ', 'UNREAD'),
        defaultValue: 'UNREAD'
      },
      callDuration: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      paranoid: true,
      hooks: {
        beforeCount(options) {
          options.raw = true;
        }
      }
    }
  );

  messages.associate = function(models) {
    // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    const { users } = models;
    messages.belongsTo(users);
  };

  return messages;
};
