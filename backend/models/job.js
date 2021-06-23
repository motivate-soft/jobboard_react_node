const mongoose = require("mongoose");

var COLLECTION = "job";
const Schema = mongoose.Schema;
const STICKY_OPTIONS = ["day", "week", "month"];
const STATUS_OPTIONS = ["pending", "approved", "declined"];

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

    isShowLogo: {
      type: Boolean,
      default: true,
    },
    isBlastEmail: {
      type: Boolean,
      default: true,
    },
    isHighlight: {
      type: Boolean,
      default: false,
    },
    highlightColor: {
      type: String,
    },
    isStickyDay: {
      type: Boolean,
      default: false,
    },
    stickyDuration: {
      type: String,
      enum: STICKY_OPTIONS,
    },
    status: {
      type: String,
      enum: STATUS_OPTIONS,
      default: "pending",
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
