const { validationResult } = require("express-validator");
const _ = require("lodash");
const logger = require("../../helpers/logger");
const { handleError, responseWithResult } = require("../../helpers/handlers");
const User = require("../../models/job");
const Job = require("../../models/job");

exports.paginate = async function (req, res) {
  const limit = Number(req.query.limit) || 5;
  const page = Number(req.query.page) || 1;

  const total = await Job.countDocuments({});
  const products = await Job.find({})
    .limit(limit)
    .skip(limit * (page - 1))
    .populate({
      path: "company",
      select: "-createdAt -updatedAt",
    });

  const from = limit * (page - 1) + 1;
  const to = from + limit - 1 < total ? from + limit - 1 : total;
  const sort = "default";

  res.json({
    items: products,
    page,
    pages: Math.ceil(total / limit),
    from,
    to,
    total,
  });
};

exports.retrieve = async function (req, res) {
  //
};

exports.create = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleError(res, req, 400, errors.array(), "invalidData");
  }
  const {
    company,
    position,
    primaryTag,
    tags,
    location,
    minSalary,
    maxSalary,
    jobDescription,
    howtoApply,
    applyUrl,
    applyEmail,
    isShowLogo,
    isBlastEmail,
    isHighlight,
    highlightColor,
    isStickyDay,
    stickyDuration,
  } = req.body;

  logger.info(req.body);

  try {
    job = new Job({
      company,
      position,
      primaryTag,
      tags,
      location,
      minSalary,
      maxSalary,
      jobDescription,
      howtoApply,
      applyUrl,
      applyEmail,
      isShowLogo,
      isBlastEmail,
      isHighlight,
      highlightColor,
      isStickyDay,
      stickyDuration,
    });
    let newJob = await job.save();

    if (!newJob) {
      message = `Failed to create a Job`;
      logger.debug(message);
      return handleError(res, req, 400, message);
    }

    return res.status(200).json(newJob);
  } catch (err) {
    logger.error(err);
    return handleError(res, req, 500, err);
  }
};

exports.update = async function (req, res) {
  //
};

exports.delete = async function (req, res) {
  //
};
