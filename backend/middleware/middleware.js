const jwt = require("jsonwebtoken");
const winston = require("winston");
const { handleError } = require("../helpers/handlers");
const _ = require("lodash");
const passport = require("passport");

let middleware = {};

// Auth
middleware.checkAuth = passport.authenticate("jwt", { session: false });

module.exports = function () {
  return middleware;
};
