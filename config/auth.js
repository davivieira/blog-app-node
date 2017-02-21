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
        UserModel.getById({"id": payload._doc._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }

            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
      }));
    }
}

module.exports = Auth;
