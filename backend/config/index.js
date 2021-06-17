const nconf = require("nconf");
const Chance = require("chance");
const chance = new Chance();

nconf.defaults({
  base_dir: __dirname,
  tokens: {
    secret: chance.hash() + chance.md5(),
    expires: 900,
  },
});
nconf.argv().env();
nconf.file(`${__dirname}/default.json`);
