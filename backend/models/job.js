const mongoose = require("mongoose");

var COLLECTION = "job";
const Schema = mongoose.Schema;
const stickyOptions = ["day", "week", "month"];
const statusOptions = ["pending", "approved", "declined"];

const jobSchema = mongoose.Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "company",
    },
    position: {
      type: String,
      require: true,
    },
    primaryTag: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    location: {
      type: String,
      require: true,
    },
    minSalary: {
      type: Number,
      required: true,
    },
    maxSalary: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    howtoApply: {
      type: String,
    },
    applyUrl: {
      type: String,
    },
    applyEmail: {
      type: String,
    },

    showLogo: {
      type: Boolean,
      default: true,
    },
    blastEmail: {
      type: Boolean,
      default: true,
    },
    highlight: {
      type: Boolean,
      default: false,
    },
    highlightColor: {
      type: Boolean,
      default: false,
    },
    brandColor: {
      type: String,
    },
    stickyDuration: {
      type: String,
      enum: stickyOptions,
    },
    status: {
      type: String,
      enum: statusOptions,
      default: "approved",
    },
    // payLater: {
    //   type: Boolean,
    // },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model(COLLECTION, jobSchema);
module.exports = Job;
module.exports = Object.assign(module.exports, {
  stickyOptions,
  statusOptions,
});
