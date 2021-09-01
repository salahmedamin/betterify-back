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
router.post("/", get.list) //get user hobbies
router.post("/search", get.search) //search in general

module.exports = router