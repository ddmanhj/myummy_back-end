const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Customers = sequelize.define(
  "customers",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    customerName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    urlImageAvatar: {
      type: Sequelize.TEXT,
    },
    phone: {
      type: Sequelize.STRING,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    address: {
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "customers",
    timestamps: true,
  }
);

module.exports = Customers;
