const express = require("express");
const router = express.Router();
const ctrl = require("./search.ctrl");

router.get("/title/:keyword", ctrl.getTitle); // 제목 검색
router.get("/content/:keyword", ctrl.getContent); // 내용 검색
router.get("/user/:keyword", ctrl.getUser); // 작성자 검색

module.exports = router;
