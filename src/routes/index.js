const food = require("./food");
const wishList = require("./wishListRoute");
const authCustomer = require("./authCustomers");

function route(app) {
  // Client
  app.use("/api", wishList);
  app.use("/api", food);
  app.use("/api/auth", authCustomer);
}

module.exports = route;
