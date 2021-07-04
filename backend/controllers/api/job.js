const { validationResult } = require("express-validator");
const nconf = require("nconf");
const _ = require("lodash");
const logger = require("../../helpers/logger");
const { handleError, responseWithResult } = require("../../helpers/handlers");
const User = require("../../models/job");
const Job = require("../../models/job");
const {
  getProductsAndPlans,
  createCustomerAndSubscription,
} = require("./stripe");

require("../../config/index");

const LOCATION_OPTIONS = ["worldwide", "europe", "america", "asia", "africa"];
const STICKY_OPTIONS = ["week", "month"];
const STATUS_OPTIONS = ["pending", "approved", "declined"];

const { products } = nconf.get("stripe");

// user
exports.listing = async function (req, res) {
  const pageSize = Number(req.query.limit) || 10;
  const pageIndex = Number(req.query.page) || 1;

  const date = new Date();
  let query = [
    { $match: { status: "approved" } },
    {
      $addFields: {
        stickyDaysLeft: {
          $switch: {
            branches: [
              {
                case: { $eq: ["$stickyDuration", "day"] },
                then: {
                  $divide: [
                    {
                      $subtract: [{ $add: ["$createdAt", 3600000 * 24] }, date],
                    },
                    3600000 * 24,
                  ],
                },
              },
              {
                case: { $eq: ["$stickyDuration", "week"] },
                then: {
                  $divide: [
                    {
                      $subtract: [
                        { $add: ["$createdAt", 3600000 * 24 * 7] },
                        date,
                      ],
                    },
                    3600000 * 24,
                  ],
                },
              },
              {
                case: { $eq: ["$stickyDuration", "month"] },
                then: {
                  $divide: [
                    {
                      $subtract: [
                        { $add: ["$createdAt", 3600000 * 24 * 30] },
                        date,
                      ],
                    },
                    3600000 * 24,
                  ],
                },
              },
            ],
            default: 0,
          },
        },
      },
    },
    {
      $set: {
        stickyDaysLeft: {
          $switch: {
            branches: [{ case: { $lt: ["$stickyDaysLeft", 0] }, then: 0 }],
            default: "$stickyDaysLeft",
          },
        },
      },
    },
    {
      $set: {
        stickyDaysLeft: {
          $switch: {
            branches: [
              {
                case: { $eq: ["$stickyDaysLeft", 0] },
                then: {
                  $divide: [
                    {
                      $subtract: ["$createdAt", date],
                    },
                    3600000 * 24,
                  ],
                },
              },
            ],
            default: "$stickyDaysLeft",
          },
        },
      },
    },
    {
      $sort: {
        stickyDaysLeft: -1,
      },
    },
    // {
    //   $sort: {
    //     createdAt: -1,
    //   },
    // },
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
  const recordsFiltered = await Job.countDocuments({
    status: "approved",
  });

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

exports.detail = async function (req, res) {
  const jobId = req.params.id;
  console.log("jobId", jobId);

  try {
    // let job = await Job.findById(jobId).populate("company").populate("logo");
    let job = await Job.findById(jobId).populate({
      path: "company",
      model: "company",
      populate: {
        path: "logo",
        model: "media",
      },
    });
    if (!job) {
      message = `Job with id ${jobId} not found!`;
      return handleError(res, req, 400, message, "invalidData");
    }
    return res.status(200).json(job);
  } catch (error) {
    logger.error(error);
    return handleError(res, req, 500, error);
  }
};

exports.getPricing = async function (req, res) {
  try {
    const productsWithPlansAndPrices = await getProductsAndPlans();
    const { products } = nconf.get("stripe");
    let pricing = [];
    console.log("products", products);
    for (let [key, value] of Object.entries(products)) {
      console.log("key, value", key, value);
      let filteredProducts = productsWithPlansAndPrices.filter(
        (product) => product.id === value
      );

      let unitPrice = null;
      if (filteredProducts) {
        unitPrice = filteredProducts[0].prices[0].unit_amount_decimal;
        console.log("unit_amount_decimal", unitPrice);
      }

      pricing.push({
        [key]: unitPrice,
      });
    }
    return res
      .status(200)
      .json({ products: productsWithPlansAndPrices, pricing });
  } catch (error) {
    logger.error(error);
    return handleError(res, req, 500, error);
  }
};

exports.subscription = async function (req, res) {
  let { company, job, paymentMethodId } = req.body;
  console.log("req", company, paymentMethodId);

  // let array = [];
  // let keys = Object.keys(job);
  // keys.map((key) => {
  //   array.push(products[key]);
  // });
  company.priceItems = [
    "price_1J7zQ2HhTqm9kBDPpbdfAn3T",
    "price_1J7zRIHhTqm9kBDPgnU8pjsm",
    "price_1J7zRgHhTqm9kBDPrJ0eWdr2",
    "price_1J7zTPHhTqm9kBDPLRWFZkrM",
  ];

  const response = await createCustomerAndSubscription(
    paymentMethodId,
    company
  );
  logger.info("subscription", response);
};

// admin
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

exports.retrieve = async function (req, res) {
  const jobId = req.params.id;
  console.log("jobId", jobId);

  try {
    // let job = await Job.findById(jobId).populate("company").populate("logo");
    let job = await Job.findById(jobId).populate({
      path: "company",
      model: "company",
      populate: {
        path: "logo",
        model: "media",
      },
    });
    if (!job) {
      message = `Job with id ${jobId} not found!`;
      return handleError(res, req, 400, message, "invalidData");
    }
    return res.status(200).json(job);
  } catch (error) {
    logger.error(error);
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
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleError(res, req, 400, errors.array(), "invalidData");
    }

    const jobId = req.params.id;
    let job = await Job.findById(jobId);
    if (!job) {
      message = `Job with id ${jobId} not found!`;
      return handleError(res, req, 400, message, "invalidData");
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
      status,
    } = req.body;

    job.company = company;
    job.position = position;
    job.primaryTag = primaryTag;
    job.tags = tags;
    job.location = location;
    job.minSalary = minSalary;
    job.maxSalary = maxSalary;
    job.description = description;
    job.howtoApply = howtoApply;
    job.applyUrl = applyUrl;
    job.applyEmail = applyEmail;
    job.isShowLogo = isShowLogo;
    job.isBlastEmail = isBlastEmail;
    job.isHighlight = isHighlight;
    job.highlightColor = highlightColor;
    job.isStickyDay = isStickyDay;
    job.stickyDuration = stickyDuration;
    job.status = status;

    logger.info(req.body);

    let newJob = await job.save();

    if (!newJob) {
      message = `Failed to update a Job`;
      logger.debug(message);
      return handleError(res, req, 400, message);
    }

    return res.status(200).json(newJob);
  } catch (err) {
    logger.error(err);
    return handleError(res, req, 500, err);
  }
};

exports.delete = async function (req, res) {
  const jobId = req.params.id;
  try {
    let job = await Job.findById(jobId);

    if (!job) {
      message = `Job with id ${jobId} not found!`;
      return handleError(res, req, 400, message, "invalidData");
    }
    await job.remove();

    return res.status(204).json();
  } catch (error) {
    logger.error(error);
    return handleError(res, req, 500, err);
  }
};
