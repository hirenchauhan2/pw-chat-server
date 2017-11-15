const { authenticate } = require('feathers-authentication').hooks;

module.exports = {
  before: {
    create: [ authenticate('jwt') ]
  }
};
