const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

var SALT_FACTOR = 10;
var COLLECTION = "user";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(SALT_FACTOR);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.statics = {
  findAll: function (callback) {
    return this.model(COLLECTION).find({}, callback);
  },
  getFullUserByEmail: function (email, callback) {
    if (_.isUndefined(email)) {
      return callback("Invalid email - UserSchema.getFullUserByEmail()", null);
    }
    return this.model(COLLECTION)
      .findOne({ email: email.toLowerCase() })
      .select("+password")
      .exec(callback);
  },
  getUserById: function (oId, callback) {
    if (_.isUndefined(oId)) {
      return callback("Invalid ObjectId - UserSchema.getUserById()", null);
    }
    return this.model(COLLECTION).findOne({ _id: oId }, callback);
  },
  getUserByEmail: function (email, callback) {
    if (_.isUndefined(email)) {
      return callback("Invalid Email - UserSchema.getUserByEmail()", null);
    }

    return this.model(COLLECTION).findOne(
      { email: email.toLowerCase() },
      callback
    );
  },
  getUserByUsername: function (user, callback) {
    if (_.isUndefined(user)) {
      return callback(
        "Invalid Username - UserSchema.GetUserByUsername()",
        null
      );
    }

    return this.model(COLLECTION)
      .findOne({ username: new RegExp("^" + user + "$", "i") })
      .select("+email +fullName")
      .exec(callback);
  },
};

userSchema
  .virtual("fullName")
  .get(function () {
    return this.firstName + " " + this.lastName;
  })
  .set(function (fullName) {
    var parts = fullName.split(" ");
    this.firstName = parts[0];
    this.lastName = parts[1];
  });

const User = mongoose.model(COLLECTION, userSchema);

module.exports = User;
