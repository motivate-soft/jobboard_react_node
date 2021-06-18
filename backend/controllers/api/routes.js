const pkg = require("../../package.json");
const validator = require("../../middleware/validator");

module.exports = function (middleware, router, controllers) {
  const apiCtrl = controllers.api;

  router.get("/api/version", function (req, res) {
    return res.json({ version: pkg.version });
  });

  // auth
  router.post(
    "/api/auth/login",
    validator.validate("login"),
    apiCtrl.auth.login
  );
  router.post(
    "/api/auth/register",
    validator.validate("register"),
    apiCtrl.auth.register
  );
  router.put(
    "/api/auth/",
    validator.validate("profile"),
    middleware.checkAuth,
    apiCtrl.auth.updateProfile
  );
  router.post(
    "/api/password/change",
    validator.validate("changePassword"),
    middleware.checkAuth,
    apiCtrl.auth.changePassword
  );
};
