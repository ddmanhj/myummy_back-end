const food = require("./food");
const authCustomer = require("./authCustomers");

function route(app) {
  // Client
  app.use("/api", food);
  app.use("/api/auth", authCustomer);
}

module.exports = route;
