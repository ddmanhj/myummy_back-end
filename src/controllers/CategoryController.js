const Dishes = require("../models/dishes");
const Category = require("../models/category");

class CategoryController {
  // [GET] /api/menu
  async showAllCategory(req, res) {
    await Category.findAll()
      .then((category) => {
        res.status(200).send({
          message: "Success",
          data: category,
        });
      })
      .catch((err) => {
        res.status(400).send({
          message:
            err.message || "Some error occurred while retrieving category.",
        });
      });
  }

  // [GET] /api/special_menu/:slug
  async showSpecialFoodOfCategoryById(req, res) {
    await Dishes.findAll({
      where: {
        categoryID: req.params.slug,
        isPopular: true,
      },
      attributes: ["id", "dishName", "price", "urlImageDish"],
    })
      .then((category) => {
        res.status(200).send({
          message: "Success",
          data: category,
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err,
        });
      });
  }
}

module.exports = new CategoryController();
