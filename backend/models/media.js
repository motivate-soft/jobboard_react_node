var mongoose = require("mongoose");
const logger = require("../helpers/logger");

const Schema = mongoose.Schema;

var COLLECTION = "media";

var mediaSchema = mongoose.Schema(
  {
    url: { type: String, require: true },
    filename: { type: String, required: true },
    //   _recInfo: {
    //     createdAt: { type: Date, required: true },
    //     createdBy: { type: Schema.Types.ObjectId, ref: "company", required: false },
    //     updatedAt: { type: Date, required: true },
    //     updatedBy: { type: Schema.Types.ObjectId, ref: "company", required: false },
    //   },
  },
  {
    timestamps: true,
  }
);

// mediaSchema.pre("validate", function (next) {
//   logger.debug("Attempting validation on Media Record");

//   now = new Date();
//   this._recInfo.updatedAt = now;
//   if (!this._recInfo.createdAt) {
//     loggerlog("debug", "Media Record is being Added");
//     this._recInfo.createdAt = now;
//   } else {
//     loggerlog("debug", "Media Record is being Updated");
//   }
//   next();
// });

mediaSchema.statics = {
  findAll: function (callback) {
    return this.model(COLLECTION).find({}, callback);
  },
};

mediaSchema.methods = {};

Media = mongoose.model(COLLECTION, mediaSchema);
module.exports = Media;
