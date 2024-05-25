const Sequelize = require("sequelize");
const sequelize = require("../utils/database.js");
const Customers = require("./customers.js");
const Dishes = require("./dishes.js");

const ConsumerReview = sequelize.define(
  "consumer_review",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    star: {
      type: Sequelize.TINYINT,
    },
    review: {
      type: Sequelize.TEXT,
    },
    customerID: {
      type: Sequelize.INTEGER,
      references: {
        model: Customers,
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
  },
  {
    tableName: "consumer_review",
    timestamps: true,
  }
);

Customers.hasMany(ConsumerReview, { foreignKey: "customerID" });
ConsumerReview.belongsTo(Customers, {
  foreignKey: "customerID",
});

module.exports = ConsumerReview;
