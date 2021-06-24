const Mailchimp = require("mailchimp-api-v3");
const nconf = require("nconf");
const logger = require("../helpers/logger");
require("../config");

const { key, listKey } = nconf.get("mailchimp");

const mailchimp = new Mailchimp(key);

exports.subscribeToNewsletter = async (email) => {
  try {
    const res = await mailchimp.post(`lists/${listKey}/members`, {
      email_address: email,
      status: "subscribed",
    });
    logger.info("subscribeToNewsletter->success");
    return res;
  } catch (error) {
    logger.error("subscribeToNewsletter->error");

    return error;
  }
};
