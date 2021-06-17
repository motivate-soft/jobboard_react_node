const winston = require("winston");

exports.handleError = (
  res,
  req,
  statusCode,
  message = "",
  errorCode = "serverError"
) => {
  winston;
  statusCode = statusCode || 500;
  responseData = {
    success: false,
    message: message,
    errorCode: errorCode,
    status: statusCode,
  };

  return res.status(statusCode).json(responseData);
};

exports.responseWithResult = (
  res,
  req,
  statusCode,
  data,
  message = "",
  success = true
) => {
  statusCode = statusCode || 200;
  responseData = {
    success: success,
    message: message,
    data: data,
  };

  return res.status(statusCode).json(responseData);
};
