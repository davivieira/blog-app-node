const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const UserModel = require('../models/user-model');
const AuditModel = require('../models/audit-model');
const Auth = require('../config/scripts/auth-conf');
const ResponseGenerator = require('../utils/response-generator');
const error = require('../constants/error');
const eventTypes = require('../constants/event-types');

const UserController = express.Router();

/**
 * Creates a new user.
 *
 * @example expected request body.
 * {
 *  "name": "Davi Vieira",
 *  "email": "email@provider.com",
 *  "username": "user",
 *  "password": "123456"
 * }
 */
UserController.post('/register', (req, res) => {
  let newUser = {
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  };

  UserModel.registerUser(newUser).then((user) => {
    ResponseGenerator.createSuccessMessage(user, res);
  }).catch(() => {
    ResponseGenerator.createErrorMessage(error.http.INTERNAL_SERVER_ERROR, error.custom.FAILED_TO_REGISTER_USER, res);
  });
});

/**
 * Try to authenticate based on username and password provided.
 *
 * @example expected request body.
 * {
 *  "username": "user",
 *  "password": "123456"
 * }
 */
UserController.put('/authenticate', (req, res) => {
  const {username, password} = req.body;

  UserModel.getByUsername(username).then((user) => {
    UserModel.checkPassword(password, user.password).then(() => {
      const token = jwt.sign(user, Auth.appSecuritySecret, {
        expiresIn: 36000
      });
      const event = {
        username: user.name,
        eventTime: new Date(),
        eventType: eventTypes.LOGIN_EVENT
      };
      AuditModel.logEvent(event);

      ResponseGenerator.createSuccessMessage({
        success: true,
        token: `JWT ${token}`,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username
        }
      }, res);
    }).catch((err) => {
      if (err) {
        ResponseGenerator.createErrorMessage(error.http.INTERNAL_SERVER_ERROR, error.custom.AUTHENTICATION_FAILED, res);
      } else {
        ResponseGenerator.createErrorMessage(error.http.INTERNAL_SERVER_ERROR, error.custom.WRONG_PASSWORD, res);
      }
    });
  }).catch((err) => {
    if (err) {
      ResponseGenerator.createErrorMessage(error.http.INTERNAL_SERVER_ERROR, error.custom.AUTHENTICATION_FAILED, res);
    } else {
      ResponseGenerator.createErrorMessage(error.http.INTERNAL_SERVER_ERROR, error.custom.USER_NOT_FOUND, res);
    }
  });
});

/**
 * Returns current's user data.
 */
UserController.get('/profile', passport.authenticate('jwt', {session: false}), (req, res) => {
  ResponseGenerator.createSuccessMessage(req.user, res);
});

module.exports = UserController;
