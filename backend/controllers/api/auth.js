const { validationResult } = require("express-validator");
const { generateJWTToken } = require("../../helpers/authUtils");
const { handleError, responseWithResult } = require("../../helpers/handlers");
const logger = require("../../helpers/logger");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const nconf = require("nconf");
const winston = require("winston");

let message;

exports.register = async function (req, res) {
  const { firstName, lastName, username, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.log("debug", "register validation failed");
    return handleError(res, req, 400, errors.array(), "invalidData");
  }

  try {
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      message = `User ${firstName} ${lastName} with ${email} or ${username} already exists.`;
      logger.debug(message);
      return handleError(res, req, 400, message);
    }

    user = new User({
      firstName,
      lastName,
      username,
      email,
      password,
    });
    const newUser = await user.save();

    if (!newUser) {
      message = `Failed to create a User ${firstName} ${lastName} with ${email}`;
      logger.debug(message);
      return handleError(res, req, 400, message);
    }

    const payload = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
    };
    const secret = nconf.get("jwtSecret");
    const expiresIn = nconf.get("jwtExpiry");
    jwt.sign(payload, secret, { expiresIn }, (err, token) => {
      return res.status(200).json({
        token,
      });
    });
  } catch (err) {
    logger.error(err);
    return handleError(res, req, 500, err);
  }
};

exports.login = async function (req, res) {
  const { email, username, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    message = `Validation for user with ${email || username} failed`;
    logger.log("debug", message);
    return handleError(res, req, 400, message, "invalidData");
  }

  try {
    let user = await User.findOne({ $or: [{ email }, { username }] });
    logger.info(user, { format: winston.format.json() });
    if (!user) {
      message = `User with ${email || username} not found!`;
      return handleError(res, req, 400, message, "invalidData");
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      message = `Password for ${email || username} invalid!`;
      logger.log("debug", message);
      return handleError(res, req, 400, message, "invalidData");
    }

    let payload = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    };
    const secret = nconf.get("jwtSecret");
    const expiresIn = nconf.get("jwtExpiry");
    console.log("payload", payload);

    logger.warn(payload, { format: winston.format.json() });
    jwt.sign(payload, secret, { expiresIn }, (err, token) => {
      return res.status(200).json({
        token,
      });
    });
  } catch (error) {
    logger.error(error);
    return handleError(res, req, 500, error);
  }
};
