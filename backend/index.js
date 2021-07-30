const express = require("express");
const app = express();
const nconf = require("nconf");

const routes = require("./routes");
const middleware = require("./middleware/middleware")(app);
const winston = require("winston");
const pkg = require("./package.json");
const path = require("path");
const router = express.Router();
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const cors = require("cors");
const passport = require("passport");
const logger = require("./helpers/logger");

require("./config");

global.forks = [];

global.env = process.env.NODE_ENV || "development";
// global.env = process.env.NODE_ENV || 'production';

if (!process.env.FORK) {
  logger.info("jobboard api v" + pkg.version);
  logger.info("Running in: " + global.env);
  logger.info("Server Time: " + new Date());
}

function start() {
  let _db = require("./database");

  _db.init(function (err, db) {
    if (err) {
      logger.error("FETAL: " + err.message);
    } else {
      launchServer(db);
    }
  });
}

function launchServer(db) {
  require("./config");
  app.use(cors());
  app.use(passport.initialize());

  app.use(
    "/assets",
    express.static(path.join(__dirname, "./public/uploads/assets"))
  );

  app.use(express.static(path.join(__dirname, "./public")));
  // app.use(favicon(path.join(__dirname, "./public/images/favicon.ico")));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  require("./config/passport");
  routes(app, middleware);

  let port = nconf.get("serverPort") || 5000;

  const serverInstance = app
    .listen(port, () => {
      logger.info(`Jobboard API is running on port ${port}`);
    })
    .on("error", function (err) {
      if (err.errno === "EADDRINUSE") {
        logger.error(
          `----- Port ${port} is busy, trying with port ${port + 1} -----`
        );
        port += 1;
        serverInstance.listen(port);
      } else {
        logger.error(err);
      }
    });

  return serverInstance;
}

start();
