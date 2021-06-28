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
  try {
    const companyId = req.params.id;
    let company = await Company.findById(companyId);
    if (!company) {
      message = `Company with id ${companyId} not found!`;
      return handleError(res, req, 400, message, "invalidData");
    }

    return res.status(200).json(company);
  } catch (error) {
    logger.error(err);
    return handleError(res, req, 500, err);
  }
};

exports.create = async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleError(res, req, 400, errors.array(), "invalidData");
    }

    const {
      name,
      logo,
      twitter,
      email,
      invoiceAddress,
      invoiceNotes,
    } = req.body;

    logger.info(req.body);

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
      message = `Failed to create a company`;
      logger.debug(message);
      return handleError(res, req, 400, message);
    }

    return res.status(200).json(newCompany);
  } catch (err) {
    logger.error(err);
    return handleError(res, req, 500, err);
  }
};

exports.update = async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleError(res, req, 400, errors.array(), "invalidData");
    }

    const companyId = req.params.id;
    let company = await Company.findById(companyId);
    if (!company) {
      message = `Company with id ${companyId} not found!`;
      return handleError(res, req, 400, message, "invalidData");
    }

    const {
      name,
      logo,
      twitter,
      email,
      invoiceAddress,
      invoiceNotes,
    } = req.body;
    logger.info(req.body);

    company.name = name;
    company.logo = logo;
    company.twitter = twitter;
    company.email = email;
    company.invoiceAddress = invoiceAddress;
    company.invoiceNotes = invoiceNotes;

    const newCompany = await company.save();

    if (!newCompany) {
      message = `Failed to save company`;
      logger.debug(message);
      return handleError(res, req, 400, message);
    }

    return res.status(200).json(newCompany);
  } catch (err) {
    logger.error(err);
    return handleError(res, req, 500, err);
  }
};

exports.delete = async function (req, res) {
  const companyId = req.params.id;
  try {
    let company = await Company.findById(companyId);

    if (!company) {
      message = `Company with id ${companyId} not found!`;
      return handleError(res, req, 400, message, "invalidData");
    }
    await company.remove();

    return res.status(204).json();
  } catch (error) {
    logger.error(error);
    return handleError(res, req, 500, err);
  }
};
