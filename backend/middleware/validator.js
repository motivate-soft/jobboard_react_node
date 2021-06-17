const { check, buildCheckFunction } = require("express-validator");
const checkBodyAndParams = buildCheckFunction(["body", "params"]);

module.exports.validate = (method) => {
  switch (method) {
    case "register": {
      return [
        check("firstName", "firstName name is required").not().isEmpty(),
        check("lastName", "lastName name is required").not().isEmpty(),
        check("username", "username name is required").not().isEmpty(),
        check("email", "email name is required").isEmail(),
        check("password", "password name is required").isLength({ min: 8 }),
        check("isAdmin", "isAdmin name is required").isBoolean(),
      ];
    }
    case "login": {
      return [
        check("email", "Please include a valid email").isEmail(),
        check(
          "password",
          "Please enter a password with 8 or more characters"
        ).isLength({ min: 8 }),
      ];
    }
    case "createUser": {
      return [
        check("firstName", "firstName name is required").not().isEmpty(),
        check("lastName", "lastName name is required").not().isEmpty(),
        check("username", "username name is required").not().isEmpty(),
        check("email", "email name is required").isEmail(),
      ];
    }
  }
};
