//action
const action = require("./actions/rating")

//get
const get = require("./get/rating")

const router = require("express").Router()

//action
router.post("/rate", action.rate)
router.post("/canBeRated", action.setCanRate)

//get
router.post("/ratings", get.getRatingList)

module.exports = router