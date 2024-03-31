const { Schema, model } = require("mongoose");

const tweetSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "your post has empty text"],
    },
    likes: {
      type: Number,
      default: 0,
    },
    authorBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const Post = model("post", tweetSchema);

module.exports = Post;
