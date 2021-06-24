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

const COMPANY_COUNT = 500;
const JOB_COUNT = 500;
const PRIMARYTAG_OPTIONS = [
  "Software Development",
  "Customer Support",
  "Sales",
  "Marketing",
  "Design",
  "Front End",
  "Back End",
  "Legal",
  "Testing",
  "Quality Assurance",
  "Non-Tech",
  "Other",
];
const LOCATION_OPTIONS = ["worldwide", "europe", "america", "asia", "africa"];
const STICKY_OPTIONS = ["day", "week", "month"];
const STATUS_OPTIONS = ["pending", "approved", "declined"];
const SALARY_OPTIONS = Array(20)
  .fill(null)
  .map((u, i) => (i + 1) * 10000);
const COLORS_OPTIONS = [
  "#ff4742", // default color
  "#ffed51",
  "#0042aa",
  "#ff00a2",
  "#00ff00",
  "#fff9c9",
];

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
    // await User.deleteMany({});
    await User.collection.drop();
    await User.insertMany(users);

    await Media.deleteMany({});
    let array = Array(10)
      .fill(null)
      .map((a, i) => ({
        filename: faker.company.companyName(),
        url: `${_.random(1, 10)}.png`,
      }));
    const mediaData = await Media.insertMany(array);

    // await Company.deleteMany({});
    await Company.collection.drop;

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

    // await Job.deleteMany({});
    await Job.collection.drop;

    array = Array(JOB_COUNT)
      .fill(null)
      .map((a, i) => {
        console.log("seeder->jobdata");
        let job = {
          company: companyData[i]._id,
          position: faker.name.jobTitle(),
          primaryTag:
            PRIMARYTAG_OPTIONS[_.random(0, PRIMARYTAG_OPTIONS.length - 1)],
          tags: Array(_.random(3, 5))
            .fill(null)
            .map((a, i) => faker.name.jobArea()),
          location: LOCATION_OPTIONS[_.random(0, LOCATION_OPTIONS.length - 1)],
          minSalary: SALARY_OPTIONS[_.random(0, 9)],
          maxSalary: SALARY_OPTIONS[_.random(10, 19)],
          description: faker.lorem.text(),
          howtoApply: faker.lorem.text(),
          applyUrl: faker.internet.url(),
          applyEmail: faker.internet.email(),
          isShowLogo: true,
          isBlastEmail: true,
          isHighlight: _.random(1.0) > 0.5,
          highlightColor:
            _.random(1.0) > 0.5
              ? COLORS_OPTIONS[_.random(0, COLORS_OPTIONS.length - 1)]
              : null,
          isStickyDay: _.random(1.0) > 0.5,
          status: STATUS_OPTIONS[_.random(0, 2)],
        };
        if (_.random(1.0) > 0.5) {
          job.stickyDuration = STICKY_OPTIONS[_.random(0, 3)];
        }
        return job;
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
    await User.deleteMany({});
    await Media.deleteMany({});
    await Company.deleteMany({});
    await Job.deleteMany({});

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
