const { validationResult } = require("express-validator");
const { clearFile } = require("../utils/common");
const Post = require("../models/Post");
const fs = require("fs");
const SocketManager = require("../socket/socket");

exports.uploadPost = async (req, res, next) => {
  const socket = SocketManager.getSocket();
  const io = SocketManager.getIO();

  const userId = req.body.userId;
  const currentUser = SocketManager.users.find(
    (user) => user.userId === userId
  );

  try {
    // const err = validationResult(req);
    // if (!err.isEmpty()) {
    //   const error = new Error(err.array()[0].msg);
    //   error.statusCode = 422;
    //   error.data = err.message;
    //   throw error;
    // }
    if (!req.file) {
      const error = new Error("Video is not attched");
      error.statusCode = 400;
      throw error;
    }
    const fileSize = req.file.size;
    let uploadedSize = 0;
    const readStream = fs.createReadStream(req.file.path);
    const destinationPath = path.join(
      __dirname,
      "..",
      "resources",
      "videos",
      req.file.filename
    );
    const writeStream = fs.createWriteStream(destinationPath);
    readStream.on("data", (chunk) => {
      uploadedSize += chunk.length;
      const progress = Math.round((uploadedSize / fileSize) * 100);
      io.to(currentUser.socketId).emit("uploadProgress", { progress });
    });
    readStream.on("end", async () => {
      const { creator, description } = req.body;
      const newPost = new Post({
        creator: creator,
        description: description,
        videoUrl: "http://localhost:3000/resources/videos/" + req.file.filename,
      });

      await newPost.save();
      io.emit("uploadProgress", { progress: 100 });
      res.status(200).json({ post: newPost, success: true });
    });
    readStream.pipe(writeStream);
    readStream.on("error", (err) => {
      if (!err.statusCode) err.statusCode = 500;
      if (req.file) {
        clearFile(destinationPath); // Clear the file if an error occurs
      }
      next(err);
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    if (req.file) {
      clearFile(
        path.join(__dirname, "..", "resources", "videos", req.file.filename)
      );
    }
    next(err);
  }
};
