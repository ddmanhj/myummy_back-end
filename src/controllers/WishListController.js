const { WishList } = require("../models");

class WishListController {
  // [POST] /api/wish_list
  async addDishToWishList(req, res) {
    const { dishesID, customerID } = req.body;
    await WishList.create({
      dishesID,
      customerID,
    })
      .then((dish) => {
        res.status(200).send({
          message: "Success",
          data: "Success add wishList",
        });
      })
      .catch((err) => {
        res.status(500).send({
          status: false,
          data: "Error adding dish to wish list",
        });
      });
  }

  // [POST] /api/delete_wish_list
  async deleteDishInWishList(req, res) {
    const { dishesID, customerID } = req.body;
    await WishList.destroy({
      where: {
        dishesID,
        customerID,
      },
    })
      .then(() => {
        res.status(200).send({
          message: "Success",
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error deleting dish in wish list",
        });
      });
  }
}

module.exports = new WishListController();
