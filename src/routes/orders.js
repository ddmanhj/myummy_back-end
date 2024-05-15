const express = require("express");
const router = express.Router();

const OrdersController = require("../controllers/OrdersController");
const middlewareController = require("../middleWare/AuthCustomerController");

router.post(
  "/create_order",
  middlewareController.verifyToken,
  OrdersController.createOrder
);

module.exports = router;
