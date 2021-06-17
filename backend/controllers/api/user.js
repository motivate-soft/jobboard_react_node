var async = require("async");
var _ = require("lodash");
var UserSchema = require("../models/user");
const logger = require("../../helpers/logger");

var apiUsers = {};

apiUsers.create = function (req, res) {
  var response = {};
  response.success = true;

  var postData = req.body;

  if (_.isUndefined(postData) || !_.isObject(postData)) {
    return res.status(400).json({ success: false, error: "Invalid Post Data" });
  }

  var propCheck = ["username", "password", "email", "isAdmin"];

  if (
    !_.every(propCheck, function (x) {
      return x in postData;
    })
  ) {
    return res.status(400).json({ success: false, error: "Invalid Post Data" });
  }

  var account = new UserSchema({
    username: postData.username,
    password: postData.password,
    firstName: postData.firstName,
    lastName: postData.lastName,
    email: postData.email,
    isAdmin: postData.isAdmin,
  });

  account.save(function (err, a) {
    if (err) {
      response.success = false;
      response.error = err;
      logger.debug(response);
      return res.status(400).json(response);
    }
  });
};

apiUsers.update = function (req, res) {
  var username = req.params.username;
  if (_.isNull(username) || _.isUndefined(username))
    return res.status(400).json({ success: false, error: "Invalid Post Data" });

  var data = req.body;
  var obj = {
    username: data.username,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    isAdmin: data.isAdmin,
  };

  async.series(
    {
      function(done) {
        UserSchema.getUserByUsername(username, function (err, user) {
          if (err) return done(err);
          if (!user) return done("Invalid User Object");

          obj._id = user._id;

          if (!_.isUndefined(obj.password) && !_.isEmpty(obj.password)) {
            user.password = obj.password;
          }
          if (!_.isUndefined(obj.firstName) && obj.firstName.length > 0)
            user.firstName = obj.firstName;
          if (!_.isUndefined(obj.lastName) && obj.lastName.length > 0)
            user.lastName = obj.lastName;
          if (!_.isUndefined(obj.email) && obj.email.length > 0)
            user.email = obj.email;
          if (!_.isUndefined(obj.isAdmin) && obj.isAdmin.length > 0)
            user.isAdmin = obj.isAdmin;

          user.save(function (err, nUser) {
            if (err) return done(err);
          });
        });
      },
    },
    function (err, results) {
      if (err) {
        logger.debug(err);
        return res.status(400).json({ success: false, error: err });
      }
      var user = results.user.toJSON();

      return res.json({ success: true, user: user });
    }
  );
};

apiUsers.deleteUser = function (req, res) {
  var username = req.params.username;

  if (_.isUndefined(username) || _.isNull(username))
    return res.status(400).json({ error: "Invalid Request" });

  async.waterfall(
    [
      function (cb) {
        UserSchema.getUserByUsername(username, function (err, user) {
          if (err) return cb(err);

          if (_.isNull(user)) {
            return cb({ message: "Invalid User" });
          }

          if (user.username.toLowerCase() === req.user.username) {
            return cb({ message: "Cannot remove yourself!" });
          }

          return cb(null, user);
        });
      },
    ],
    function (err, disabled) {
      if (err)
        return res.status(400).json({ success: false, error: err.message });

      return res.json({ success: true, disabled: disabled });
    }
  );
};

/**
 * @api {get} /api/v1/users/:username Get User
 * @apiName getUser
 * @apiDescription Gets the user via the given username
 * @apiVersion 0.1.0
 * @apiGroup User
 * @apiHeader {string} accesstoken The access token for the logged in user
 * @apiExample Example usage:
 * curl -H "accesstoken: {accesstoken}" -l http://localhost/api/v1/users/:username
 *
 * @apiSuccess {object}     _id                 The MongoDB ID
 * @apiSuccess {string}     username            Username of the User
 * @apiSuccess {string}     fullname            Fullname of the User
 * @apiSuccess {string}     email               Email Address of the User
 * @apiSuccess {string}     role                Assigned Permission Role of the user
 * @apiSuccess {string}     title               Title of the User
 * @apiSuccess {string}     image               Image filename for the user's profile picture
 * @apiSuccess {array}      iOSDeviceTokens     iOS Device Tokens for push notifications
 *
 *
 * @apiError InvalidRequest The request was invalid
 * @apiErrorExample
 *      HTTP/1.1 400 Bad Request
 {
     "error": "Invalid Request"
 }
 */
apiUsers.single = function (req, res) {
  var username = req.params.username;
  if (_.isUndefined(username))
    return res.status(400).json({ error: "Invalid Request." });

  var response = {
    success: true,
    groups: [],
  };

  async.waterfall(
    [
      function (done) {
        UserSchema.getUserByUsername(username, function (err, user) {
          if (err) return done(err);

          if (_.isUndefined(user) || _.isNull(user))
            return done("Invalid Request");

          user = stripUserFields(user);
          response.user = user;

          done(null, user);
        });
      },
      function (user, done) {
        groupSchema.getAllGroupsOfUserNoPopulate(user._id, function (
          err,
          grps
        ) {
          if (err) return done(err);

          response.groups = _.map(grps, function (o) {
            return o._id;
          });

          done(null, response.groups);
        });
      },
    ],
    function (err) {
      if (err) return res.status(400).json({ error: err });

      res.json(response);
    }
  );
};
