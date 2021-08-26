//action
const action = require("./actions/shows")

//get
const get = require("./get/shows")

const router = require("express").Router()

//action
router.post("/favorite", action.favoriteToggle)

//get
router.post("/getActors", get.getActors)
router.post("/getRecommendations", get.getRecommendations)
router.post("/getShow", get.getShow)
router.post("/getSimilar", get.getSimilar)
router.post("/getVideos", get.getVideos)
router.post("/search", get.search)

module.exports = router