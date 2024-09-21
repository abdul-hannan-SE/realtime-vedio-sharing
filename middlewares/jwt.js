const jwt = require("jsonwebtoken");

const { ApiError } = require("../utils/ApiError")

require("dotenv").config();

exports.createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRY });
};

exports.authJWT = (req, res, next) => {
  const token = req?.cookies?.token;
  if (!token) {
    next(new ApiError(401, "User could not authenticated", "JWT Error"))
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return res
        .status(401)
        .json({ status: false, message: "Authentication Failed" });
    } else {
      next();
    }
  });
};
