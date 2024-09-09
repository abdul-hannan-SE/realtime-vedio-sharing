const multer = require("multer");

exports.setImage = ({ maxSize, path }) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix =
        new Date().toISOString().replace(/:/g, "_") + file.originalname;
      cb(null, uniqueSuffix);
    },
  });

  const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Invalid image type (allowed types : jpeg, jpg, png)"));
      }
    },
    limits: { fileSize: maxSize },
  });

  return upload;
};
