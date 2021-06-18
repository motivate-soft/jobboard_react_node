const apiController = {};

apiController.auth = require("./api/auth");
apiController.user = require("./api/user");

module.exports = apiController;
