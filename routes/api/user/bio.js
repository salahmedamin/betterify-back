//action
const action = require("./actions/bio")

//get
const get = require("./get/bio")

const router = require("express").Router()

//action
router.post("/add", action.add)
router.post("/edit", action.edit)
router.post("/delete", action._delete)

//get
router.post("/list", get)

module.exports = router