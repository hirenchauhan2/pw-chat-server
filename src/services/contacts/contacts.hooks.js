const { authenticate } = require('feathers-authentication').hooks;
const populate = require('feathers-populate-hook');

const addUser = require('../../hooks/add-user');

const addContactid = require('../../hooks/add-contactid');

const populateContactUser = require('../../hooks/populate-contact-user');

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
    find: [populateContactUser()],
    get: [populateContactUser()],
    create: [populateContactUser()],
    update: [populateContactUser()],
    patch: [populateContactUser()],
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
