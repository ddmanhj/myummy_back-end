const { calculateTotalPrice, calculateTotalEachDish } = require("../helpers");
const OrderDetail = require("../models/orderDetail");
const Orders = require("../models/orders");
const _ = require("lodash");

class OrdersController {
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
