const { Router } = require("express")
const router = Router()

router.use("/user", require("./user"))
router.use("/post", require("./post"))

module.exports = router
