//action
const action = require("./actions/actors")

//get
const get = require("./get/actors")

const router = require("express").Router()

//action
router.post("/favorite", action.favoriteToggle)

//get
router.post("/", get.getActor)
router.post("/shows", get.getShows)
router.post("/search", get.search)

module.exports = router