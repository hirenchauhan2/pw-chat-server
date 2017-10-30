const { authenticate } = require('feathers-authentication').hooks;
const populate = require('feathers-populate-hook');

const addUser = require('../../hooks/add-user');

const addContactid = require('../../hooks/add-contactid');

const populateUser = () => populate({
  user: {
    service: 'users',
    f_key: 'id',
    l_key: 'fk_contactId',
    query: {
      $select: ['profilePicture', 'isOnline', 'peerId']
    }
  }
});

module.exports = {
  before: {
    all: [authenticate('jwt'), populate.compatibility()],
    find: [],
    get: [],
    create: [addUser(), addContactid()],
    update: [addUser(), addContactid()],
    patch: [addUser(), addContactid()],
    remove: []
  },

  after: {
    all: [],
    find: [populateUser()],
    get: [populateUser()],
    create: [],
    update: [],
    patch: [],
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
