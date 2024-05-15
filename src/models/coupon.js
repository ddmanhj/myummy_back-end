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
      type: Sequelize.TEXT,
    },
    discount: {
      type: Sequelize.INTEGER,
    },
    typeDiscount: {
      type: Sequelize.STRING(50),
      defaultValue: "amount",
    },
  },
  {
    tableName: "coupon",
    timestamps: false,
  }
);

module.exports = Coupon;
