const { isEmpty } = require("lodash");
const { Op } = require("sequelize");
const Dishes = require("../models/dishes");
const ImageDetailDish = require("../models/imageDetailDish");
const { getDishesFromWishList } = require("../helpers");
const io = require("../utils/socket");

class DishesController {
  // [GET] /api/show dish and filter
  async allFood(req, res) {
    const {
      page,
      limit,
      search,
      order,
      price,
      reviewStars,
      categoryID,
      ...query
    } = req.query;
    // raw sẽ là muốn lấy object thuần, không muốn lấy mặc định của sequelize
    // nest sẽ là lấy data của bảng khác thông quá khóa ngoại
    const queries = { raw: true, nest: true };
    const offset = !page || +page < 1 ? 0 : +page - 1;
    const fLimit = +limit || 10;
    queries.offset = offset * fLimit;
    queries.limit = fLimit;
    if (order) queries.order = [order];
    if (search) {
      query.dishName = { [Op.like]: `%${search}%` };
    } else {
      if (reviewStars)
        query.reviewStars = {
          [Op.or]: [
            {
              [Op.between]: [
                parseFloat(reviewStars) - 0.5,
                parseFloat(reviewStars) + 0.5,
              ],
            }, // Tìm kiếm giá trị gần đúng
          ],
        };
      if (categoryID) query.categoryID = categoryID;
      // Only add price to the query if both minPrice and maxPrice are defined
      if (!isEmpty(price)) {
        const [minPrice, maxPrice] = price.split(",");
        query.price = { [Op.between]: [minPrice, maxPrice] };
      }
    }

    await Dishes.findAndCountAll({
      where: query,
      ...queries,
      attributes: [
        "id",
        "dishName",
        "urlImageDish",
        "price",
        "reviewStars",
        "saleType",
        "saleDiscount",
      ],
    })
      .then((dishes) => {
        res.status(200).send({
          status: true,
          data: dishes,
        });
      })
      .catch((err) => {
        res.status(400).send({
          status: false,
          data: "Error retrieving dishes",
        });
      });
  }

  // [GET] /dish/:id
  async dishByID(req, res) {
    await Dishes.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: ImageDetailDish,
          attributes: ["urlImageDetailDish"],
        },
      ],
    })
      .then((dishes) => {
        res.status(200).send({
          status: true,
          data: dishes,
        });
      })
      .catch((err) => {
        res.status(400).send({
          status: false,
          data: "Error retrieving dishes",
        });
      });
  }

  // [GET] /random_dishes
  async randomDishes(req, res) {
    await Dishes.findAll({
      order: Dishes.sequelize.random(),
      limit: 4,
      attributes: [
        "id",
        "dishName",
        "urlImageDish",
        "price",
        "reviewStars",
        "saleType",
        "saleDiscount",
      ],
    })
      .then((dishes) => {
        res.status(200).send({
          status: true,
          data: dishes,
        });
      })
      .catch((err) => {
        res.status(400).send({
          status: false,
          data: "Error retrieving dishes",
        });
      });
  }

  // [POST] /api/dishes_by_wish_list
  async showDishesByWishList(req, res) {
    const customerId = req.query.customerID;
    const resultDishByWishList = await getDishesFromWishList(customerId);
    if (resultDishByWishList) {
      res.status(200).send({
        status: true,
        data: resultDishByWishList,
      });
    } else {
      res.status(400).send({
        status: false,
        data: "Error retrieving dishes by wish list",
      });
    }
  }
}

module.exports = new DishesController();
