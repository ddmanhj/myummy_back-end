const express = require("express");
const router = express.Router();
const middlewareController = require("../middleWare/AuthCustomerController");

const CategoryController = require("../controllers/CategoryController");
const DishesController = require("../controllers/DishesController");

// Menu
router.get("/menu", CategoryController.showAllCategory);
router.get(
  "/special_menu/:slug",
  CategoryController.showSpecialFoodOfCategoryById
);

// all list Dishes + filter
router.get("/all_food", DishesController.allFood);
// Dishes by ID
router.get("/dish/:id", DishesController.dishByID);
// Random dishes
router.get("/random_dishes", DishesController.randomDishes);

// Show dishes by wish list
router.get(
  "/dishes_by_wish_list",
  middlewareController.verifyToken,
  DishesController.showDishesByWishList
);

module.exports = router;
