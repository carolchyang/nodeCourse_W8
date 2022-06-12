var express = require("express");
var router = express.Router();
const PostControllers = require("../controllers/posts");
const handErrorAsync = require("../service/handErrorAsync");
const { isAuth } = require("../middleware/auth");

// 取得所有貼文
router.get(
  /**
   * #swagger.tags = ["Post - 貼文"]
   * #swagger.description = "取得全部貼文"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.parameters["query"] = [
      {
        in: "query",
        name: "keyword",
        type: "string",
        description: "關鍵字搜尋"
      },
      {
        in: "query",
        name: "sort",
        type: "string",
        description: "排序 asc 舊到新,desc 新到舊"
      }
    ]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": true,
        "data": [
          {
            "_id": "62a59f81af18b27296d429df",
            "user": {
              "_id": "62a4fc111573884df26234f5",
              "name": "ff",
              "photo": "https://i.imgur.com/JS8PuHi.jpg"
            },
            "image": "https://i.imgur.com/JS8PuHi.jpg",
            "content": "dd",
            "likes": [],
            "createdAt": "2022-06-12T08:10:41.454Z",
            "comments": []
          },
        ]
      }
    }
  */
  "/posts",
  isAuth,
  handErrorAsync(PostControllers.getPosts)
);

// 取得指定用戶所有貼文
router.get(
  /**
   * #swagger.tags = ["Post - 貼文"]
   * #swagger.description = "取得指定用戶所有貼文"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.parameters["query"] = [
      {
        in: "query",
        name: "keyword",
        type: "string",
        description: "關鍵字搜尋"
      },
      {
        in: "query",
        name: "sort",
        type: "string",
        description: "排序 asc 舊到新,desc 新到舊"
      }
    ]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": true,
        "data": [
          {
            "_id": "62a59f81af18b27296d429df",
            "user": {
              "_id": "62a4fc111573884df26234f5",
              "name": "ff",
              "photo": "https://i.imgur.com/JS8PuHi.jpg"
            },
            "image": "https://i.imgur.com/JS8PuHi.jpg",
            "content": "dd",
            "likes": [],
            "createdAt": "2022-06-12T08:10:41.454Z",
            "comments": []
          },
        ]
      }
    }
  */
  "/posts/user/:userId",
  isAuth,
  handErrorAsync(PostControllers.getUserPosts)
);

// 取得單一貼文
router.get(
  /**
   * #swagger.tags = ["Post - 貼文"]
   * #swagger.description = "取得單一貼文"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": true,
        "data": [
          {
            "_id": "62a59f81af18b27296d429df",
            "user": {
              "_id": "62a4fc111573884df26234f5",
              "name": "ff",
              "photo": "https://i.imgur.com/JS8PuHi.jpg"
            },
            "image": "https://i.imgur.com/JS8PuHi.jpg",
            "content": "dd",
            "likes": [],
            "createdAt": "2022-06-12T08:10:41.454Z",
            "comments": []
          },
        ]
      }
    }
  */
  "/post/:postId",
  isAuth,
  handErrorAsync(PostControllers.getPost)
);

// 新增貼文
router.post(
  /**
   * #swagger.tags = ["Post - 貼文"]
   * #swagger.description = "新增貼文"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "$content": "內文",
        "image": "https://reurl.cc/x93aR4"
      }
    }
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": true,
        "data": {
          "user": "62a4fc111573884df26234f5",
          "image": "https://i.imgur.com/JS8PuHi.jpg",
          "content": "貼文內容3-f",
          "likes": [],
          "_id": "62a5a3bfaf18b27296d42a62",
          "createdAt": "2022-06-12T08:28:47.566Z"
        }
      }
    }
  */
  "/post",
  isAuth,
  handErrorAsync(PostControllers.createPost)
);

// 刪除單一貼文
router.delete(
  /**
   * #swagger.tags = ["Post - 貼文"]
   * #swagger.description = "刪除單一貼文"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": true,
        "data": {
          "_id": "62a5a3bfaf18b27296d42a62",
          "user": "62a4fc111573884df26234f5",
          "image": "https://i.imgur.com/JS8PuHi.jpg",
          "content": "貼文內容3-f",
          "likes": [],
          "createdAt": "2022-06-12T08:28:47.566Z"
        }
      }
    }
  */
  "/post/:postId",
  isAuth,
  handErrorAsync(PostControllers.deletePost)
);

// 按讚貼文
router.post(
  /**
   * #swagger.tags = ["Post - 貼文"]
   * #swagger.description = "按讚貼文"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": true,
        "data": {
          "postId": "62a59f81af18b27296d429df",
          "userId": "62a4fc111573884df26234f5"
        }
      }
    }
  */
  "/post/:postId/like",
  isAuth,
  handErrorAsync(PostControllers.createLike)
);

// 取消按讚貼文
router.delete(
  /**
   * #swagger.tags = ["Post - 貼文"]
   * #swagger.description = "取消按讚貼文"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": true,
        "data": {
          "postId": "62a59f81af18b27296d429df",
          "userId": "62a4fc111573884df26234f5"
        }
      }
    }
  */
  "/post/:postId/like",
  isAuth,
  handErrorAsync(PostControllers.deleteLike)
);

// 新增回覆
router.post(
  /**
   * #swagger.tags = ["Post - 貼文"]
   * #swagger.description = "新增回覆"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "$content": "這是貼文內容",
      }
   }
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": true,
        "data": {
          "content": "回覆內容2",
          "user": "62a4fc111573884df26234f5",
          "post": "62a59f81af18b27296d429df",
          "_id": "62a5a49faf18b27296d42a77",
          "createdAt": "2022-06-12T08:32:31.486Z"
        }
      }
    }
  */
  "/post/:postId/comment",
  isAuth,
  handErrorAsync(PostControllers.createComment)
);

// 刪除回覆
router.delete(
  /**
   * #swagger.tags = ["Post - 貼文"]
   * #swagger.description = "刪除回覆"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": true,
        "data": {
          "_id": "62a5a49faf18b27296d42a77",
          "content": "回覆內容2",
          "user": {
            "_id": "62a4fc111573884df26234f5",
            "name": "ff",
            "photo": "https://i.imgur.com/vpQY28H.jpg",
            "createdAt": "2022-06-11T20:33:21.937Z"
          },
          "post": "62a59f81af18b27296d429df",
          "createdAt": "2022-06-12T08:32:31.486Z"
        }
      }
    }
  */
  "/post/:commentId/comment",
  isAuth,
  handErrorAsync(PostControllers.deleteComment)
);

module.exports = router;
