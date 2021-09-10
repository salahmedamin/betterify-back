const router = require("express").Router()

const accept = require("./joinRequests/actions/accept"),
send = require("./joinRequests/actions/send"),
_delete = require("./joinRequests/actions/delete"),
get = require("./joinRequests/get/list")

//action
router.post("/accept", accept)
router.post("/send", send)
router.post("/delete", _delete)

//get
router.post("/", get)

module.exports = router