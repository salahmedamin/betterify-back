const router = require("express").Router()

const accept = require("./invites/actions/accept"),
send = require("./invites/actions/send"),
_delete = require("./invites/actions/delete"),
get = require("./invites/get/list")

//action
router.post("/accept", accept)
router.post("/send", send)
router.post("/delete", _delete)

//get
router.post("/", get)

module.exports = router