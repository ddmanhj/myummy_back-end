const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");

// Đọc file chứng chỉ SSL
const sslCert = fs.readFileSync(
  path.resolve(__dirname, "DigiCertGlobalRootCA.crt.pem")
);

const sequelize = new Sequelize(
  "myummy",
  `${process.env.USER_DB_NAME}`,
  `${process.env.DB_PASSWORD}`,
  {
    host: `${process.env.HOST_DB}`,
    port: `${process.env.POST_DB}`,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        ca: sslCert,
      },
    },
  }
);
module.exports = sequelize;
