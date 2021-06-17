const _ = require("lodash");
const nconf = require("nconf");
const jwt = require("jsonwebtoken");

exports.generateJWTToken = async function (dbUser) {
  jwt;
  var resUser = _.clone(dbUser._doc);
  delete resUser.password;

  var secret = nconf.get("tokens") ? nconf.get("tokens").secret : false;
  var expires = nconf.get("tokens") ? nconf.get("tokens").expires : 3600;

  if (!secret || !expires) return { message: "Invalid Server Configuration" };

  var token = jwt.sign({ user: resUser, expiry: expires }, secret, {
    expiresIn: expires,
  });

  return { token: token };
};
