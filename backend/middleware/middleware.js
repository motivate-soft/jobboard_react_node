const jwt = require("jsonwebtoken");
const winston = require("winston");
const { handleError } = require("../helpers/handlers");
const _ = require("lodash");
const passport = require("passport");

let middleware = {};

// Auth
middleware.checkAuth = passport.authenticate("jwt", { session: false });

// Role
middleware.checkRole = (...roles) => (req, res, next) => {
  console.log("checkRole", req.user);
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }

  const hasRole = req.user.isAdmin;
  // const hasRole = roles.find((role) => req.user.role === role);

  if (!hasRole) {
    return res.status(403).send("You are not allowed to make this request.");
  }

  return next();
};
module.exports = function () {
  return middleware;
};
