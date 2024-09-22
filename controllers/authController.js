const User = require("../models/user.model");
const { createSecretToken } = require("../middlewares/jwt");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

exports.signUp = asyncHandler(
  async (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      const message = new Error(err.array()[0].msg);
      throw new ApiError(422, message, "Vaalidation Error");
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
      throw new ApiError(400, "Image is required,");
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
    res.status(201).json(new ApiResponse(200, "User created successfully", {
      username: newUser.username,
      email: newUser.email,
      id: newUser._id,
      token: token,
    },))
  }
)

exports.login = asyncHandler(
  async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("-__v");
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const result = await user.isPasswordValid(password);
    if (!result) {
      throw new ApiError(401, "Invalid password", "Validation Error");
    }

    const token = createSecretToken(user._id);
    res.cookie("token", token);
    res.status(200).json(new ApiResponse(200, "Login successful", {
      user: user._doc,
      token: token,
    }));
  }
);


// exports.getUser = async (req, res, next) => {
//   const email = req.query.email;
//   const user = await User.findOne({ email: email });
//   if (!user) res.status(404).json({ sucess: false, message: "User not found" });
//   res.status(200).json({ user: user, success: true });
// };
