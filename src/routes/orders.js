const express = require("express");
const router = express.Router();

const OrdersController = require("../controllers/OrdersController");
const middlewareController = require("../middleWare/AuthCustomerController");

router.post(
  "/create_order",
  middlewareController.verifyToken,
  OrdersController.createOrder
);

router.post(
  "/pay-order",
  middlewareController.verifyToken,
  OrdersController.payOrder
);

module.exports = router;
