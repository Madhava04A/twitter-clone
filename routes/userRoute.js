const express = require("express");
const userController = require("../controllers/user");
const authController = require("../controllers/auth");

const router = express.Router();

router.use(authController.authorizeUser);

router
  .route("/")
  .get(authController.restrictRoutes("ADMIN"), userController.getAllUsers);

router.get("/:userId", userController.getUser);

module.exports = router;
