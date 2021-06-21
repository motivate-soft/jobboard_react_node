const { validationResult } = require("express-validator");
const _ = require("lodash");
const logger = require("../../helpers/logger");
const User = require("../../models/company");
const { handleError, responseWithResult } = require("../../helpers/handlers");
const Company = require("../../models/company");

exports.getAll = async function (req, res) {
  try {
    let companies = await Company.find({});
    return res.status(200).json(companys);
  } catch (error) {
    logger.error(err);
    return handleError(res, req, 500, err);
  }
};

exports.retrieve = async function (req, res) {
  const companyId = req.params.id;
  try {
    let company = await Company.findById(companyId).select("-password");
    return res.status(200).json(company);
  } catch (error) {
    logger.error(err);
    return handleError(res, req, 500, err);
  }
};

exports.create = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleError(res, req, 400, errors.array(), "invalidData");
  }
  const { name, logo, twitter, email, invoiceAddress, invoiceNotes } = req.body;

  logger.info(req.body);

  try {
    // let company = await Company.findOne({ companyName });
    // if (company) {
    //   message = `Company with ${companyname} already exists.`;
    //   logger.debug(message);
    //   return handleError(res, req, 400, message);
    // }

    company = new Company({
      name,
      logo,
      twitter,
      email,
      invoiceAddress,
      invoiceNotes,
    });
    const newCompany = await company.save();

    if (!newCompany) {
      message = `Failed to create a Company with name ${companyName}`;
      logger.debug(message);
      return handleError(res, req, 400, message);
    }

    return res.status(200).json(newCompany);
  } catch (err) {
    logger.error(err);
    return handleError(res, req, 500, err);
  }
};
