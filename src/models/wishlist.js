const Sequelize = require("sequelize");
const sequelize = require("../utils/database.js");
const Dishes = require("./dishes.js");
const Customers = require("./customers.js");

const WishList = sequelize.define(
  "wish_list",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dishesID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Dishes,
        key: "id",
      },
    },
    customerID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Customers,
        key: "id",
      },
    },
  },
  {
    tableName: "wish_list",
    timestamps: false,
  }
);

module.exports = WishList;
