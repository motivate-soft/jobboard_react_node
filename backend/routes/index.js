const express = require("express");
const router = express.Router();
const controllers = require("../controllers");
const winston = require("winston");
const packagejson = require("../package.json");
const logger = require("../helpers/logger");

module.exports = router;

function mainRoutes(router, middleware, controllers) {
  router.get("/healthz", function (req, res) {
    return res.status(200).send("OK");
  });
  router.get("/version", function (req, res) {
    return res.json({ version: packagejson.version });
  });

  // API
  require("../controllers/api/routes")(middleware, router, controllers);
}

function handleErrors(err, req, res) {
  var status = err.status || 500;
  res.status(err.status);

  if (status === 404) {
    res.render("404", { layout: false });
    return;
  }

  if (status === 503) {
    res.render("503", { layout: false });
    return;
  }

  logger.warn(err.stack);

  return res.status(404).send({
    message: err.message,
    error: err,
    layout: false,
  });
}

function handle404(req, res) {
  logger.warn("404, not found");
  return res.status(404).send("Not found");
}

module.exports = function (app, middleware) {
  mainRoutes(router, middleware, controllers);
  app.use("/", router);

  app.use(handle404);
  app.use(handleErrors);
};
