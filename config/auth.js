const Auth = {
    /**
     * Secret used by passport module
     */
    appSecuritySecret: "meanauth",

    defineAuthStrategy: function(passport) {
      const JwtStrategy = require('passport-jwt').Strategy;
      const ExtractJwt = require('passport-jwt').ExtractJwt;
      const UserModel = require('../models/user-model');

      const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
        secretOrKey: this.appSecuritySecret
      }

      passport.use(new JwtStrategy(opts, (payload, done) => {
        UserModel.getById({"id": payload._doc._id}).then((user) => {
          done(null, user);
        }).catch((err) => {
          done(err, false);
        });
      }));
    }
}

module.exports = Auth;
