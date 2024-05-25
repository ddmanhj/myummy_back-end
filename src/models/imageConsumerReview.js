const Sequelize = require("sequelize");
const sequelize = require("../utils/database.js");
const Dishes = require("./dishes.js");
const ConsumerReview = require("./consumerReview.js");

const ImageConsumerReview = sequelize.define(
  "image_consumer_review",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    urlImageConsumerReview: {
      type: Sequelize.STRING,
    },
    consumerReviewID: {
      type: Sequelize.INTEGER,
      references: {
        model: ConsumerReview,
        key: "id",
      },
    },
  },
  {
    tableName: "image_consumer_review",
    timestamps: false,
  }
);

ConsumerReview.hasMany(ImageConsumerReview, { foreignKey: "consumerReviewID" });
ImageConsumerReview.belongsTo(ConsumerReview, {
  foreignKey: "consumerReviewID",
});

module.exports = ImageConsumerReview;
