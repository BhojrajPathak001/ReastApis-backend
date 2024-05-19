const express = require("express");
const feedController = require("../controllers/feed");
const router = express.Router();
const { body } = require("express-validator");

// GET /feed/posts
router.get("/posts", feedController.getPosts);

// POST /feed/post
router.post(
  "/post",
  [
    body("title")
      .trim()
      .isLength({ min: 7 }, body("content").trim().isLength(5)),
  ],
  feedController.createPost
);

router.get("/post/:postId", feedController.getPost);
module.exports = router;
