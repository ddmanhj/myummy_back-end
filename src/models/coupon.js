const Sequelize = require("sequelize");
const sequelize = require("../utils/database.js");

const Coupon = sequelize.define(
  "coupon",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    couponCode: {
      type: Sequelize.STRING,
      unique: true,
    },
    discount: {
      type: Sequelize.INTEGER,
    },
    typeDiscount: {
      type: Sequelize.STRING(50),
      defaultValue: "amount",
    },
    status: {
      type: Sequelize.BOOLEAN,
    },
  },
  {
    tableName: "coupon",
    timestamps: true,
  }
);

module.exports = Coupon;
