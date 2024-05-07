const { Category, Dishes } = require("../models");

class CategoryController {
  // [GET] /api/menu
  async showAllCategory(req, res) {
    Category.findAll()
      .then((category) => {
        res.status(200).send({
          message: "Success",
          data: category,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving category.",
        });
      });
  }

  // [GET] /api/special_menu/:slug
  async showFoodOfCategoryById(req, res) {
    Dishes.findAll({
      where: {
        categoryID: req.params.slug,
        isPopular: true,
      },
    })
      .then((category) => {
        res.status(200).send({
          message: "Success",
          data: category,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error retrieving category with id=" + id,
        });
      });
  }
}

module.exports = new CategoryController();
