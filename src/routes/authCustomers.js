const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/register", authController.registerCustomer);
router.post("/login", authController.loginCustomer);
router.post("/refresh_token", authController.requestRefreshToken);
router.post("/logout", authController.logout);

module.exports = router;
