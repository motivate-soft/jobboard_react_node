const { validationResult } = require("express-validator");
const _ = require("lodash");
const logger = require("../../helpers/logger");
const { handleError, responseWithResult } = require("../../helpers/handlers");
const User = require("../../models/job");
const Job = require("../../models/job");

const LOCATION_OPTIONS = ["worldwide", "europe", "america", "asia", "africa"];
const STICKY_OPTIONS = ["week", "month"];
const STATUS_OPTIONS = ["pending", "approved", "declined"];

exports.paginate = async function (req, res) {
  const pageSize = Number(req.query.limit) || 10;
  const pageIndex = Number(req.query.page) || 1;

  let query = [
    { $skip: pageSize * (pageIndex - 1) },
    {
      $limit: pageSize,
    },
    {
      $lookup: {
        from: "companies",
        localField: "company",
        foreignField: "_id",
        as: "company",
      },
    },
    {
      $unwind: "$company",
    },
    {
      $lookup: {
        from: "media",
        localField: "company.logo",
        foreignField: "_id",
        as: "company.companyLogo",
      },
    },
    {
      $unwind: "$company.companyLogo",
    },
    {
      $addFields: {
        "company.logo": "$company.companyLogo.url",
      },
    },
    {
      $project: {
        "company.companyLogo": 0,
      },
    },
    // {
    //   $sort: {
    //     createdAt: -1,
    //   },
    // },
  ];

  const recordsTotal = await Job.countDocuments({});
  // const jobs = await Job.find({})
  //   .limit(pageSize)
  //   .skip(pageSize * (page - 1))
  //   .populate({
  //     path: "company",
  //     select: "-createdAt -updatedAt",
  //   });

  const jobs = await Job.aggregate(query);
  const recordsFiltered = await Job.countDocuments({});

  const from = pageSize * (pageIndex - 1) + 1;
  const to =
    from + pageSize - 1 < recordsFiltered
      ? from + pageSize - 1
      : recordsFiltered;
  const pageCount = Math.ceil(recordsFiltered / pageSize);
  const sort = "default";

  res.json({
    items: jobs,
    pageIndex,
    pageSize,
    pageCount,
    from,
    to,
    recordsFiltered,
    recordsTotal,
  });
};

exports.getFilter = async function (req, res) {
  try {
    // max and min salary from job

    return res.status(200).json({
      minSalary: 10000,
      maxSalary: 200000,
      status: STATUS_OPTIONS,
      sticky: STICKY_OPTIONS,
    });
  } catch (error) {
    logger.error(err);
    return handleError(res, req, 500, err);
  }
};

exports.retrieve = async function (req, res) {
  //
  const jobId = req.params.id;
  console.log("jobId", jobId);

  try {
    let job = await Job.findById(jobId).populate("company");
    return res.status(200).json(job);
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
  const {
    company,
    position,
    primaryTag,
    tags,
    location,
    minSalary,
    maxSalary,
    description,
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
      description,
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
