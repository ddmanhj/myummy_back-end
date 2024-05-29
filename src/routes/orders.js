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

// Get list order
router.get(
  "/orders",
  middlewareController.verifyToken,
  OrdersController.getOrder
);

// Get order detail
router.get(
  "/order/:id",
  middlewareController.verifyToken,
  OrdersController.getOrderDetail
);

module.exports = router;
