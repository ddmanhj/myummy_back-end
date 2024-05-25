const Sequelize = require("sequelize");
const sequelize = require("../utils/database");
const Category = require("./category");

const Dishes = sequelize.define(
  "dishes",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dishesName: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.INTEGER,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    urlImageDishes: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    quantity: {
      type: Sequelize.INTEGER,
    },
    reviewCount: {
      type: Sequelize.INTEGER,
    },
    reviewStars: {
      type: Sequelize.TINYINT,
    },
    soldCount: {
      type: Sequelize.INTEGER,
    },
    isPopular: {
      type: Sequelize.BOOLEAN,
    },
    calories: {
      type: Sequelize.DOUBLE,
    },
    fat: {
      type: Sequelize.DOUBLE,
    },
    carbs: {
      type: Sequelize.DOUBLE,
    },
    protein: {
      type: Sequelize.DOUBLE,
    },
    saleDiscount: {
      type: Sequelize.INTEGER,
    },
    saleType: {
      type: Sequelize.STRING,
    },
    categoryID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
  },
  {
    tableName: "dishes",
    timestamps: false,
  }
);

module.exports = Dishes;
