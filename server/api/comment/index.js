const express = require("express");
const router = express.Router();
const ctrl = require("./comment.ctrl");

router.post("/:postNumber", ctrl.createComment); // 댓글 작성
router.post("/:parentId/parent", ctrl.replyComment); // 대댓글 작성
router.get("/:parentId/child", ctrl.getReplyComment); // 대댓글 보여주기
router.get("/:postNumber", ctrl.getAllComment); // 댓글들 보여주기
router.put("/:id", ctrl.editComment); // 댓글 수정
router.delete("/:id", ctrl.deleteComment); //댓글 삭제

module.exports = router;