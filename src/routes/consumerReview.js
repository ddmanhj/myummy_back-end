const express = require("express");
const router = express.Router();

const ConsumerReviewController = require("../controllers/ConsumerReviewController");
const middlewareController = require("../middleWare/AuthCustomerController");

//Get reviews of a dish
router.get("/consumer_review", ConsumerReviewController.reviewComments);

//Create a review
router.post(
  "/consumer_review",
  middlewareController.verifyToken,
  ConsumerReviewController.createReview
);

module.exports = router;
