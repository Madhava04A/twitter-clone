const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "your comment cant be empty text"],
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "post",
    },
    commentBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const Comment = model("comment", commentSchema);

module.exports = Comment;
