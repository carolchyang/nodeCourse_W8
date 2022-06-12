const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "留言 未填寫"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "用戶資料為必填"],
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "post",
      required: [true, "貼文資料為必填"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

// 當使用 findxx 時插入 middleware，使 comment user 資料 populate
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo createdAt",
  });
  next();
});

const Comment = new mongoose.model("comment", commentSchema);

module.exports = Comment;
