const express = require("express")
const router = express.Router()
const ctrl = require("./post.ctrl")

router.post("/createPost", ctrl.createPost) // 게시글 작성

module.exports = router
