const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const UserModel = require('../models/user-model');
const Auth = require('../config/auth');

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
    res.json({success: true, msg: `User ${user.name} saved successfully!`})
  }).catch(() => {
    res.json({success: false, msg: 'Failed to register user'})
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
  const [username, password] = [req.body.username, req.body.password];

  UserModel.getByUsername(username).then((user) => {
    UserModel.checkPassword(password, user.password).then(() => {
      const token = jwt.sign(user, Auth.appSecuritySecret, {
        expiresIn: 36000
      });

      res.json({
        success: true,
        token: `JWT ${token}`,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username
        }
      });
    }).catch((err) => {
      if (err) {
        res.json({success: false, msg: err});
      } else {
        res.json({success: false, msg: 'Wrong password!'});
      }
    });
  }).catch((err) => {
      if (err) {
        res.json({success: false, msg: err});
      } else {
        res.json({success: false, msg: 'User not found'});
      }
  });
});

UserController.get('/profile', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json(req.user);
});

module.exports = UserController;
