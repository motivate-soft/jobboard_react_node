const pkg = require("../../package.json");
var multer = require("multer");
const { validate } = require("../../middleware/validator");
const path = require("path");
const logger = require("../../helpers/logger");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename(req, file, cb) {
    console.log("storage->filename", file);
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    req.errorCode = "invalidFormat";
    return cb(false);
  }
};

const uploadPhoto = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = function (middleware, router, controllers) {
  const apiCtrl = controllers.api;
  /**
   *  Common api
   */
  router.get("/api/version", function (req, res) {
    return res.json({ version: pkg.version });
  });

  /**
   *  Media api
   */
  router.post("/api/media/", uploadPhoto.single("file"), apiCtrl.media.create);

  /**
   *  Email api
   */
  router.post("/api/email/newsletter", apiCtrl.email.newsletter);

  /**
   *  Payment api
   */
  // router.post("/api/payment/postCharge", apiCtrl.payment.postCharge);

  /**
   *  Auth api
   */
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

  /**
   *  User api
   */
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

  /**
   *  Company api
   */
  router.post(
    "/api/company/",
    validate("createCompany"),
    apiCtrl.company.create
  );
  router.get("/api/company/:id", apiCtrl.company.retrieve);

  // admin
  router.put(
    "/api/company/:id",
    validate("updateCompany"),
    middleware.checkAuth,
    middleware.checkRole("admin"),
    apiCtrl.company.update
  );
  router.delete(
    "/api/company/:id",
    middleware.checkAuth,
    middleware.checkRole("admin"),
    apiCtrl.company.delete
  );

  /**
   *  Job api
   */

  // user api
  router.get("/api/job/listing", apiCtrl.job.listing);
  router.get("/api/job/listing/:id", apiCtrl.job.detail);
  router.post("/api/job/", validate("createJob"), apiCtrl.job.create);

  // admin
  router.get(
    "/api/job-filters/",
    middleware.checkAuth,
    middleware.checkRole("admin"),
    apiCtrl.job.getFilter
  );
  router.get(
    "/api/job",
    middleware.checkAuth,
    middleware.checkRole("admin"),
    apiCtrl.job.paginate
  );
  router.get(
    "/api/job/:id",
    middleware.checkAuth,
    middleware.checkRole("admin"),
    apiCtrl.job.retrieve
  );
  router.put(
    "/api/job/:id",
    middleware.checkAuth,
    middleware.checkRole("admin"),
    validate("updateJob"),
    apiCtrl.job.update
  );
  router.delete(
    "/api/job/:id",
    middleware.checkAuth,
    middleware.checkRole("admin"),
    apiCtrl.job.delete
  );
};
