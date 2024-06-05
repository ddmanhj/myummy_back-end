const express = require("express");
const router = express.Router();
const multer = require("multer");

const middlewareController = require("../middleWare/AuthCustomerController");
const ProfileController = require("../controllers/ProfileController");

const upload = multer({ dest: "uploads/" });

//Profile
router.post(
  "/edit_profile",
  middlewareController.verifyToken,
  upload.single("urlImageAvatar"),
  ProfileController.changeProfile
);

module.exports = router;
