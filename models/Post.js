const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    comments: [
      {
        username: { type: String, required: true },
        imageUrl: { type: String },
        text: { type: String, required: true },
      },
    ],
    likes: {
      type: Number,
      default: 0,
      likedBy: [Schema.Types.ObjectId],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
