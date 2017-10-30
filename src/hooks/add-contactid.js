/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return function addContactid(hook) {
    return new Promise(async (resolve, reject) => {
      const { email } = hook.data;
      const app = hook.app;
      const User = app.get('sequelizeClient').models.users;
      try {
        const user = await User.findOne({
          where: {
            email
          },
          attributes: ['id', 'peerId']
        });

        if (!user) {
          reject(new Error(`Cannot find user with email: ${email}`))
        }

        const userId = user.id;
        hook.data.fk_contactId = userId;
        hook.data.peerId = user.peerId;
        resolve(hook);
      } catch (e) {
        console.log('Error at User.finOne @ addContactID hook', e);
        reject(e);
      }
    });
  };
};
