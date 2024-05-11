// helpers.js

const { WishList } = require("../models"); // Đường dẫn đến model WishList
const { Dishes } = require("../models"); // Đường dẫn đến model Dishes

async function getDishesFromWishList(customerId) {
  try {
    const wishList = await WishList.findAll({
      where: {
        customerID: customerId,
      },
    });
    const dishIds = wishList.map((dish) => dish.dishesID);

    const dishes = await Dishes.findAll({
      where: {
        id: dishIds,
      },
    });

    return dishes;
  } catch (err) {
    return;
  }
}

module.exports = getDishesFromWishList;
