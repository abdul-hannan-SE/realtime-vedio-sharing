const User = require("../models/User");
const { createSecretToken } = require("../utils/jwt");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const { clearFile } = require("../utils/common");
exports.signUp = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      const error = new Error(err.array()[0].msg);
      error.statusCode = 422;
      error.data = err.message;
      throw error;
    }

    const { username, email, password } = req.body;

    const newUser = new User({
      username: username,
      email: email,
      password: password,
    });
    if (req.file) {
      newUser.imageUrl =
        "http://localhost:3000/resources/images/" + req.file.filename;
    } else {
      const error = new Error("Image is required");
      error.statusCode = 400;
      throw error;
    }
    await newUser.save();

    const token = createSecretToken(newUser._id);
    res.cookie(
      "token",
      { token: token, userId: newUser._id },
      {
        maxAge: 24 * 60 * 60 * 1000, // Cookie expiration (1 day)
      }
    );
    res.status(200).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        id: newUser._id,
      },
      token: token,
      success: true,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    if (err.message.startsWith("E11000 duplicate key error")) {
      err.message = "E-mail already in use";
    }
    if (req.file) {
      clearFile(
        path.join(
          __dirname,
          "..",
          "resources",
          "images",
          "profile_pics",
          req.file.filename
        )
      );
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email }).select("-__v");

    if (!user) {
      res.status(404).json({ message: "User not found", success: false });
    } else {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        const token = createSecretToken(user._id);
        res.cookie("token", token);
        res
          .status(200)
          .json({ user: user._doc, success: true, message: "Login success" });
      } else
        res.status(200).json({ message: "Invalid password", success: false });
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
exports.getUser = async (req, res, next) => {
  const email = req.query.email;
  const user = await User.findOne({ email: email });
  if (!user) res.status(404).json({ sucess: false, message: "User not found" });
  res.status(200).json({ user: user, success: true });
};
