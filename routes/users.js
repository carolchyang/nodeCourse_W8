var express = require("express");
var router = express.Router();
const UserControllers = require("../controllers/users");
const handErrorAsync = require("../service/handErrorAsync");
const { isAuth } = require("../middleware/auth");

// 註冊
router.post(
  /**
   * #swagger.tags = ["User - 用戶"]
   * #swagger.description = "註冊"
   * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "$name": "Ray",
        "$email": "a@gmail.com",
        "$password": "a12345678"
      }
    }
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": true,
        "data": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYTVhYTI0YWYxOGIyNzI5NmQ0MmE4MiIsImlhdCI6MTY1NTAyNDE2NCwiZXhwIjoxNjU1NjI4OTY0fQ.ylNUe_TfC7rqykZuJZdhOrp_oa4fKXwxniSrNk-SbhI",
          "user": {
            "_id": "62a5aa24af18b27296d42a82",
            "name": "rr",
            "photo": "",
            "gender": "male"
          }
        }
      }
    }
  */
  "/user/sign_up",
  handErrorAsync(UserControllers.signUp)
);

// 登入
router.post(
  /**
   * #swagger.tags = ["User - 用戶"]
   * #swagger.description = "登入"
   * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "$email": "a@gmail.com",
        "$password": "a12345678",
      }
    }
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": true,
        "data": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYTRmYzExMTU3Mzg4NGRmMjYyMzRmNSIsImlhdCI6MTY1NTAyMjQwNywiZXhwIjoxNjU1NjI3MjA3fQ.VKQsd3wbvhPQHf1yrUQwg84K4n_ICEbg4DYA0shT-Ng",
          "user": {
            "_id": "62a4fc111573884df26234f5",
            "name": "ff",
            "photo": "https://i.imgur.com/vpQY28H.jpg",
            "gender": "male"
          }
        }
      }
    }
  */
  "/user/sign_in",
  handErrorAsync(UserControllers.signIn)
);

// 重設密碼
router.post(
  /**
   * #swagger.tags = ["User - 用戶"]
   * #swagger.description = "重設密碼"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "$password": "a12345678",
        "$confirmPassword": "a12345678"
      }
    }
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": true,
        "data": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYTRmYzExMTU3Mzg4NGRmMjYyMzRmNSIsImlhdCI6MTY1NTAyNDUzNiwiZXhwIjoxNjU1NjI5MzM2fQ.4JE6hxIPx6yyneFLjxHLa1fHIXMgmJgOoJDGrynmOUM",
          "user": {
            "_id": "62a4fc111573884df26234f5",
            "name": "ff",
            "photo": "https://i.imgur.com/vpQY28H.jpg",
            "gender": "male"
          }
        }
      }
    }
  */
  "/user/updatePassword",
  isAuth,
  handErrorAsync(UserControllers.updatePassword)
);

// 取得個人資料
router.get(
  /**
   * #swagger.tags = ["User - 用戶"]
   * #swagger.description = "取得個人資料"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": true,
        "data": {
          "_id": "62a4fc111573884df26234f5",
          "name": "ff",
          "gender": "male",
          "photo": "https://i.imgur.com/vpQY28H.jpg",
          "follows": [
            {
              "user": "62a52d8d43ba1cb22e9c8a2d",
              "_id": "62a595c0af18b27296d426b5",
              "createdAt": "2022-06-12T07:29:04.425Z"
            }
          ],
          "following": [
            {
              "user": "62a58fe0d7b51fa8cb840aff",
              "_id": "62a590bdd7b51fa8cb840b5c",
              "createdAt": "2022-06-12T07:07:41.715Z"
            }
          ]
        }
      }
    }
  */
  "/user/profile",
  isAuth,
  handErrorAsync(UserControllers.getUser)
);

// 更新個人資料
router.patch(
  /**
   * #swagger.tags = ["User - 用戶"]
   * #swagger.description = "更新個人資料"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.parameters["body"] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式",
      schema: {
        "name": "ray",
        "gender": "male",
        "photo": "https://i.imgur.com/vpQY28H.jpg"
      }
    }
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": true,
        "data": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYTRmYzExMTU3Mzg4NGRmMjYyMzRmNSIsImlhdCI6MTY1NTAyNDY3OCwiZXhwIjoxNjU1NjI5NDc4fQ.vMIJuAqPwiE6AbheNl6vZ00m1hIzb7PDCBRlGD0SNMA",
          "user": {
            "_id": "62a4fc111573884df26234f5",
            "name": "ff",
            "photo": "https://i.imgur.com/vpQY28H.jpg",
            "gender": "male"
          }
        }
      }
    }
  */
  "/user/profile",
  isAuth,
  handErrorAsync(UserControllers.updateUser)
);

// 取得個人按讚名單
router.get(
  /**
   * #swagger.tags = ["User - 用戶"]
   * #swagger.description = "取得個人按讚名單"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": true,
        "data": [
          {
            "_id": "62a4fa0ffd6e1c1cf603d581",
            "user": {
              "_id": "62a47c6b805e9c534d8561ae",
              "name": "gg",
              "photo": ""
            },
            "image": "https://i.imgur.com/vpQY28H.jpg",
            "content": "貼文內容2-g",
            "likes": [
              "62a52d8d43ba1cb22e9c8a2d",
              "62a4fc111573884df26234f5"
            ],
            "createdAt": "2022-06-11T20:24:47.072Z"
          }
        ]
      }
    }
  */
  "/user/getLikeList",
  isAuth,
  handErrorAsync(UserControllers.getLikeList)
);

// 追蹤用戶
router.post(
  /**
   * #swagger.tags = ["User - 用戶"]
   * #swagger.description = "追蹤用戶"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": true,
        "data": {
          "userId": "62a5aa24af18b27296d42a82",
          "myId": "62a4fc111573884df26234f5"
        }
      }
    }
  */
  "/user/:userId/follow",
  isAuth,
  handErrorAsync(UserControllers.createFollow)
);

// 取消追蹤用戶
router.delete(
  /**
   * #swagger.tags = ["User - 用戶"]
   * #swagger.description = "取消追蹤用戶"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": true,
        "data": {
          "userId": "62a5aa24af18b27296d42a82",
          "myId": "62a4fc111573884df26234f5"
        }
      }
    }
  */
  "/user/:userId/follow",
  isAuth,
  handErrorAsync(UserControllers.deleteFollow)
);

// 取得個人追蹤名單
router.get(
  /**
   * #swagger.tags = ["User - 用戶"]
   * #swagger.description = "取得個人追蹤名單"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": true,
        "data": [
          {
            "user": null,
            "_id": "62a590bdd7b51fa8cb840b5c",
            "createdAt": "2022-06-12T07:07:41.715Z"
          }
        ]
      }
    }
  */
  "/user/getFollowingList",
  isAuth,
  handErrorAsync(UserControllers.getFollowingList)
);

module.exports = router;
