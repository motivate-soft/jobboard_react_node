const _ = require("lodash");
const nconf = require("nconf");
const jwt = require("jsonwebtoken");
require("../config");

exports.generateJWTToken = function (user) {
  const { id, email, username, fullName } = user;
  const secret = nconf.get("jwtSecret");
  const expiresIn = nconf.get("jwtExpiry");
  const payload = { id, email, username, fullName };

  if (!secret || !expiresIn) return { message: "Invalid Server Configuration" };

  return jwt.sign(payload, secret, { expiresIn });
};
