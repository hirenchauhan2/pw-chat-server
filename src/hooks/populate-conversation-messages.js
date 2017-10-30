// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const getMessages = require('./getMessages');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function populateConversationMessages (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    return new Promise(async (resolve, reject) => {
      const models = hook.app.get('sequelizeClient').models;
      const { conversations: Conversations, messages: Messages } = models;
      // Authenticated user
      const userId = hook.params.user.id;
      let result;
      if (Array.isArray(hook.result) ) {
        let result = hook.result.map(async (res) => {
          const conversationId = res.id;
          const conv_partnerId = res.fk_partnerId;
          const conv_userId = res.userId;
          const messages = await getMessages(Conversations, conversationId, userId, conv_userId, conv_partnerId);
          return Object.assign({}, res, { messages });
        });
        hook.result = result;
      } else {
        const conversationId = hook.result.id;
        const conv_partnerId = hook.result.fk_partnerId;
        const conv_userId = hook.result.userId;
        const messages = await getMessages(Conversations, conversationId, userId, conv_userId, conv_partnerId);
        const result = Object.assign({}, hook.result);
        hook.result = Object.assign({}, result, { messages });
      }
      resolve(hook);
    });
  };
}
