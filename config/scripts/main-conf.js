const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const Auth = require('./auth-conf');
const NconfConf = require('./nconf-conf');
const logger = require('morgan');
const MongoConf = require('./mongo-conf');
const users = require('../../controllers/user-controller');

/**
 * Main app configuration. All configurations should be initialized by init() method,
 * returned from IIFE AppConfig.
 */
const AppConfig = (() => {

  /**
   * Loads all controllers. Every new controller should be registered here.
   */
  const loadControllers = (app) => {
    app.use('/users', users);
  };

  /**
   * Starts middleware logging
   */
  const configLogging = (app) => {
    app.use(logger('[:date[iso]] Request: :url | Method: :method | Status: :status | :response-time ms'));
  };

  return {
    init: (app) => {
      NconfConf.init();
      MongoConf.init();
      configLogging(app);

      // Passport middleware
      Auth.defineAuthStrategy(passport);
      app.use(passport.initialize());
      app.use(passport.session());

      // CORS Middleware
      app.use(cors());

      // Body Parser middleware
      app.use(bodyParser.json());
      loadControllers(app);
    }
  };
})();

module.exports = AppConfig;
