const ConsumerReview = require("../models/consumerReview");
const ImageConsumerReview = require("../models/imageConsumerReview");
const io = require("../utils/socket");
const Customers = require("../models/customers");
class ConsumerReviewController {
  //[POST] /api/consumer_review
  async createReview(req, res) {
    const { dishID, review, star, imageConsumerReview, customerID } = req.body;
    if (!dishID || !review || !star) {
      res.status(400).send({
        status: false,
        data: "DishID, content, rating can not be empty!",
      });
      return;
    }
    const createReview = await ConsumerReview.create({
      dishID,
      customerID,
      review,
      star,
    })
      .then((review) => {
        if (imageConsumerReview) {
          imageConsumerReview.forEach((image) => {
            ImageConsumerReview.create({
              consumerReviewID: review.id,
              urlImageConsumerReview: image,
            });
          });
        }
        return review;
      })
      .catch((err) => {
        res.status(400).send({
          status: false,
          data: err.message || "Some error occurred while creating the review.",
        });
      });

    const findNameCustomer = await Customers.findOne({
      where: { id: createReview.customerID },
      attributes: ["customerName", "urlImageAvatar"],
    })
      .then((customerName) => {
        return customerName;
      })
      .catch((err) => {
        console.log(err);
      });

    const findImageUserPost = await ImageConsumerReview.findAll({
      where: { consumerReviewID: createReview.id },
      attributes: ["urlImageConsumerReview"],
    })
      .then((imageReview) => {
        return imageReview;
      })
      .catch((err) => {
        console.log(err);
      });

    io.getIO().emit("posts", {
      action: "create",
      post: {
        ...createReview?.dataValues,
        customerName: findNameCustomer.customerName,
        urlImageAvatar: findNameCustomer.urlImageAvatar,
        image_consumer_reviews: {
          urlImageConsumerReview: findImageUserPost,
        },
      },
    });
    res.status(200).send({
      status: true,
      data: "Review was created successfully!",
    });
  }

  // [GET] /api/consumer_review
  async reviewComments(req, res) {
    const { page, limit, dishID } = req.query;
    // raw sẽ là muốn lấy object thuần, không muốn lấy mặc định của sequelize
    // nest sẽ là lấy data của bảng khác thông quá khóa ngoại
    const queries = { raw: true, nest: true };
    const offset = !page || +page < 1 ? 0 : +page - 1;
    const fLimit = +limit || 10;
    queries.offset = offset * fLimit;
    queries.limit = fLimit;
    await ConsumerReview.findAndCountAll({
      where: {
        dishID: dishID,
      },
      ...queries,
      include: [
        {
          model: ImageConsumerReview,
          attributes: ["urlImageConsumerReview"],
        },
        {
          model: Customers,
          attributes: ["customerName", "urlImageAvatar"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })
      .then((reviews) => {
        res.status(200).send({
          status: true,
          data: reviews,
        });
      })
      .catch((err) => {
        res.status(400).send({
          status: false,
          data: err.message || "Some error occurred while retrieving reviews.",
        });
      });
  }
}

module.exports = new ConsumerReviewController();
