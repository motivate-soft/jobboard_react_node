const express = require("express");
const { handleError } = require("../../helpers/handlers");
// const { subscribeToNewsletter } = require("../../services/mailchimp");

exports.newsletter = async (req, res) => {
  const email = req.body.email;


  if (!email) {
    return handleError(res, req, 500, "You must enter an email address");
  }

  // const res = await subscribeToNewsletter(email);

  // if (result.status === 400) {
  //   return res.status(400).json({ error: result.title });
  // }

  res.status(200).json({
    success: true,
    message: "You have successfully subscribed to the newsletter",
  });
};
