const express = require("express")
const router = express.Router()
const ctrl = require("./comment.ctrl")

//router.post("/createComment/:postId", ctrl.createComment) //댓글 작성
//router.get("/getAllComment/:postId", ctrl.getAllComment) //댓글들 보여주기

router.post("/:postNumber", ctrl.createComment) //댓글 작성
router.get("/:postNumber", ctrl.getAllComment) //댓글들 보여주기

module.exports = router