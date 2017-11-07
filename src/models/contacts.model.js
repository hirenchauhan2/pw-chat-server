// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get('sequelizeClient');
  const contacts = sequelizeClient.define(
    'contacts',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      peerId: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['userId', 'email']
        }
      ],
      paranoid: true,
      hooks: {
        beforeCount(options) {
          options.raw = true;
        }
      }
    }
  );
  // eslint-disable-next-line no-unused-vars
  contacts.associate = function(models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return contacts;
};
