//action
const action = require("./actions/hobbies")

//get
const get = require("./get/hobbies")

const router = require("express").Router()

//action
router.post("/add", action.add)
router.post("/edit", action.edit)
router.post("/delete", action._delete)

//get
router.post("/list", get.list)
router.post("/search", get.search)

module.exports = router