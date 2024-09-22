// high level function that returns a function 
const { clearFile } = require("./common");
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    return await fn(req, res, next);
  } catch (err) {
    if (req.file) {
      clearFile(
        path.join(
          __dirname,
          "..",
          "resources",
          "images",
          "profile_pics",
          req.file.filename
        )
      );
    }
    console.log(err)
    next(err);
  }
}

module.exports = { asyncHandler };