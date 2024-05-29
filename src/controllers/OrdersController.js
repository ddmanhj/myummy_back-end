const {
  calculateTotalPrice,
  calculateTotalEachDish,
  calculateTotalEachDishForPaypal,
} = require("../helpers");
const OrderDetail = require("../models/orderDetail");
const Orders = require("../models/orders");
const Coupon = require("../models/coupon");
const Dishes = require("../models/dishes");
const _ = require("lodash");
const paypal = require("../services/paypal");

class OrdersController {
  // [GET] /api/orders
  async getOrder(req, res) {
    const { page, limit, customerID } = req.query;
    // raw sẽ là muốn lấy object thuần, không muốn lấy mặc định của sequelize
    // nest sẽ là lấy data của bảng khác thông quá khóa ngoại
    const queries = { raw: true, nest: true };
    const offset = !page || +page < 1 ? 0 : +page - 1;
    const fLimit = +limit || 10;
    queries.offset = offset * fLimit;
    queries.limit = fLimit;
    await Orders.findAndCountAll({
      where: { customerID: customerID },
      ...queries,
      order: [["createdAt", "DESC"]],
    })
      .then((order) => {
        res.status(200).send({ data: order, status: true });
      })
      .catch((err) => {
        console.log("~~~ error get order", err);
        res.status(400).send({ data: "Order not found", status: false });
      });
  }

  // [GET] /api/orders/:id
  async getOrderDetail(req, res) {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .send({ data: "Order detail not found", status: false });
    await OrderDetail.findAll({
      where: { orderID: id },
      include: [
        {
          model: Dishes,
          attributes: ["dishesName", "price", "urlImageDishes"],
        },
        {
          model: Coupon,
          attributes: ["couponCode", "discount", "typeDiscount"],
        },
      ],
    })
      .then((order) => {
        res.status(200).send({ data: order, status: true });
      })
      .catch((err) => {
        console.log("~~~ error get order detail", err);
        res.status(400).send({ data: "Order detail not found", status: false });
      });
  }

  //[GET] /api/pay-order
  async payOrder(req, res) {
    const { dishes } = req.body;
    // total each dish
    let totalEachDishService = [];
    await calculateTotalEachDishForPaypal(dishes)
      .then((total) => {
        totalEachDishService = total;
      })
      .catch((err) => console.log("~~ calc", err));
    totalEachDishService = totalEachDishService.map((item) => {
      return {
        sku: item.id,
        name: item.dishesName,
        unit_amount: {
          currency_code: "USD",
          value: parseFloat(item.price / 25370)
            .toFixed(2)
            .toString(),
        },
        quantity: item.quantity.toString(),
      };
    });

    // Tính tổng giá trị các sản phẩm
    const totalItemValue = _.sumBy(
      totalEachDishService,
      (item) => parseFloat(item.unit_amount.value) * parseInt(item.quantity)
    );

    // Discount
    const discount = 0.0;
    const totalValueAfterDiscount = totalItemValue - discount;

    try {
      const url = await paypal.createOrder(
        totalEachDishService,
        totalItemValue.toFixed(2),
        totalValueAfterDiscount.toFixed(2),
        discount
      );
      res.status(200).send({ data: { urlPayment: url }, status: true });
    } catch (error) {
      if (error.response) {
        console.error("Error creating order:", error.response.data);
        if (error.response.status === 422) {
          console.error("Validation error:", error.response.data.details);
        }
      } else {
        console.error("Error:", error.message);
      }
    }
  }

  // [POST] /api/create_order
  async createOrder(req, res) {
    const {
      token,
      customerID,
      fullName,
      address,
      email,
      phone,
      message,
      province,
      district,
      ward,
      dishes,
    } = req.body;
    const isSuccessPaymentPaypal = await paypal.capturePayment(token);
    if (!isSuccessPaymentPaypal?.status === "COMPLETED")
      return res.status(400).send({ data: "Order failed", status: false });

    let totalDishService = 0;
    await calculateTotalPrice(dishes)
      .then((total) => {
        totalDishService = total;
      })
      .catch((err) => console.log("~~ calc", err));

    // Feature coupon discount
    const totalService = totalDishService - 0;

    // total each dish
    let totalEachDishService = [];
    await calculateTotalEachDish(dishes)
      .then((total) => {
        totalEachDishService = total;
      })
      .catch((err) => console.log("~~ calc", err));

    //merge id dish with total each dish
    const mergedResult = _.merge(totalEachDishService, dishes);

    await await Orders.create({
      fullName,
      address,
      province,
      district,
      ward,
      email,
      phone,
      message,
      total: totalService,
      customerID,
    })
      .then((dish) => {
        mergedResult.forEach(async (item) => {
          await OrderDetail.create({
            orderID: dish?.id,
            dishID: item.id,
            quantity: item.quantity,
            subTotal: item.totalPrice,
            total: totalService,
          })
            .then(() => {})
            .catch((err) => {
              console.log("~~~ error create order detail", err);
            });
        });
      })
      .catch((err) => {
        console.log("~~~ error create order", err);
      });

    res.status(200).send({ data: "Order success", status: true });
  }
}

module.exports = new OrdersController();
