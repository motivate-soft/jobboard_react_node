const apiController = {};

apiController.email = require("./api/email");
apiController.payment = require("./api/payment");
apiController.auth = require("./api/auth");
apiController.user = require("./api/user");
apiController.media = require("./api/media");
apiController.company = require("./api/company");
apiController.job = require("./api/job");

module.exports = apiController;
