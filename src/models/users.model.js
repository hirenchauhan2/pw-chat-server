// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');

const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get('sequelizeClient');
  const users = sequelizeClient.define(
    'users',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      firstName: {
        type: DataTypes.STRING(50),
        allowNull: true
      },

      lastName: {
        type: DataTypes.STRING(50),
        allowNull: true
      },

      gender: {
        type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
        allowNull: false
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true
        }
      },

      password: {
        type: DataTypes.STRING,
        allowNull: true
      },

      peerId: {
        type: DataTypes.STRING(16)
      },

      googleId: { type: DataTypes.STRING, allowNull: true },

      facebookId: { type: DataTypes.STRING, allowNull: true },

      profilePicture: {
        type: DataTypes.STRING,
        allowNull: true
      },

      isOnline: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isVerified: { type: DataTypes.BOOLEAN },
      verifyToken: { type: DataTypes.STRING },
      verifyExpires: { type: DataTypes.DATE },
      verifyChanges: { type: DataTypes.JSON },
      resetToken: { type: DataTypes.STRING },
      resetExpires: { type: DataTypes.DATE }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['email', 'peerId', 'facebookId', 'googleId']
        }
      ],
      paranoid: true,
      getterMethods: {
        name() {
          return `${this.firstName} ${this.lastName}`;
        }
      },
      hooks: {
        beforeCount(options) {
          options.raw = true;
        }
      }
    }
  );

  users.associate = function(models) {
    // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    // console.log('Models', models); // eslint-disable-line
    const { contacts, conversations } = models;
    // User can have many contacts
    users.hasMany(contacts, { as: 'Contacts' });
    // user can have many conversations
    users.hasMany(conversations, { as: 'Conversations' });
    users.hasOne(conversations, { as: 'Partner', foreignKey: 'fk_partnerId' });
    users.hasOne(contacts, { as: 'User', foreignKey: 'fk_contactId' });
  };

  return users;
};
