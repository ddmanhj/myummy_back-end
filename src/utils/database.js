const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "myummy",
  "manhj",
  `${process.env.DB_PASSWORD}`,
  {
    host: `${process.env.HOST_DB}`,
    port: 3306,
    dialect: "mysql",
  }
);

module.exports = sequelize;
