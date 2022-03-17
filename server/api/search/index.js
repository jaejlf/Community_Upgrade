const express = require("express")
const router = express.Router()
const ctrl = require("./search.ctrl")

router.get("/title/:keyword", ctrl.getTitle) // search the Title
router.get("/content/:keyword", ctrl.getContent) // search the content
router.get("/user/:keyword", ctrl.getUser) // search the user

module.exports = router
