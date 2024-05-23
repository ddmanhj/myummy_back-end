const Sequelize = require("sequelize");
const sequelize = require("../utils/database.js");
const Dishes = require("./dishes.js");

const ImageDetailDish = sequelize.define(
  "image_detail_dish",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    urlImageDetailDish: {
      type: Sequelize.STRING,
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
    tableName: "image_detail_dish",
    timestamps: false,
  }
);

Dishes.hasMany(ImageDetailDish, { foreignKey: "dishID" });
ImageDetailDish.belongsTo(Dishes, { foreignKey: "dishID" });

module.exports = ImageDetailDish;
