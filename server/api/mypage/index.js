const express = require("express")
const router = express.Router()
const ctrl = require("./mypage.ctrl")

router.get("/post", ctrl.getMyPost) // 내가 쓴 글
router.get("/comment", ctrl.getMyComment) // 내가 쓴 댓글
router.post("/scrap/:postNumber", ctrl.scrapping) //게시물 스크랩하기

module.exports = router