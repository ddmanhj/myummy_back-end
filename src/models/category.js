const Sequelize = require("sequelize");
const sequelize = require("../utils/database.js");

const Category = sequelize.define(
  "category",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    categoryName: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    urlImageCategory: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "category",
    timestamps: false,
  }
);

module.exports = Category;
