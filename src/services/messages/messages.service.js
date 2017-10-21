// Initializes the `messages` service on path `/messages`
const createService = require('feathers-sequelize');
const createModel = require('../../models/messages.model');
const hooks = require('./messages.hooks');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const options = {
    name: 'messages',
    Model
  };

  // Initialize our service with any options it requires
  app.use('/messages', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('messages');

  service.hooks(hooks);
};
