const Sequelize = require("sequelize");
const sequelize = require("../utils/database");
const Orders = require("./orders");
const Dishes = require("./dishes");
const Coupon = require("./coupon");

const OrderDetail = sequelize.define(
  "order_detail",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderID: {
      type: Sequelize.INTEGER,
      references: {
        model: Orders,
        key: "id",
      },
    },
    dishID: {
      type: Sequelize.INTEGER,
      references: {
        model: Dishes,
        key: "id",
      },
    },
    quantity: {
      type: Sequelize.INTEGER,
    },
    subTotal: {
      type: Sequelize.INTEGER,
    },
    total: {
      type: Sequelize.INTEGER,
    },
    couponID: {
      type: Sequelize.INTEGER,
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: Coupon,
        key: "id",
      },
    },
  },
  {
    tableName: "order_detail",
    timestamps: false,
  }
);

Orders.hasMany(OrderDetail, { foreignKey: "orderID" });
OrderDetail.belongsTo(Orders, { foreignKey: "orderID" });

Dishes.hasMany(OrderDetail, { foreignKey: "dishID" });
OrderDetail.belongsTo(Dishes, { foreignKey: "dishID" });

Coupon.hasOne(OrderDetail, { foreignKey: "couponID" });
OrderDetail.belongsTo(Coupon, { foreignKey: "couponID" });

module.exports = OrderDetail;
