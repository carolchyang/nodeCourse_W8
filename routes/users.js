var express = require("express");
var router = express.Router();
const UserControllers = require("../controllers/users");
const handErrorAsync = require("../service/handErrorAsync");
const { isAuth } = require("../middleware/auth");

// 註冊
router.post("/user/sign_up", handErrorAsync(UserControllers.signUp));

// 登入
router.post("/user/sign_in", handErrorAsync(UserControllers.signIn));

// 重設密碼
router.post(
  "/user/updatePassword",
  isAuth,
  handErrorAsync(UserControllers.updatePassword)
);

// 取得個人資料
router.get("/user/profile", isAuth, handErrorAsync(UserControllers.getUser));

// 更新個人資料
router.patch(
  "/user/profile",
  isAuth,
  handErrorAsync(UserControllers.updateUser)
);

// 取得個人按讚名單
router.get(
  "/user/getLikeList",
  isAuth,
  handErrorAsync(UserControllers.getLikeList)
);

// 追蹤用戶
router.post(
  "/user/:userId/follow",
  isAuth,
  handErrorAsync(UserControllers.createFollow)
);

// 取消追蹤用戶
router.delete(
  "/user/:userId/follow",
  isAuth,
  handErrorAsync(UserControllers.deleteFollow)
);

// 取得個人追蹤名單
router.get(
  "/user/getFollowingList",
  isAuth,
  handErrorAsync(UserControllers.getFollowingList)
);

module.exports = router;
