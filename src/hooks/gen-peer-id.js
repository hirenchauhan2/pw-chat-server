const PUID = require('puid');
const puid = new PUID(true); // generate 12 character unique string id

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return function genPeerId(hook) {
    hook.data.peerId = puid.generate();

    return Promise.resolve(hook);
  };
};
