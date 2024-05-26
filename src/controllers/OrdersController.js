const {
  calculateTotalPrice,
  calculateTotalEachDish,
  calculateTotalEachDishForPaypal,
} = require("../helpers");
const OrderDetail = require("../models/orderDetail");
const Orders = require("../models/orders");
const _ = require("lodash");
const paypal = require("../services/paypal");

class OrdersController {
  //[GET] /api/orders
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
        name: item.dishesName,
        unit_amount: {
          currency_code: "USD",
          value: parseFloat(item.totalPrice).toFixed(2).toString(),
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
        totalItemValue,
        totalValueAfterDiscount.toFixed(2),
        discount
      );
      res.status(200).send({ data: url, status: true });
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
      province: province.label,
      district: district.label,
      ward: ward.label,
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
            dishesID: item.id,
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

    res.status(200).send({ data: "testing order", status: true });
  }
}

module.exports = new OrdersController();
