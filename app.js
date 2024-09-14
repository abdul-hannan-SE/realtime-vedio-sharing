const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const URL = "mongodb://localhost:27017/posts-database";
const app = express();
const authRoute = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const morgan = require("morgan");
const serverInstance = require("http").createServer(app);
const socket = require("./socket/socket");
socket.init(serverInstance);
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

app.use(
  "/resources/images/profile_pics",
  express.static(path.join(__dirname, "resources", "images", "profile_pics"))
);

app.use(
  "/resources/videos",
  express.static(path.join(__dirname, "resources", "videos"))
);
app.use("/auth", authRoute);
app.use("/user", userRoutes);
// app.use(morgan());

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  error.success = false;
  res.status(status).json({ message: message, data: data, success: false });
});

mongoose.connect(URL).then(() => {
  serverInstance.listen(5000);
  console.log("App is listening at port 5000");
});
