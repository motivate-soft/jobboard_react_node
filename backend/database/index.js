const nconf = require("nconf");
const mongoose = require("mongoose");
const logger = require("../helpers/logger");

let db = {};
const CONNECTION_URI = nconf.get("mongoURI");

let options = {
  keepAlive: 1,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

module.exports.init = function (callback, connectionString, opts) {
  if (connectionString) CONNECTION_URI = connectionString;

  if (db.connection) {
    return callback(null, db);
  }

  global.CONNECTION_URI = CONNECTION_URI;

  mongoose.Promise = global.Promise;
  mongoose
    .connect(CONNECTION_URI, options)
    .then(function () {
      if (!process.env.FORK) {
        logger.info("Connected to MongoDB");
      }

      db.connection = mongoose.connection;
      mongoose.connection.db
        .admin()
        .command({ buildInfo: 1 }, function (err, info) {
          if (err) logger.warn(err.message);
          db.version = info.version;
          return callback(null, db);
        });
    })
    .catch(function (e) {
      logger.error("Oh no, something went wrong with DB! - " + e.message);
      db.connection = null;

      return callback(e, null);
    });
};

module.exports.db = db;
module.exports.connectionuri = CONNECTION_URI;
