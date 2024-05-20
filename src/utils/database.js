const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");

const sequelize = new Sequelize(
  "myummy",
  "manhj",
  // "root",
  `${process.env.DB_PASSWORD}`,
  {
    host: `${process.env.HOST_DB}`,
    // host: `localhost`,
    port: 3306,
    dialect: "mysql",
    ssl: {
      ca: fs.readFileSync(`./DigiCertGlobalRootCA.crt.pem`),
    },
  }
);
module.exports = sequelize;
