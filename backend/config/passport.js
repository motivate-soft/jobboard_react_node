const passport = require("passport");
const nconf = require("nconf");
const User = require("../models/user");

const JwtStrategy = require("passport-jwt").Strategy;

const ExtractJwt = require("passport-jwt").ExtractJwt;
const logger = require("../helpers/logger");

let opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: nconf.get("jwtSecret") || "JWT SECRET STRING",
};

passport.use(
  new JwtStrategy(opts, (payload, done) => {
    logger.info("JwtStrategy");
    
    User.findById(payload.id)
      .then((user) => {
        if (user) {
          return done(null, user);
        }

        return done(null, false);
      })
      .catch((err) => {
        return done(err, false);
      });
  })
);
