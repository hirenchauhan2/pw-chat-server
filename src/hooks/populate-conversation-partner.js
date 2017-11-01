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
        const user = hook.params.user;
        let partner;
        // The current User is owner, find the partner
        if (user.id === result.userId) {
          partner = await Users.findById(result.fk_partnerId, params);
        } else {
          // The current user is Partner, find the  owner
          partner = await Users.findById(result.userId, params);
        }

        partner = {
          name: `${partner.firstName} ${partner.lastName}`,
          email: partner.email,
          profilePicture: partner.profilePicture
        };

        hook.result = Object.assign({}, result , { partner });
        resolve(hook);
      } catch(e) {
        // statements
        console.log(e);
        reject(e);
      }
    });
  };
};
