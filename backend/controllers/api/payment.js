const { handleError } = require("../../helpers/handlers");
const logger = require("../../helpers/logger");
const { onetimeCharge } = require("../../services/stripe");

exports.postCharge = async (req, res) => {
  try {
    const { amount, source, receipt_email } = req.body;

    logger.info({ amount, source, receipt_email });
    const charge = await onetimeCharge(amount, source, receipt_email);

    res.status(200).json({
      message: "charge posted successfully",
      charge,
    });
  } catch (error) {
    return handleError(res, req, 500, error);
  }
};
