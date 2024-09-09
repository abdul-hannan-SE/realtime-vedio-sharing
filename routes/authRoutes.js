const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const multer = require("../uploader/multer");
const path = require("path");
const { check } = require("express-validator");

const upload = multer.setImage({
  maxFileSize: 1 * 1024 * 1024,
  path: path.join(__dirname, "..", "resources", "images"),
});

router.get("/user", authController.getUser);

router.post(
  "/signUp",
  upload.single("profile"),
  [
    check("email")
      .trim()
      .isEmail()
      .escape()
      .withMessage("E-mail address invalid"),
    check("password")
      .notEmpty()
      .isLength({ min: 6, max: 10 })
      .withMessage("Password should be 6-10 char long"),
    check("username").notEmpty().withMessage("Username cannot be empty"),
  ],
  authController.signUp
);

router.post(
  "/login",
  [
    check("email")
      .trim()
      .isEmail()
      .escape()
      .withMessage("E-mail address invalid"),
    check("password")
      .notEmpty()
      .isLength({ min: 6, max: 10 })
      .withMessage("Password should be 6-10 char long"),
  ],
  authController.login
);
module.exports = router;
