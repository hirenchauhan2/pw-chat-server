// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const getMessages = require('./getMessages');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function populateUserConversations (hook) {
    return new Promise(async (resolve, reject) => {
      const { models } = hook.app.get('sequelizeClient');
      const { conversations: Conversations, users: Users } = models;
      let result = Object.assign({}, hook.result);
      const userId = result.id;
      try {
        const user = await Users.findById(userId);
        const conditions = {
          where: {
            deletedByUser: null
          },
          raw: true
        }
        let conversations = await user.getConversations(conditions);

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
