const mongoose = require("mongoose");

const COLLECTION = "company";
const Schema = mongoose.Schema;

const companySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // unique: true,
    },
    logo: {
      type: Schema.Types.ObjectId,
      ref: "media",
      required: true,
    },
    twitter: {
      type: String,
    },
    email: {
      type: String,
    },
    invoiceAddress: {
      type: String,
    },
    invoiceNotes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model(COLLECTION, companySchema);
module.exports = Company;
