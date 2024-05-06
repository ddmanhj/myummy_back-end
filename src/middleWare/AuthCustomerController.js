const jwt = require("jsonwebtoken");
const { isEmpty } = require("lodash");

const middlewareController = {
  //verifyToken
  verifyToken: (req, res, next) => {
    let accessToken;
    if (!isEmpty(req.headers.authorization)) {
      accessToken = req.headers.authorization;
    } else {
      accessToken = req.cookies.accessToken;
    }

    if (accessToken) {
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          return res
            .status(403)
            .send({ data: "Token is not valid", status: false });
        }
        req.user = user;
        next();
      });
    } else {
      return res
        .status(401)
        .json({ data: "You're not authenticated", status: false });
    }
  },

  verifyTokenAndAdminAuth: (req, res, next) => {
    //lấy lại đoạn code ở trên
    middlewareController.verifyToken(req, res, () => {
      //check xem có phải id chính user hoặc là admin không
      if (req.user.id == req.params.id || req.user.admin) {
        next();
      } else {
        return res
          .status(403)
          .json({ data: "You're not allowed to delete other", status: false });
      }
    });
  },
};

module.exports = middlewareController;
