const Sequelize = require("sequelize");
const sequelize = require("../utils/database");
const Customers = require("./customers");

const Orders = sequelize.define(
  "orders",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: Sequelize.STRING(100),
    },
    address: {
      type: Sequelize.TEXT,
    },
    province: {
      type: Sequelize.STRING(255),
    },
    district: {
      type: Sequelize.STRING(255),
    },
    ward: {
      type: Sequelize.STRING(255),
    },
    email: {
      type: Sequelize.STRING(255),
    },
    phone: {
      type: Sequelize.STRING(15),
    },
    message: {
      type: Sequelize.TEXT,
    },
    total: {
      type: Sequelize.INTEGER,
    },
    customerID: {
      type: Sequelize.INTEGER,
      references: {
        model: Customers,
        key: "id",
      },
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  }
);

Customers.hasMany(Orders, { foreignKey: "customerID" });
Orders.belongsTo(Customers, { foreignKey: "customerID" });

module.exports = Orders;
