const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3000;

// Lấy route
const route = require("./src/routes");

// Hoặc sử dụng express.json() với giới hạn kích thước lớn hơn
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

//xử lý data javascript
app.use(express.json());
//sử lý data từ form
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const cors = require("cors");
app.use(
  cors({
    origin: "https://myummy-front-end-b5b3eaedeafa.herokuapp.com",
    credentials: true,
  })
);

route(app);

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

const io = require("./src/utils/socket").init(server);

let viewers = {};
let updateQueue = {};

io.on("connection", (socket) => {
  console.log(`A user connected`);

  socket.on("view_item", (dishId) => {
    if (!viewers[dishId]) {
      viewers[dishId] = 0;
    }
    viewers[dishId]++;
    updateQueue[dishId] = viewers[dishId];
  });

  socket.on("leave_item", (dishId) => {
    if (viewers[dishId]) {
      viewers[dishId]--;
      updateQueue[dishId] = viewers[dishId];
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    // Handle user disconnect logic if necessary
  });
});

// Emit updates every 5 seconds
setInterval(() => {
  for (const [dishId, count] of Object.entries(updateQueue)) {
    io.emit("update_viewers", { dishId, count });
  }
  updateQueue = {};
}, 5000);
