const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3000;

// Lấy route
const route = require("./src/routes");

//xử lý data javascript
app.use(express.json());
//sử lý data từ form
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

route(app);

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
const io = require("./src/utils/socket").init(server);
io.on("connection", (socket) => {
  console.log("client connected");
});
