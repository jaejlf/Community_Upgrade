const { Router } = require("express")
const router = Router()

router.use("/user", require("./user"))
router.use("/post", require("./post"))
router.use("/comment", require("./comment"))

module.exports = router
