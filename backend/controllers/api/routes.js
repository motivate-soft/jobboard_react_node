const pkg = require("../../package.json");
const { validate } = require("../../middleware/validator");

module.exports = function (middleware, router, controllers) {
  const apiCtrl = controllers.api;

  router.get("/api/version", function (req, res) {
    return res.json({ version: pkg.version });
  });

  // auth
  router.post("/api/auth/login", validate("login"), apiCtrl.auth.login);
  router.post(
    "/api/auth/register",
    validate("register"),
    apiCtrl.auth.register
  );
  router.put(
    "/api/auth/",
    validate("profile"),
    middleware.checkAuth,
    apiCtrl.auth.updateProfile
  );
  router.post(
    "/api/password/change",
    validate("changePassword"),
    middleware.checkAuth,
    apiCtrl.auth.changePassword
  );

  // user
  router.get(
    "/api/user/",
    middleware.checkAuth,
    middleware.checkRole("admin"),
    apiCtrl.user.getAll
  );
  router.post(
    "/api/user/",
    validate("createUser"),
    middleware.checkAuth,
    middleware.checkRole("admin"),
    apiCtrl.user.create
  );
  router.get(
    "/api/user/:id",
    middleware.checkAuth,
    middleware.checkRole("admin"),
    apiCtrl.user.retrieve
  );
  router.put(
    "/api/user/:id",
    validate("updateUser"),
    middleware.checkAuth,
    middleware.checkRole("admin"),
    apiCtrl.user.update
  );
  router.delete(
    "/api/user/:id",
    middleware.checkAuth,
    middleware.checkRole("admin"),
    apiCtrl.user.delete
  );
};
