const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const Auth = require('./auth');

/**
 * Main app configuration. All configurations should be initialized by init() method,
 * returned from IIFE AppConfig.
 */
const AppConfig = (() => {

  /**
   * Starts mongo configuration.
   */
  const connectToMongoDB = () => {
    const mongoose = require('mongoose');

    mongoose.connect('mongodb://localhost:27017/meanauth');

    mongoose.connection.on('connected', () => {
      console.log("Connected to mongodb");
    });

    mongoose.connection.on('error', (err) => {
      console.log("Something went wrong: " + err);
    });
  }

  /**
   * Loads all controllers. Every new controller should be registered here.
   */
  const loadControllers = (app) => {
    const users = require('../controllers/users');
    app.use('/users', users);
  }

  return {
    init: (app) => {
      connectToMongoDB();

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
  }
})();

module.exports = AppConfig;
