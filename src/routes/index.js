const specialMenu = require("./special_menu");
const authCustomer = require("./authCustomers");

function route(app) {
  // Client
  app.use("/api", specialMenu);
  app.use("/api/auth", authCustomer);
}

module.exports = route;
