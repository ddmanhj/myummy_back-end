const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "myummy",
  "root",
  `${process.env.DB_PASSWORD}`,
  { dialect: "mysql", host: "localhost" }
);

module.exports = sequelize;
