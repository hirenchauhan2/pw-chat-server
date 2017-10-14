/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return function processMessage(hook) {
    const messageText = hook.data.messageText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // const req = hook.app.request;

    // console.log('request object', req);

    hook.data = Object.assign({}, hook.data, { messageText });
    return Promise.resolve(hook);
  };
};
