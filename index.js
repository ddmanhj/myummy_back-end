const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
let port = process.env.PORT || 8011;

// Lấy route
const route = require("./src/routes");

//xử lý data javascript
app.use(express.json());
//sử lý data từ form
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const cors = require("cors");
//tránh bị bug share domain
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

route(app);

app.listen(port, "0.0.0.0", () => {
  console.log(`App listening on port ${port}`);
});
