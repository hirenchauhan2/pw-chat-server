// Initializes the `contacts` service on path `/contacts`
const createService = require('feathers-sequelize');
const createModel = require('../../models/contacts.model');
const hooks = require('./contacts.hooks');

module.exports = function () {
  const app = this;
  const Model = createModel(app);

  const options = {
    name: 'contacts',
    Model
  };

  // Initialize our service with any options it requires
  app.use('/contacts', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('contacts');

  service.hooks(hooks);
};
