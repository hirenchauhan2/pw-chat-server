const accountService = require('../services/auth-management/notifier');
// eslint-disable-next-line
module.exports = (options = {}) => hook => {
  if (!hook.params.provider) {
    return hook;
  }

  const user = hook.result;

  if (
    hook.app.get('EMAIL') &&
    hook.data &&
    hook.data.email &&
    user
  ) {
    accountService(hook.app).notifier('resendVerifySignup', user);
    return hook;
  }

  return hook;
};
