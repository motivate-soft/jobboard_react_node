const { validationResult } = require("express-validator");
const _ = require("lodash");
const logger = require("../../helpers/logger");
const User = require("../../models/user");
const { handleError, responseWithResult } = require("../../helpers/handlers");

exports.getAll = async function (req, res) {
  try {
    let users = await User.find({}).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    logger.error(err);
    return handleError(res, req, 500, err);
  }
};

exports.retrieve = async function (req, res) {
  const userId = req.params.id;
  console.log("userId", userId);
  try {
    let user = await User.findById(userId).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    logger.error(err);
    return handleError(res, req, 500, err);
  }
};

exports.create = async function (req, res) {
  console.log("req.body", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.log("debug", "Create user validation failed");
    return handleError(res, req, 400, errors.array(), "invalidData");
  }
  const { firstName, lastName, username, email, password } = req.body;

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

    return res.status(200).json(newUser);
  } catch (err) {
    logger.error(err);
    return handleError(res, req, 500, err);
  }
};

exports.update = async function (req, res) {
  const userId = req.params.id;
  const { email, username, firstName, lastName, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    message = `Validation for user with ${email || username} failed`;
    logger.log("debug", message);
    return handleError(res, req, 400, message, "invalidData");
  }

  try {
    let user = await User.findById(userId);
    if (!user) {
      message = `User with id${userId} not found!`;
      return handleError(res, req, 400, message, "invalidData");
    }

    user.email = email;
    user.username = username;
    user.firstName = firstName;
    user.lastName = lastName;
    if (password) user.password = password;
    const newUser = await user.save();

    if (!newUser) {
      message = `Failed to update a User ${firstName} ${lastName} with ${email}`;
      logger.debug(message);
      return handleError(res, req, 400, message);
    }

    return res.status(200).json(newUser);
  } catch (error) {
    logger.error(error);
    return handleError(res, req, 500, error);
  }
};

exports.delete = async function (req, res) {
  const userId = req.params.id;

  try {
    let user = await User.findById(userId);
    if (!user) {
      message = `User with id ${userId} not found!`;
      return handleError(res, req, 400, message, "invalidData");
    }

    await user.remove();

    return res.status(200).json(userId);
  } catch (error) {
    logger.error(error);
    return handleError(res, req, 500, error);
  }
};
