var express = require("express");
var router = express.Router();
const PostControllers = require("../controllers/posts");
const handErrorAsync = require("../service/handErrorAsync");
const { isAuth } = require("../middleware/auth");

// 取得所有貼文
router.get("/posts", isAuth, handErrorAsync(PostControllers.getPosts));

// 取得指定用戶所有貼文
router.get(
  "/posts/user/:userId",
  isAuth,
  handErrorAsync(PostControllers.getUserPosts)
);

// 取得單一貼文
router.get("/post/:postId", isAuth, handErrorAsync(PostControllers.getPost));

// 新增貼文
router.post("/post", isAuth, handErrorAsync(PostControllers.createPost));

// 刪除單一貼文
router.delete(
  "/post/:postId",
  isAuth,
  handErrorAsync(PostControllers.deletePost)
);

// 按讚貼文
router.post(
  "/post/:postId/like",
  isAuth,
  handErrorAsync(PostControllers.createLike)
);

// 取消按讚貼文
router.delete(
  "/post/:postId/like",
  isAuth,
  handErrorAsync(PostControllers.deleteLike)
);

// 新增回覆
router.post(
  "/post/:postId/comment",
  isAuth,
  handErrorAsync(PostControllers.createComment)
);

// 刪除回覆
router.delete(
  "/post/:commentId/comment",
  isAuth,
  handErrorAsync(PostControllers.deleteComment)
);

module.exports = router;
