const { authenticate } = require('feathers-authentication').hooks;

const addUser = require('../../hooks/add-user');

const addContactid = require('../../hooks/add-contactid');
const populateUser = require('../../hooks/populate-contact-user');

module.exports = {
  before: {
    all: [authenticate('jwt')],
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
    create: [populateUser()],
    update: [populateUser()],
    patch: [populateUser()],
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
