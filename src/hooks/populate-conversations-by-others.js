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
        const cOMappedByUser = await Promise.all(conversationsByOthers.map(async (c) => {
            const partnerId = c.userId;
            const partner = await Users.findById(partnerId, { raw: true });
            const userInfo = {
              name: `${partner.firstName} ${partner.lastName}`,
              email: partner.email,
              profilePicture: partner.profilePicture
            }
            return Object.assign({}, c, { partner: userInfo });
        }));

        result = Object.assign({}, result, {
          conversationsByOthers: cOMappedByUser
        });
        hook.result = result
        resolve(hook);
      } catch(e) {
        console.log(e);
        reject(e);
      }
    });
  };
};
