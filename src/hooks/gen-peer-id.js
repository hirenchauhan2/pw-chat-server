const yeast = require('yeast');

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return function genPeerId(hook) {
    hook.data.peerId = yeast();

    return Promise.resolve(hook);
  };
};
