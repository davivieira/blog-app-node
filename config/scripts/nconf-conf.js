const nconf = require('nconf');

const NconfConf = (() => {
  return {
    init: () => {
      nconf.argv().env().file({
        file: './config/conf.' + process.env.NODE_ENV + '.json'
      });
    }
  };
})();

module.exports = NconfConf;