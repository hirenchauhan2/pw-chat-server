const { authenticate } = require('feathers-authentication').hooks;

const addUser = require('../../hooks/add-user');

const addContactid = require('../../hooks/add-contactid');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [addUser(),addContactid()],
    update: [addUser(),addContactid()],
    patch: [addUser(),addContactid()],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
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
