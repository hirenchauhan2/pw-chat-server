// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function addAutomicon (hook) {
    hook.data.profilePicture = `https://utils.lib.id/automicon/?seed=${hook.data.firstName}+${hook.data.lastName}`;

    return Promise.resolve(hook);
  };
};
