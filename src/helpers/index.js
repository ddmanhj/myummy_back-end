const getDishesFromWishList = require("./getDishesFromWishList");
const { calculateTotalPrice } = require("./calcCart");
const { calculateTotalEachDish } = require("./calcCart");
const { calculateTotalEachDishForPaypal } = require("./calcCart");

module.exports = {
  getDishesFromWishList,
  calculateTotalPrice,
  calculateTotalEachDish,
  calculateTotalEachDishForPaypal,
};
