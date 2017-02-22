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
UserController.post('/register', (req, res, next) => {
  let newUser = {
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  };

  UserModel.registerUser(newUser).then((user) => {
    res.json({success: true, msg: `User ${user.name} saved successfully!`})
  }).catch((err) => {
    res.json({success: false, msg: 'Failed to register user'})
  });
});

/**
 * Try to authenticate bases on user and password
 *
 * @example expected request body.
 * {
 *  "username": "user",
 *  "password": "123456"
 * }
 */
UserController.put('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  UserModel.getByUsername(username).then((user) => {
    if (!user) res.json({success: false, msg: 'User not found'});

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
      throw err;
    });
  }).catch((err) => {
    throw err;
  });
});

UserController.get('/profile', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json(req.user);
});

UserController.get('/validate', (req, res) => {
  res.json(req.user);
});

module.exports = UserController;
