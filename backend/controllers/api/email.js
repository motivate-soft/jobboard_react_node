const express = require("express");
const { handleError } = require("../../helpers/handlers");
const logger = require("../../helpers/logger");
const { addEmailToList } = require("../../services/sendgrid");
// const { subscribeToNewsletter } = require("../../services/mailchimp");

exports.newsletter = async (req, res) => {
  const email = req.body.email;

  if (!email) {
    return handleError(res, req, 500, "You must enter an email address");
  }

  try {
    await addEmailToList(email);
    res.status(200).json({
      success: true,
      message: "subscribed to the newsletter successfully",
    });
  } catch (error) {
    logger.error(error);
    handleError(res, req, 500, error.message);
  }
};
