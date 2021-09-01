//action
const action = require("./actions/rating")

//get
const get = require("./get/rating")

const router = require("express").Router()

//action
router.post("/rate", action.rate)
router.post("/canBeRated", action.setCanRate)

//get
router.post("/all", get.getRatingList)

module.exports = router