const Dishes = require("../models/dishes");
const { getDishesFromWishList } = require("../helpers");

class DishesController {
  // [GET] /api/all_dishes
  async showAllDishes(req, res) {
    await Dishes.findAll()
      .then((dishes) => {
        res.status(200).send({
          status: true,
          data: dishes,
        });
      })
      .catch((err) => {
        res.status(400).send({
          status: false,
          data: "Error retrieving dishes",
        });
      });
  }

  // [GET] /api/filter
  async allFood(req, res) {
    const { page, limit, categories, minPrice, maxPrice, rating } = req.query;
    // raw sẽ là muốn lấy object thuần, không muốn lấy mặc định của sequelize
    // nest sẽ là lấy data của bảng khác thông quá khóa ngoại
    const queries = { raw: true, nest: true };
    const offset = !page || +page < 1 ? 0 : +page - 1;
    queries.offset = offset * limit;

    await Dishes.findAll({
      where: { categoryID: categories },
    })
      .then((dishes) => {
        res.status(200).send({
          status: true,
          data: dishes,
        });
      })
      .catch((err) => {
        res.status(400).send({
          status: false,
          data: "Error retrieving dishes",
        });
      });
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
