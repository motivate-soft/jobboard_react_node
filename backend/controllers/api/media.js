const Media = require("../../models/media");
const path = require("path");
const { handleError } = require("../../helpers/handlers");
const logger = require("../../helpers/logger");

exports.create = async (req, res) => {
  logger.info("mediaApi->create");
  logger.info(req.file);
  try {
    if (req.errorCode) {
      return handleError(
        res,
        req,
        400,
        "File format is invalid",
        req.errorCode
      );
    }
    if (!req.file) {
      logger.debug("No file was uploaded");
      return handleError(res, req, 400, {}, "no file", "missingData");
    }
    const extension = path.extname(req.file.originalname);
    const filename = path.basename(req.file.originalname, extension);

    let media = new Media({
      filename,
      url: req.file.filename,
    });
    media.save();

    return res.status(201).json(media);
  } catch (err) {
    logger.error("mediaApi->create" + err.message);

    return handleError(res, req, 500, err, "invalidMedia");
  }
};
