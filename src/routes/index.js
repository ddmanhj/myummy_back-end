const food = require("./food");
const wishList = require("./wishListRoute");
const authCustomer = require("./authCustomers");
const orders = require("./orders");
const consumerReview = require("./consumerReview");

function route(app) {
  // Client
  app.use("/api", orders);
  app.use("/api", wishList);
  app.use("/api", food);
  app.use("/api", consumerReview);
  app.use("/api/auth", authCustomer);
}

module.exports = route;
