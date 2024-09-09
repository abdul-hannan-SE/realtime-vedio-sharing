const fs = require("fs");
exports.clearFile = (pathToFile) => {
  fs.unlink(pathToFile, (err) => {
    if (err) {
      console.log("failed to delete file");
    }
  });
};
