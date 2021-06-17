const pkg = require("../../package.json");

module.exports = function (middleware, router, controllers) {
  const apiCtrl = controllers.api;

  router.get("/api/version", function (req, res) {
    return res.json({ version: pkg.version });
  });

  // auth
  router.post("/api/auth/login", apiCtrl.auth.login);
  router.post("/api/auth/register", apiCtrl.auth.register);
};
