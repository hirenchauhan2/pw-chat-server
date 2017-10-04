const users = require('./users/users.service.js');
const conversations = require('./conversations/conversations.service.js');
const contacts = require('./contacts/contacts.service.js');
const messages = require('./messages/messages.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(conversations);
  app.configure(contacts);
  app.configure(messages);
};
