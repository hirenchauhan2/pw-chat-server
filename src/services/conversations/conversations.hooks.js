const { authenticate } = require('feathers-authentication').hooks;
const populateMessages = require('../../hooks/populate-conversation-messages');
const addUser = require('../../hooks/add-user');
const populatePartner = require('../../hooks/populate-conversation-partner');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
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
