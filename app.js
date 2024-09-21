const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const URL="mongodb+srv://root:root@databases.ovq7d.mongodb.net/?retryWrites=true&w=majority&appName=videoApp"

const app = express();
const authRoute = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
// const morgan = require("morgan");
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
  if (!err.statusCode) err.statusCode = 500;
  if(!err.message) err.message="Something went wrong"
  res.status(error.statusCode).json(error);
});

mongoose.connect(URL).then(() => {
  serverInstance.listen(5000);
console.log("Database connected");
  console.log("App is listening at port 5000");
});
