var express = require("express");
var router = express.Router();
const UploadControllers = require("../controllers/upload");
const handErrorAsync = require("../service/handErrorAsync");
const { isAuth } = require("../middleware/auth");
const image = require("../middleware/image");

// 上傳圖片
router.post(
  /**
   * #swagger.tags = ["Upload - 上傳"]
   * #swagger.description = "上傳圖片"
   * #swagger.security = [{
      "Bearer": []
    }]
   * #swagger.parameters["query"] = {
      in: "query",
      name: "type",
      type: "string",
      description: "如果為 photo 則為大頭照"
    }
   * #swagger.parameters["formData"] = {
      in: "formData",
      name:'img',
      type: "file",
      required: true,
      description: "圖片",
    }
   * #swagger.responses[200] = {
      description: "回傳成功",
      schema: {
        "status": true,
        "data": "https://i.imgur.com/vpQY28H.jpg"
      }
    }
  */
  "/upload",
  isAuth,
  image,
  handErrorAsync(UploadControllers.uploadImage)
);

module.exports = router;
