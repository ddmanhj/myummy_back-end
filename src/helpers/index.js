const getDishesFromWishList = require("./getDishesFromWishList");
const {
  calculateTotalEachDishForPaypal,
  calculateTotalPrice,
  calculateTotalEachDish,
  exChangeRate,
} = require("./calcCart");

module.exports = {
  getDishesFromWishList,
  calculateTotalPrice,
  calculateTotalEachDish,
  calculateTotalEachDishForPaypal,
  exChangeRate,
};
