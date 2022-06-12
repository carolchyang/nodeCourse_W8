const resSuccess = require("../service/resSuccess");
const appError = require("../service/appError");
const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

const posts = {
  // 取得所有貼文
  async getPosts(req, res, next) {
    // 排序
    const sort = req.query.sort == "asc" ? "createdAt" : "-createdAt";

    // 關鍵字搜尋
    const keyword =
      req.query.keyword !== undefined
        ? { content: new RegExp(req.query.keyword) }
        : {};

    const posts = await Post.find(keyword)
      .populate({
        path: "user",
        select: "name photo",
      })
      .populate({
        path: "comments",
        select: "content user createdAt",
      })
      .sort(sort);

    resSuccess(res, 200, posts);
  },
  // 取得指定用戶所有貼文
  async getUserPosts(req, res, next) {
    const { userId } = req.params;

    // 驗證此用戶 ID 使否存在
    const isExist = await User.findById(userId).exec();
    if (!isExist) {
      return next(appError(400, "查無此用戶 ID", next));
    }

    // 排序
    const sort = req.query.sort == "asc" ? "createdAt" : "-createdAt";

    // 關鍵字搜尋
    const filter =
      req.query.keyword !== undefined
        ? { content: new RegExp(req.query.keyword), user: userId }
        : { user: userId };

    const posts = await Post.find(filter)
      .populate({
        path: "user",
        select: "name photo",
      })
      .populate({
        path: "comments",
        select: "content user createdAt",
      })
      .sort(sort);

    resSuccess(res, 200, posts);
  },
  // 取得單一貼文
  async getPost(req, res, next) {
    const { postId } = req.params;

    // 驗證此貼文 ID 使否存在
    const isExist = await Post.findById(postId).exec();
    if (!isExist) {
      return next(appError(400, "取得貼文失敗，查無此貼文 ID", next));
    }

    const post = await Post.find({ _id: postId })
      .populate({
        path: "user",
        select: "name photo",
      })
      .populate({
        path: "comments",
        select: "content user createdAt",
      });

    // 若取得失敗
    if (!post) {
      return next(appError(400, "取得貼文失敗，查無此貼文 ID", next));
    }
    resSuccess(res, 200, post);
  },
  // 新增貼文
  async createPost(req, res, next) {
    const { image, content } = req.body;
    const userId = req.user._id;

    // 若沒寫內容
    if (!content) {
      return next(appError(400, "新增失敗，貼文內容必須填寫", next));
    }

    const newPost = await Post.create({
      user: userId,
      image,
      content,
    });

    resSuccess(res, 201, newPost);
  },
  // 刪除單一貼文
  async deletePost(req, res, next) {
    const { postId } = req.params;

    // 驗證此貼文 ID 使否存在
    const isExist = await Post.findById(postId).exec();
    if (!isExist) {
      return next(appError(400, "刪除失敗，查無此貼文 ID", next));
    }

    const delPost = await Post.findByIdAndDelete(postId, {
      new: true,
    });

    // 若刪除失敗
    if (!delPost) {
      return next(appError(400, "刪除失敗，查無此貼文 ID", next));
    }

    resSuccess(res, 200, delPost);
  },
  // 按讚貼文
  async createLike(req, res, next) {
    const { postId } = req.params;
    const userId = req.user._id;

    // 驗證此貼文 ID 使否存在
    const isExist = await Post.findById(postId).exec();
    if (!isExist) {
      return next(appError(400, "按讚失敗，查無此貼文 ID", next));
    }

    await Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } });

    const data = {
      postId,
      userId,
    };

    resSuccess(res, 201, data);
  },
  // 取消按讚貼文
  async deleteLike(req, res, next) {
    const { postId } = req.params;
    const userId = req.user._id;

    // 驗證此貼文 ID 使否存在
    const isExist = await Post.findById(postId).exec();
    if (!isExist) {
      return next(appError(400, "取消按讚失敗，查無此貼文 ID", next));
    }

    await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });

    const data = {
      postId,
      userId,
    };

    resSuccess(res, 201, data);
  },
  // 新增回覆
  async createComment(req, res, next) {
    const userId = req.user._id;
    const { postId } = req.params;
    const { content } = req.body;

    // 若沒寫回覆內容
    if (!content) {
      return next(appError(400, "新增回覆失敗，回覆內容必須填寫", next));
    }

    // 驗證此貼文 ID 使否存在
    const isExist = await Post.findById(postId).exec();
    if (!isExist) {
      return next(appError(400, "新增回覆失敗，查無此貼文 ID", next));
    }

    const newComment = await Comment.create({
      user: userId,
      post: postId,
      content,
    });

    resSuccess(res, 201, newComment);
  },
  // 刪除回覆
  async deleteComment(req, res, next) {
    const { commentId } = req.params;

    // 驗證此貼文 ID 使否存在
    const isExist = await Comment.findById(commentId).exec();
    if (!isExist) {
      return next(appError(400, "刪除失敗，查無此回覆 ID", next));
    }

    const delComment = await Comment.findByIdAndDelete(commentId, {
      new: true,
    });

    // 若刪除失敗
    if (!delComment) {
      return next(appError(400, "刪除失敗，查無此回覆 ID", next));
    }

    resSuccess(res, 201, delComment);
  },
};

module.exports = posts;
