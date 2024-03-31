const express = require("express");
const postController = require("../controllers/post");
const authController = require("../controllers/auth");

const router = express.Router();

router.use(authController.authorizeUser);

router
  .route("/")
  .get(postController.getAllPosts)
  .post(postController.createPost);

router.post("/like/:postId", postController.likePost);

router
  .route("/comments/:postId")
  .get(postController.getComments)
  .post(postController.postComment);

module.exports = router;
