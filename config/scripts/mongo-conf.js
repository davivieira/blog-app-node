const mongoose = require('mongoose');
const nconf = require('nconf');

const MongoConf = (() => {

  const connect = () => {
    mongoose.connect(nconf.get('mongodb:host') + ":" + nconf.get('mongodb:port') + "/" + nconf.get('mongodb:database'));
  };

  return {
    init: () => {
      connect();

      mongoose.connection.on('error', (err) => {
        console.log("Something went wrong: " + err);
      });
    }
  };
})();

module.exports = MongoConf;