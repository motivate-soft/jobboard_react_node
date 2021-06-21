const mongoose = require("mongoose");
const nconf = require("nconf");
const faker = require("faker");
const logger = require("../helpers/logger");
const User = require("../models/user");
const Media = require("../models/media");
const Company = require("../models/company");
const Job = require("../models/job");
const { users } = require("./data");
const _ = require("lodash");

nconf.file(`./config/default.json`);
const CONNECTION_URI = nconf.get("mongoURI");

const COMPANY_COUNT = 100;
const JOB_COUNT = 100;
const LOCATION_OPTIONS = ["worldwide", "europe", "america", "asia", "africa"];
const STICKY_OPTIONS = ["week", "month"];
const STATUS_OPTIONS = ["approved", "pending"];

const SALEARY_OPTIONS = Array(20)
  .fill(null)
  .map((u, i) => (i + 1) * 10000);

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

    await Media.deleteMany();
    let array = Array(10)
      .fill(null)
      .map((a, i) => ({
        filename: faker.company.companyName(),
        url: `${_.random(1, 10)}.png`,
      }));
    const mediaData = await Media.insertMany(array);

    await Company.deleteMany();
    array = Array(COMPANY_COUNT)
      .fill(null)
      .map((a, i) => {
        let ranInt = _.random(0, 9);
        logger.info(mediaData[ranInt]);

        return {
          name: faker.company.companyName(),
          logo: mediaData[ranInt]._id,
          twitter: faker.internet.userName(),
          email: faker.internet.email(),
          invoiceAddress: `${faker.address.cityName()},${faker.address.country()}`,
          invoiceNotes: faker.lorem.text(),
        };
      });
    const companyData = await Company.insertMany(array);

    await Job.deleteMany();
    array = Array(JOB_COUNT)
      .fill(null)
      .map((a, i) => {
        console.log("seeder->jobdata");
        return {
          company: companyData[i]._id,
          position: faker.name.jobTitle(),
          primaryTag: faker.name.jobArea(),
          tags: Array(_.random(3, 5))
            .fill(null)
            .map((a, i) => faker.name.jobArea()),
          location: LOCATION_OPTIONS[_.random(0, LOCATION_OPTIONS.length - 1)],
          minSalary: SALEARY_OPTIONS[_.random(0, 9)],
          maxSalary: SALEARY_OPTIONS[_.random(10, 19)],
          jobDescription: faker.lorem.text(),
          howtoApply: faker.lorem.text(),
          applyUrl: faker.internet.url(),
          applyEmailL: faker.internet.email(),
          isShowLogo: true,
          isBlastEmail: true,
          isHighlight: _.random(1.0) > 0.5,
          highlightColor: faker.internet.color(),
          isStickyDay: _.random(1.0) > 0.5,
          stickyDuration: STICKY_OPTIONS[_.random(0, 1)],
          status: STATUS_OPTIONS[_.random(0, 1)],
        };
      });
    const jobData = await Job.insertMany(array);

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
