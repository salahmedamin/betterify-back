const router = require("express").Router()
const check_user_exists = require("../../middlewares/user/check_user_exists")
const filter_blocked = require("../../middlewares/user/filter_blocked")
const get = require("./messages/get/list")
const send = require("./messages/actions/send")

router.post("/send", check_user_exists, filter_blocked, send)
router.post("/",get)

module.exports = router