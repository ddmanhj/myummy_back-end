const Dishes = require("../models/dishes");
const { getDishesFromWishList } = require("../helpers");

class DishesController {
  // [GET] /api/all_dishes
  async showAllDishes(req, res) {
    await Dishes.findAll()
      .then((dishes) => {
        res.status(200).send({
          message: "Success",
          data: dishes,
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: "Error retrieving dishes",
        });
      });
  }

  // [GET] /api/filter
  async allFood(req, res) {
    const { page, offset, categories, minPrice, maxPrice, rating } = req.query;
    const categoriesList = [];
    if (categories) {
      categories.split(",").forEach((category) => {
        categoriesList.push(Number(category));
      });
    }
    res.status(200).send({ data: "", status: true });
  }

  // [POST] /api/dishes_by_wish_list
  async showDishesByWishList(req, res) {
    const customerId = req.query.customerID;
    const resultDishByWishList = await getDishesFromWishList(customerId);
    if (resultDishByWishList) {
      res.status(200).send({
        status: true,
        data: resultDishByWishList,
      });
    } else {
      res.status(400).send({
        status: false,
        data: "Error retrieving dishes by wish list",
      });
    }
  }
}

module.exports = new DishesController();
