const dotenv = require("dotenv");
// require("dotenv").config({
//   path: `.env`,
// });
require('dotenv/config')

console.log(`craco.config.js`, process.env.REACT_APP_API_URL);

module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
};
