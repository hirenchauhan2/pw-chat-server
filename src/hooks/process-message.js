/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return function processMessage(hook) {
    if (hook.data && hook.data.text) {
      const text = hook.data.text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      hook.data = Object.assign({}, hook.data, { text });
    }
    return Promise.resolve(hook);
  };
};
