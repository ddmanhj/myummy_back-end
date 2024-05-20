const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");

// Đọc file chứng chỉ SSL
const sslCert = fs.readFileSync(
  path.resolve(__dirname, "DigiCertGlobalRootCA.crt.pem")
);

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
    dialectOptions: {
      ssl: {
        ca: sslCert,
      },
    },
  }
);
module.exports = sequelize;
