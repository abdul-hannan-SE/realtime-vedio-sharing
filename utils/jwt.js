const jwt = require("jsonwebtoken");
const User = require("../models/User");
exports.createSecretToken = (id) => {
  return jwt.sign({ id }, "somesupersecret", { expiresIn: 3 * 24 * 60 * 60 });
};

exports.authJWT = (req, res, next) => {
  const token = req?.cookies?.token;

  if (!token) {
    return res
      .status(401)
      .json({ status: false, message: "Authentication Failed" });
  }
  jwt.verify(token, "somesupersecret", async (err, data) => {
    if (err) {
      return res
        .status(401)
        .json({ status: false, message: "Authentication Failed" });
    } else {
      next();
    }
  });
};
