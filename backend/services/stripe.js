const nconf = require("nconf");
const logger = require("../helpers/logger");

require("../config");
const { secretKey } = nconf.get("stripe");
const stripe = require("stripe")(secretKey);

exports.onetimeCharge = async (amount, source, receipt_email) => {
  try {
    const charge = await stripe.charges.create({
      amount,
      currency: "usd",
      source,
      receipt_email,
    });
    if (!charge) throw new Error("charge unsuccessful");
    return charge;
  } catch (error) {
    return error;
  }
};
