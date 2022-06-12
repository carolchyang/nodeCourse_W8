const bcrypt = require("bcryptjs");
const validator = require("validator");
const resSuccess = require("../service/resSuccess");
const appError = require("../service/appError");
const { generateSendJWT } = require("../middleware/auth");
const Post = require("../models/post");
const User = require("../models/user");

const users = {
  // 註冊
  async signUp(req, res, next) {
    const { name, email, password } = req.body;

    // 欄位未填寫正確
    if (!name || !email || !password) {
      return next(appError(400, "欄位未填寫正確！", next));
    }

    // 暱稱至少 2 個字元以上 q
    if (!validator.isLength(name, { min: 2 })) {
      return next(appError(400, "暱稱需為 2 個字元以上！", next));
    }

    // 密碼需為 8 個字元以上
    if (!validator.isLength(password, { min: 8 })) {
      return next(appError(400, "密碼需為 8 個字元以上！", next));
    }

    // 確定 Email 正確性
    if (!validator.isEmail(email)) {
      return next(appError(400, "Email 格式不正確！", next));
    }

    // 驗證 Email 是否已被使用
    const checkEmailUnique = await User.findOne({ email });
    if (checkEmailUnique) {
      return next(appError(400, "此 Email 已被使用！", next));
    }

    // 將密碼加密
    const newPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      password: newPassword,
    });
    generateSendJWT(res, 201, newUser);
  },
  // 登入
  async signIn(req, res, next) {
    const { email, password } = req.body;

    // 欄位未填寫正確
    if (!email || !password) {
      return next(appError(400, "欄位未填寫正確！", next));
    }

    // 取出 user 資料庫的指定資料
    const user = await User.findOne({ email }).select("+password");

    // 看此 Email 是否已註冊
    if (!user) {
      return next(appError(400, "此 Email 尚未註冊！", next));
    }

    // 比對密碼是否相符
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return next(appError(400, "密碼錯誤！", next));
    }

    generateSendJWT(res, 200, user);
  },
  // 重設密碼
  async updatePassword(req, res, next) {
    const { password, confirmPassword } = req.body;

    // 欄位未填寫正確
    if (!password || !confirmPassword) {
      return next(appError(400, "欄位未填寫正確！", next));
    }

    // 密碼與確認密碼不符合
    if (password !== confirmPassword) {
      return next(appError(400, "密碼不一致！", next));
    }

    // 將密碼加密
    const newPassword = await bcrypt.hash(password, 12);

    // 更新資料庫中密碼
    const newUser = await User.findByIdAndUpdate(req.user._id, {
      password: newPassword,
    });

    generateSendJWT(res, 200, newUser);
  },
  // 取得個人資料
  async getUser(req, res, next) {
    const user = await User.findById(req.user._id);
    resSuccess(res, 200, user);
  },
  // 更新個人資料
  async updateUser(req, res, next) {
    const { name, gender, photo } = req.body;
    const userId = req.user._id;

    // 欄位未填寫正確 - 只需填其中一項
    if (!name && !gender && !photo) {
      return next(appError(400, "欄位未填寫正確！", next));
    }

    // 暱稱至少 2 個字元以上
    if (!validator.isLength(name, { min: 2 })) {
      return next(appError(400, "暱稱需為 2 個字元以上！", next));
    }

    const newUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        gender,
        photo,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    generateSendJWT(res, 200, newUser);
  },
  // 取得個人按讚名單
  async getLikeList(req, res, next) {
    const userId = req.user._id;

    const likeList = await Post.find({
      likes: { $in: [userId] },
    }).populate({
      path: "user",
      select: "name photo",
    });

    resSuccess(res, 200, likeList);
  },
  // 追蹤用戶
  async createFollow(req, res, next) {
    const { userId } = req.params;
    const myId = req.user._id;

    if (myId == userId) {
      return next(appError(401, "你無法追蹤自己", next));
    }

    // 驗證此用戶 ID 使否存在
    const isExist = await User.findById(userId).exec();
    if (!isExist) {
      return next(appError(400, "追蹤失敗，查無此用戶 ID", next));
    }

    // 找到自己的 User 資料 (_id 等於 myId、following.user 等於 userId)
    // 再新增自己 "我追蹤的人" 資料
    await User.updateOne(
      { _id: myId, "following.user": { $ne: userId } },
      { $addToSet: { following: { user: userId } } }
    );

    // 找到對方的 User 資料 (_id 等於 userId、follows.user 等於 myId)
    // 再新增對方 "追蹤我的人" 資料
    await User.updateOne(
      { _id: userId, "follows.user": { $ne: myId } },
      { $addToSet: { follows: { user: myId } } }
    );

    const data = {
      userId,
      myId,
    };

    resSuccess(res, 201, data);
  },
  // 取消追蹤用戶
  async deleteFollow(req, res, next) {
    const { userId } = req.params;
    const myId = req.user._id;

    if (myId == userId) {
      return next(appError(401, "你無法取消追蹤自己", next));
    }

    // 驗證此用戶 ID 使否存在
    const isExist = await User.findById(userId).exec();
    if (!isExist) {
      return next(appError(400, "取消追蹤失敗，查無此用戶 ID", next));
    }

    // 找到自己的 User 資料 (_id 等於 myId)，再刪除自己 "我追蹤的人" 資料
    await User.updateOne(
      { _id: myId },
      { $pull: { following: { user: userId } } }
    );

    // 找到對方的 User 資料 (_id 等於 userId)，再刪除對方 "追蹤我的人" 資料
    await User.updateOne(
      { _id: userId },
      { $pull: { follows: { user: myId } } }
    );

    const data = {
      userId,
      myId,
    };

    resSuccess(res, 201, data);
  },
  // 取得個人追蹤名單
  async getFollowingList(req, res, next) {
    const userId = req.user._id;

    // 找到我的 user 資料，並指顯示 following 屬性
    const followingList = await User.findById(
      { _id: userId },
      { name: 0, gender: 0, photo: 0, follows: 0, _id: 0 }
    ).populate({
      path: "following",
      populate: {
        path: "user",
        select: "name photo",
      },
    });

    resSuccess(res, 200, followingList?.following);
  },
};

module.exports = users;
