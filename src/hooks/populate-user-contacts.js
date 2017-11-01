// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function populateUserContacts (hook) {
    return new Promise(async (resolve, reject) => {
      const { models } = hook.app.get('sequelizeClient');
      const { conversations: Conversations, users: Users } = models;
      let result = Object.assign({}, hook.result);
      const userId = result.id;
      try {
        const user = await Users.findById(userId);
        const conditions = {
          raw: true
        }
        let contacts = await user.getContacts(conditions);
        contacts = await Promise.all(
          contacts.map(async (c) => {
          let params = Object.assign({}, conditions, {
            select: ['profilePicture', 'isOnline']
          })
          let user = await Users.findById(c.fk_contactId, params)
          const contactUser = {
            profilePicture: user.profilePicture,
            isOnline: user.isOnline
          };
          delete user
          return Object.assign({}, c , { contactUser })
          })
        )
        result = Object.assign({}, result, { contacts });
        hook.result = result
        resolve(hook);
      } catch(e) {
        console.log(e);
        reject(e);
      }
    });
  };
};
