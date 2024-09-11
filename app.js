const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
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
app.use(
  "/resources/images/profile_pics",
  express.static(path.join(__dirname, "resources", "images", "profile_pics"))
);
app.use(
  "/resources/images/thumbnails",
  express.static(path.join(__dirname, "resources", "images", "thumbnails"))
);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data, success: false });
});

mongoose.connect(URL).then(() => {
  app.listen(5000);
  console.log("App is listening at port 5000");
});
