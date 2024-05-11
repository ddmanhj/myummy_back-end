const express = require("express");
const router = express.Router();

const middlewareController = require("../middleWare/AuthCustomerController");
const WishListController = require("../controllers/WishListController");

// Wish list
router.post(
  "/add_wish_list",
  middlewareController.verifyToken,
  WishListController.addDishToWishList
);
router.post(
  "/delete_wish_list",
  middlewareController.verifyToken,
  WishListController.deleteDishInWishList
);

module.exports = router;
