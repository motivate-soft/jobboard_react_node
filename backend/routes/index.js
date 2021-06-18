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
  router.get("/", function (req, res) {
    return res.status(200).send("Job board api is working...");
  });

  // API
  require("../controllers/api/routes")(middleware, router, controllers);
}

function handleErrors(err, req, res) {
  var status = err.status || 500;
  return res.status(status).send(err.message);
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
