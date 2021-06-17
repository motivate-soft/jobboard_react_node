const jwt = require("jsonwebtoken");
const winston = require("winston");
const { handleError } = require("../helpers/handlers");
const _ = require("lodash");

let middleware = {};

// Auth
middleware.checkAuth = async function (req, res, next) {
  // ByPass auth for now if user is set through session
  const token = req.header("x-auth-token");

  // Check if not token
  if (!token) {
    return handleError(res, req, 401, {}, "No token, authorization denied");
  }
  // Verify token
  try {
  } catch (err) {
    console.log("err", err);
    return handleError(res, req, 500, {}, "Server Error");
  }
};

module.exports = function () {
  return middleware;
};
