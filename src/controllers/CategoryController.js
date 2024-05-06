const { Category } = require("../models");

class CategoryController {
  // [GET] /api/categories
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
}

module.exports = new CategoryController();
