const { authenticate } = require('feathers-authentication').hooks;

const addUser = require('../../hooks/add-user');

const processMessage = require('../../hooks/process-message');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [addUser(), processMessage()],
    update: [addUser()],
    patch: [addUser()],
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
