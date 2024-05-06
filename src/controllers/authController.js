const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Customers } = require("../models");
const role_account = require("../utils/constant");
const { isEmpty } = require("lodash");

const authController = {
  //REGISTER
  registerCustomer: async (req, res) => {
    try {
      //mã hóa mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);
      //Save to DB
      Customers.create({
        customerName: req.body.customerName,
        email: req.body.email,
        phone: req.body.phone,
        role: role_account.customer,
        password: hashed,
      }).then(function (customer) {});

      return res.status(200).send({ status: true, data: "Register success" });
    } catch (error) {
      return res.status(500).json(error.message);
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

  //Login
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
        //thêm token với cookies
        //cú pháp: res.cookie("tên cookies", "token code")
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          // //khi deploy nhớ sẽ secure: true
          secure: true,
          path: "/",
          // sameSite: "none",
        });
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          // //khi deploy nhớ sẽ secure: true
          secure: true,
          path: "/",
          // sameSite: "none",
        });
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
        };
        //không lấy password thì dùng đoạn code dưới
        // const { password, ...others } = customer._doc;
        //khi có token, hãy copy vào trang chủ jwt phần encoded
        res.status(200).send({ status: true, data: responseAccount });
      }
    } catch (error) {
      return res.status(500).send(error.message);
    }
  },

  //REDIS
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
        //thêm token với cookies
        //cú pháp: res.cookie("tên cookies", "token code")
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          //khi deploy nhớ sẽ secure: true
          secure: true,
          path: "/",
        });
        return res
          .status(200)
          .json({ data: { token: newAccessToken }, status: true });
      }
    );
  },

  //Log out
  logout: async (req, res) => {
    //Xóa hết các token, refresh token
    //xóa Cookie\
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

//Store token
//(1) LOCAL STORAGE
//(2) COOKIES

//(3) REDUX STORE -> ACCESSTOKEN
// HTTTPONLY COOKIES -> REFRESHTOKEN

module.exports = authController;
