//action
const action = require("./actions/block")

//get
const get = require("./get/block")

const router = require("express").Router()

//action
router.post("/block", action.block)
router.post("/unblock", action.unblock)

//get
router.post("/", get.list)

module.exports = router