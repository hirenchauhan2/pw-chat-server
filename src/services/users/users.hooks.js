const { authenticate } = require('feathers-authentication').hooks;
const commonHooks = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');
const verifyHooks = require('feathers-authentication-management').hooks;

const { hashPassword } = require('feathers-authentication-local').hooks;
const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: 'id',
    ownerField: 'id'
  })
];

const genPeerId = require('../../hooks/gen-peer-id');
const sendVerificationEmail = require('../../hooks/send-verification-email');

const addAutomicon = require('../../hooks/add-automicon');

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ ...restrict ],
    create: [hashPassword(), genPeerId(), verifyHooks.addVerification(), addAutomicon()],
    update: [commonHooks.disallow('external'), addAutomicon()],
    patch: [
      ...restrict,
      commonHooks.iff(commonHooks.isProvider('external'), commonHooks.preventChanges(
        'email',
        'isVerified',
        'verifyToken',
        'verifyShortToken',
        'verifyExpires',
        'verifyChanges',
        'resetToken',
        'resetShortToken',
        'resetExpires'
      )),
      hashPassword()
    ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      commonHooks.when(
        hook => hook.params.provider,
        commonHooks.discard('password', 'verifyExpires', 'resetExpires', 'verifyChanges')
      )
    ],
    find: [],
    get: [],
    create: [
      sendVerificationEmail(),
      verifyHooks.removeVerification(),
    ],
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
