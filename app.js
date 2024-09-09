const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const URL = "mongodb://localhost:27017/posts-database";
const app = express();
const authRoute = require("./routes/authRoutes");
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use("/auth/", authRoute);
mongoose.connect(URL).then(() => {
  app.listen(5000);
  console.log("App is listening at port 5000");
});
