// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const getMessages = require('./getMessages');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function populateUserConversations (hook) {
    return new Promise(async (resolve, reject) => {
      const { models } = hook.app.get('sequelizeClient');
      const { conversations: Conversations } = models;
      let result = Object.assign({}, hook.result);
      const userId = result.id;
      try {
        const conditions = {
          where: {
            userId,
            deletedByUser: null
          },
          raw: true
        }
        let conversations = await Conversations.findAll(conditions);
        result = Object.assign({}, result, { conversations });
        hook.result = result
        resolve(hook);
      } catch(e) {
        console.log(e);
        reject(e);
      }
    });
  };
};
