const { createLogger, format, transports } = require("winston");
const winston = require("winston");
const moment = require("moment");
const { combine, timestamp, label, printf, colorize } = format;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: global.env === "production" ? "info" : "verbose",
  // format: winston.format.json(),
  format: combine(
    colorize(),
    label({ label: "winston log" }),
    timestamp(),
    logFormat
  ),
  defaultMeta: { service: "jobboard-api-service" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/server.log" }),
    new winston.transports.Console(),
  ],
});

module.exports = logger;
