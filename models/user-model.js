const bcrypt = require('bcryptjs');
const User = require('../schemas/user');

class UserModel {

  constructor() {}

  registerUser(newUser, callback) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {

        let user = new User(newUser);
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) reject(err);

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
        if (err) reject(err);
        resolve(user);
      });
    });

  }

  checkPassword(givenPassword, hash, callback) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(givenPassword, hash, (err, isMatch) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  getById(user, callback) {
    User.findOne({_id: user.id}, callback);
  }
}

module.exports = new UserModel();
