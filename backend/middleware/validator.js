const { check, body, buildCheckFunction } = require("express-validator");
const { stickyOptions, statusOptions } = require("../models/job");
const checkBodyAndParams = buildCheckFunction(["body", "params"]);

module.exports.validate = (method) => {
  switch (method) {
    // Auth
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

    case "profile": {
      return [
        check("firstName", "firstName name is required").not().isEmpty(),
        check("lastName", "lastName name is required").not().isEmpty(),
        check("username", "username name is required").not().isEmpty(),
        check("email", "email name is required").isEmail(),
      ];
    }
    case "changePassword": {
      return [
        check("currentPassword", "Current password is required")
          .not()
          .isEmpty(),
        check(
          "newPassword",
          "Please enter a password with 8 or more characters"
        )
          .isLength({ min: 8 })
          .custom((value, { req, loc, path }) => {
            if (value !== req.body.confirmPassword) {
              throw new Error("Passwords don't match");
            } else {
              return value;
            }
          }),
      ];
    }

    // User
    case "createUser": {
      return [
        check("firstName", "firstName name is required").not().isEmpty(),
        check("lastName", "lastName name is required").not().isEmpty(),
        check("username", "username name is required").not().isEmpty(),
        check("email", "email name is required").isEmail(),
      ];
    }
    case "updateUser": {
      return [
        check("firstName", "firstName name is required").not().isEmpty(),
        check("lastName", "lastName name is required").not().isEmpty(),
        check("username", "username name is required").not().isEmpty(),
        check("email", "email name is required").isEmail(),
      ];
    }

    // Company
    case "createCompany":
    case "updateCompany": {
      return [
        check("name", "company logo is required").not().isEmpty(),
        check("logo", "company logo is required").not().isEmpty(),
        check("twitter", "company twitter is required").optional(),
        check("email", "company email is required").not().isEmpty(),
        check("invoiceAddress", "invoice address is required").optional(),
        check("invoiceNotes", "invoice notes is required").optional(),
      ];
    }

    // Job
    case "createJob":
    case "updateJob": {
      return [
        check("company", "company is required").not().isEmpty(),
        check("position", "position is required").not().isEmpty(),
        check("primaryTag", "primaryTag is required").not().isEmpty(),
        check("tags", "tags are required").not().isEmpty(),
        check("location", "location is required").not().isEmpty(),
        check("minSalary", "minSalary is required").not().isEmpty(),
        check("maxSalary", "maxSalary is required").not().isEmpty(),
        check("description", "description is required").not().isEmpty(),
        check("howtoApply", "howtoApply is required").not().isEmpty(),
        check("applyUrl")
          .isURL()
          .withMessage("apply Url is not valid")
          .optional(),
        check("applyEmail")
          .isEmail()
          .withMessage("apply email is not valid")
          .optional(),

        check("showLogo", "showLogo is required").isBoolean(),
        check("blastEmail", "blastEmail is required").isBoolean(),
        check("highlight", "highlight is required").isBoolean(),
        check("highlightColor", "highlightColor is required").isBoolean(),
        // check brandColor if highlightColor is true
        check("brandColor")
          .if(body("highlightColor").equals("true"))
          .not()
          .isEmpty()
          .withMessage("brandColor is requiered")
          .isHexColor()
          .withMessage("brandColor is not valid"),
        // sticky duration validation
        check("stickyDuration", "stickyDuration is not valid")
          .optional()
          .isIn(stickyOptions),
        // .optional({nullable: true}),
        // .optional({checkFalsy: true}),
      ];
    }
  }
};
