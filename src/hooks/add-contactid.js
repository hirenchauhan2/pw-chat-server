/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return function addContactid(hook) {
    const { email } = hook.data;
    const app = hook.app;
    const User = app.get('sequelizeClient').models.users;
    User.findOne({
      where: {
        email
      }
    })
      .then(user => {
        const userId = user.dataValues['id'];
        console.log(`Contact ID: ${userId}`);
        hook.data = Object.assign({}, hook.data, { fk_contactID: userId });
      })
      .catch(e => {
        console.log('Error at User.finOne @ addContactID hook', e.message);
      });
    console.log('add-contact-id hook-data', hook.data);
    return Promise.resolve(hook);
  };
};
