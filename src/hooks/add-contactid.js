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
          }
        });
        const userId = user.dataValues['id'];
        console.log(`Contact ID: ${userId}`);
        hook.data = Object.assign({}, hook.data, { fk_contactID: userId });
        console.log('add-contact-id hook-data', hook.data);
        resolve(hook);
      } catch (e) {
        console.log('Error at User.finOne @ addContactID hook', e);
        reject(e);
      }
    });
  };
};
