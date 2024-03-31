const Post = require("../models/tweetModel");
const Comment = require("../models/commentsModel");
const customErr = require("../utilities/customError");
const asyncErrHandler = require("../utilities/asyncError");

exports.getAllPosts = asyncErrHandler(async (req, res, next) => {
  const posts = await Post.find({});
  if (!posts) {
    const err = new customErr("something went wrong, Try again!", 500);
    next(err);
  }
  res.json({
    status: "success",
    data: posts,
  });
});

exports.createPost = asyncErrHandler(async (req, res, next) => {
  const postObject = {
    authorBy: req.user._id,
    ...req.body,
  };
  const newPost = await Post.create(postObject);

  res.json({
    status: "success",
    post: newPost,
  });
});

exports.likePost = asyncErrHandler(async (req, res, next) => {
  if (req.query.dislike) {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { $inc: { likes: -1 } },
      { new: true, runValidators: true }
    );
    if (!post) {
      const err = new customErr("Invalid post Id", 404);
      return next(err);
    }
    return res.json({
      status: "success",
      post: post,
    });
  }
  const post = await Post.findByIdAndUpdate(
    req.params.postId,
    { $inc: { likes: 1 } },
    { new: true }
  );
  if (!post) {
    const err = new customErr("Invalid post Id", 404);
    return next(err);
  }
  res.json({
    status: "success",
    post: post,
  });
});

exports.getComments = asyncErrHandler(async (req, res, next) => {
  const postId = req.params.postId;
  const comments = await Comment.find({ postId });
  if (!comments) {
    const err = new customErr("commnets for that post does not exist", 400);
    return next(err);
  }

  res.json({
    status: "success",
    data: [...comments],
  });
});

exports.postComment = asyncErrHandler(async (req, res, next) => {
  const postId = req.params.postId;

  if (!req.body.content) {
    const err = new customErr(" empty comment cannot be posted!", 400);
    return next(err);
  }
  const comment = await Comment.create({
    content: req.body.content,
    postId,
    commentBy: req.user._id,
  });

  res.json({
    status: "success",
    comment,
  });
});
