// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function populateConversationsByOthers (hook) {
    return new Promise(async (resolve, reject) => {
      const { models } = hook.app.get('sequelizeClient');
      const { conversations: Conversations, users: Users } = models;
      let result = Object.assign({}, hook.result);
      const userId = result.id;
      try {
        const conditions = {
          where: {
            fk_partnerId: userId,
            deletedByPartner: null
          },
          raw: true
        }
        const conversationsByOthers =  await Conversations.findAll(conditions);
        result = Object.assign({}, result, { conversationsByOthers });
        hook.result = result
        resolve(hook);
      } catch(e) {
        console.log(e);
        reject(e);
      }
    });
  };
};
