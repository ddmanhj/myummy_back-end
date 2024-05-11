const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.registerCustomer);
router.post("/login", authController.loginCustomer);
router.post("/refresh_token", authController.requestRefreshToken);
router.post("/logout", authController.logout);

module.exports = router;
