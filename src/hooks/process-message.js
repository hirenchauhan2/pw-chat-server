/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return function processMessage(hook) {
    const text = hook.data.text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // const req = hook.app.request;

    // console.log('request object', req);

    hook.data = Object.assign({}, hook.data, { text });
    return Promise.resolve(hook);
  };
};
