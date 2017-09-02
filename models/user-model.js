const bcrypt = require('bcryptjs');
const User = require('../schemas/user');
const AuditModel = require('../models/audit-model');
const eventTypes = require('../constants/event-types');

class UserModel {

  constructor() {}

  registerUser(newUser) {
    return new Promise((resolve, reject) => {
      if (!newUser.password) {
        reject();
      }
      let user = new User(newUser);
      user.password = this._encryptPassword(user.password);

      user.save((err, user) => {
        if (err) reject(err);

        resolve(user);
      });
    });
  }

  getByUsername(username) {
    return new Promise((resolve, reject) => {
      const query = {username: username};

      User.findOne(query, (err, user) => {
        if (err) reject(err);

        if (!user) {
          resolve(null);
        } else {
            const event = {
                username: user.username,
                eventTime: new Date(),
                eventType: eventTypes.LOGIN_EVENT
            };
            AuditModel.logEvent(event);

            resolve(user);
        }
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

  _encryptPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }
}

module.exports = new UserModel();
