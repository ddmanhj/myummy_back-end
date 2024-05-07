const express = require("express");
const router = express.Router();

const CategoryController = require("../controllers/CategoryController");
const authController = require("../controllers/authController");
const middlewareController = require("../middleWare/AuthCustomerController");

//Movie now showing
router.get("/menu", CategoryController.showAllCategory);
router.get("/special_menu/:slug", CategoryController.showFoodOfCategoryById);

module.exports = router;
