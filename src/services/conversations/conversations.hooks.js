const { authenticate } = require('feathers-authentication').hooks;
const populate = require('feathers-populate-hook');
// const { populate } = require('feathers-hooks-common');
const populateMessages = require('../../hooks/populate-conversation-messages');
const addUser = require('../../hooks/add-user');

const populatePartner = () => populate({
  partner: {
    service: 'users',
    f_key: 'id',
    l_key: 'fk_partnerId',
    one: true,
    query: {
      $select: ['profilePicture', 'peerId']
    }
  }
});

module.exports = {
  before: {
    all: [ authenticate('jwt'), populate.compatibility() ],
    find: [],
    get: [],
    create: [addUser()],
    update: [addUser()],
    patch: [addUser()],
    remove: []
  },

  after: {
    all: [],
    find: [populateMessages(),populatePartner()],
    get: [populateMessages(),populatePartner()],
    create: [populatePartner()],
    update: [populateMessages(),populatePartner()],
    patch: [populateMessages(),populatePartner()],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
