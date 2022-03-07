const express = require("express")
const router = express.Router()
const ctrl = require("./post.ctrl")

router.post("/createPost", ctrl.createPost) // 게시글 작성
router.get("/getAllPost", ctrl.getAllPost) // 전체 게시글 조회

module.exports = router
