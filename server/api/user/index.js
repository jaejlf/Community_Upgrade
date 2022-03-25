const express = require("express");
const router = express.Router();
const ctrl = require("./user.ctrl");

router.get("/logout", ctrl.logout); // 로그아웃
router.post("/signup", ctrl.signup); // 회원가입
router.post("/login", ctrl.login); // 로그인

module.exports = router;