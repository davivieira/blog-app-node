const bcrypt = require('bcryptjs');
const User = require('../schemas/user');

class UserModel {

  constructor() {}

  registerUser(newUser) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {

        let user = new User(newUser);
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err || !hash) reject(err);

          user.password = hash;
          user.save((err, user) => {
            if (err) reject(err);

            resolve(user);
          });
        });
      });
    });
  }

  getByUsername(username) {
    return new Promise((resolve, reject) => {
      const query = {username: username};

      User.findOne(query, (err, user) => {
        if (err || !user) reject(err);
        resolve(user);
      });
    });

  }

  checkPassword(givenPassword, hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(givenPassword, hash, (err, isMatch) => {
        if (err || !isMatch) reject(err);
        resolve();
      });
    });
  }

  getById(user) {
    return new Promise((resolve, reject) => {
      User.findOne({_id: user.id}, (err, user) => {
        if (err || !user) reject(err);
        resolve(user);
      });
    });
  }
}

module.exports = new UserModel();
