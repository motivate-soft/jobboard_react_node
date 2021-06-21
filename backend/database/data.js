const bcrypt = require("bcrypt");

module.exports.users = [
  {
    firstName: "Jhon",
    lastName: "Doe",
    email: "admin@email.com",
    username: "admin2021",
    password: bcrypt.hashSync("password", 10),
    isAdmin: true,
  },
  {
    firstName: "Robert",
    lastName: "Popescu",
    email: "admin@admin.com",
    username: "admin",
    password: bcrypt.hashSync("password", 10),
    isAdmin: true,
  },
];


