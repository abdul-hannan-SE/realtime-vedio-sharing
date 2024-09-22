const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { ApiError } = require("../utils/ApiError")
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordValid = async function (password) {
  return await bcrypt.compare(password, this.password);

}

module.exports = mongoose.model("User", userSchema);
