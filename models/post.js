const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "貼文 ID 未填寫"],
    },
    image: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: [true, "貼文內容 未填寫"],
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "user",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    // 清除使用 toJSON 產生多餘的 id 屬性
    id: false,
  }
);

// 虛擬屬性
// 平常不顯示需 populate comment 才會顯示
postSchema.virtual("comments", {
  ref: "comment",
  // 用 post model 的 _id 去查找 comment model 的 post
  localField: "_id",
  foreignField: "post",
});

const Post = new mongoose.model("post", postSchema);

module.exports = Post;
