const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Customers = require("../models/customers");
const role_account = require("../utils/constant");
const { isEmpty } = require("lodash");
const { getDishesFromWishList } = require("../helpers");

const authController = {
  // [POST] api/auth/register
  registerCustomer: async (req, res) => {
    try {
      const isCustomer = await Customers.findOne({
        where: { email: req.body.email },
      })
        .then(function (account) {
          return account;
        })
        .catch((err) => {
          console.log("~~~ error find account: ", err);
        });

      if (!isEmpty(isCustomer))
        return res
          .status(200)
          .send({ status: false, data: "Account already exists" });

      //mã hóa mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);
      Customers.create({
        customerName: req.body.customerName,
        email: req.body.email,
        phone: req.body.phone,
        role: role_account.customer,
        password: hashed,
      }).then(function (customer) {});

      return res.status(200).send({ status: true, data: "Register success" });
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },

  //create token
  generateAccessToken: (customer) => {
    return jwt.sign(
      {
        //Đăng ký xem có phải là tài khoản vs quyền admin k
        id: customer.id,
        role: customer.role,
      },
      //cần một cái mật khẩu, dể trong env
      process.env.JWT_ACCESS_KEY,
      //Đặt thời gian token
      { expiresIn: "1d" }
    );
  },

  //create refresh token
  generateRefreshToken: (customer) => {
    return jwt.sign(
      {
        //Đăng ký xem có phải là tài khoản vs quyền admin k
        id: customer.id,
        role: customer.role,
      },
      //cần một cái mật khẩu, dể trong env
      process.env.JWT_REFRESH_TOKEN,
      //Đặt thời gian token
      { expiresIn: "7d" }
    );
  },

  //[POST] /api/auth/login
  loginCustomer: async (req, res) => {
    try {
      const customer = await Customers.findOne({
        where: { email: req.body.email },
      })
        .then(function (account) {
          return account;
        })
        .catch((err) => {
          console.log(err);
        });
      if (!customer) {
        return res.send({
          data: "Account does not exist",
          status: false,
        });
      }
      //compare so sánh giữa mật khẩu người dùng và mật khẩu database
      const validPassword = await bcrypt.compare(
        req.body.password,
        customer.password
      );
      if (!validPassword) {
        return res.send({
          data: "Account or password is incorrect",
          status: false,
        });
      }
      if (customer && validPassword) {
        const accessToken = await authController.generateAccessToken(customer);
        const refreshToken = await authController.generateRefreshToken(
          customer
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          path: "/",
          sameSite: "None",
          maxAge: 604800000,
        });
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          path: "/",
          sameSite: "None",
          maxAge: 86400000,
        });

        // ADD wish List
        const wishList = await getDishesFromWishList(customer.id);
        const responseAccount = {
          email: customer.email,
          role: customer.role,
          id: customer.id,
          customerName: customer.customerName,
          urlImageAvatar: customer.urlImageAvatar,
          phone: customer.phone,
          createdAt: customer.createdAt,
          accessToken,
          refreshToken,
          wishList: wishList,
        };
        res.status(200).send({ status: true, data: responseAccount });
      }
    } catch (error) {
      return res.status(400).send(error.message);
    }
  },

  //[POST] /api/auth/refresh_token
  requestRefreshToken: async (req, res) => {
    //Lấy refresh token từ customer
    const getRefreshToken = req.headers.authorization;
    if (isEmpty(getRefreshToken)) {
      return res.status(401).send({ data: "Token is required", status: false });
    }

    const refreshToken = getRefreshToken.split(" ")[1];
    //kiểm tra token có đúng hay không
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN,
      async (err, customer) => {
        if (err) {
          res.status(401).send({ data: err, status: false });
        }
        const newAccessToken = await authController.generateAccessToken(
          customer
        );
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: true,
          path: "/",
          sameSite: "None",
        });
        return res
          .status(200)
          .json({ data: { token: newAccessToken }, status: true });
      }
    );
  },

  //[POST] /api/auth/logout
  logout: async (req, res) => {
    //Xóa hết token, refresh token
    res.cookie("accessToken", "", {
      expires: new Date(),
    });
    res.cookie("refreshToken", "", {
      expires: new Date(),
    });
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    return res.status(200).send({ data: "logout success", status: true });
  },
};

module.exports = authController;
