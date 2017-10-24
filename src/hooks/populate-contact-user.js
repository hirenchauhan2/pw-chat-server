// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const populate = require('feathers-populate-hook');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function populateContactUser (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    populate({
      user: {
        service: 'users',
        f_key: 'id',
        l_key: 'fk_contactId'
      }
    });
    return Promise.resolve(hook);
  };
};
