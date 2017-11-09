// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function populateContactUser (hook) {
    return new Promise(async (resolve, reject) => {
      const { models } = hook.app.get('sequelizeClient');
      const { users: Users } = models;
      let result = Object.assign({}, hook.result);
      const params = {
        raw: true
      };
      try {
        const user = await Users.findById(result.fk_contactId, params);
        const contactUser = {
          profilePicture: user.profilePicture,
          isOnline: user.isOnline
        };
        // delete user
        hook.result = Object.assign({}, result , { contactUser });
        resolve(hook);
      } catch(e) {
        // statements
        console.log(e);
        reject(e);
      }
    });
  };
};
