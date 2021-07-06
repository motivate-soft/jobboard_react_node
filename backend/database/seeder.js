const mongoose = require("mongoose");
const nconf = require("nconf");
const faker = require("faker");
const logger = require("../helpers/logger");
const User = require("../models/user");
const Media = require("../models/media");
const Company = require("../models/company");
const Job = require("../models/job");
const { stickyOptions, statusOptions } = require("../models/job");
const { users } = require("./data");
const _ = require("lodash");

require("../config");
const CONNECTION_URI = nconf.get("mongoURI");

const companyCount = 500;
const jobCount = 500;
const primarytagOptions = [
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
const locationOptions = ["worldwide", "europe", "america", "asia", "africa"];
const salaryOptions = Array(20)
  .fill(null)
  .map((u, i) => (i + 1) * 10000);
const colorOptions = [
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
    conn = await mongoose.connect(CONNECTION_URI, options);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error("Falied to connect to MongoDB! - " + error.message);
  }
};

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

const importData = async () => {
  connectDB();
  try {
    await User.deleteMany({});
    await User.insertMany(users);

    await Media.deleteMany({});
    let array = Array(10)
      .fill(null)
      .map((a, i) => ({
        filename: faker.company.companyName(),
        url: `${_.random(1, 10)}.png`,
      }));
    const mediaData = await Media.insertMany(array);

    await Company.deleteMany({});

    array = Array(companyCount)
      .fill(null)
      .map((a, i) => {
        let ranInt = _.random(0, 9);

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

    await Job.deleteMany({});

    array = Array(jobCount)
      .fill(null)
      .map((a, i) => {
        let job = {
          company: companyData[i]._id,
          position: faker.name.jobTitle(),
          primaryTag:
            primarytagOptions[_.random(0, primarytagOptions.length - 1)],
          tags: Array(_.random(3, 5))
            .fill(null)
            .map((a, i) => faker.name.jobArea()),
          location: locationOptions[_.random(0, locationOptions.length - 1)],
          minSalary: salaryOptions[_.random(0, 9)],
          maxSalary: salaryOptions[_.random(10, 19)],
          description: faker.lorem.text(),
          howtoApply: faker.lorem.text(),
          applyUrl: faker.internet.url(),
          applyEmail: faker.internet.email(),
          showLogo: true,
          blastEmail: true,
          status: statusOptions[_.random(0, 2)],
          createdAt: randomDate(new Date(2021, 5, 10), new Date()),
        };
        job.highlight = _.random(1.0) > 0.5;
        if (!job.highlight) {
          if (_.random(1.0) > 0.5) {
            job.highlightColor = true;
            job.brandColor = colorOptions[_.random(0, colorOptions.length - 1)];
          }
        }
        if (_.random(1.0) > 0.5) {
          job.stickyDuration = stickyOptions[_.random(0, 3)];
        }
        return job;
      });
    const jobData = await Job.insertMany(array);

    logger.info("Seed data imported successfully!");
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
