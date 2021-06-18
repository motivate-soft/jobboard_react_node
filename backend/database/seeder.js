const mongoose = require("mongoose");
const nconf = require("nconf");
const logger = require("../helpers/logger");
const User = require("../models/user");
const { users } = require("./data");

nconf.file(`./config/default.json`);
const CONNECTION_URI = nconf.get("mongoURI");

let options = {
  keepAlive: 1,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

const connectDB = async () => {
  try {
    mongoose.connect(CONNECTION_URI, options);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Something went wrong with DB! - " + error.message);
  }
};

const importData = async () => {
  await connectDB();
  try {
    await User.deleteMany();
    await User.insertMany(users);

    logger.info("Seed data imported!");
    process.exit();
  } catch (error) {
    logger.error(`${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  await connectDB();
  try {
    await User.deleteMany();

    logger.info("Seed data deleted!");
    process.exit();
  } catch (error) {
    logger.error(`${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
