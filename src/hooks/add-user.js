// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return function addUser(hook) {
    const user = hook.params.user;
    const data = hook.data;
    hook.data = Object.assign({}, data, { userId: user.id });
    return Promise.resolve(hook);
  };
};
