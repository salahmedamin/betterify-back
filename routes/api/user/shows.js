//action
const action = require("./actions/shows")

//get
const get = require("./get/shows")

const router = require("express").Router()

//action
router.post("/favorite", action.favoriteToggle)

//get
router.post("/actors", get.getActors)
router.post("/recommendations", get.getRecommendations)
router.post("/", get.getShow)
router.post("/similar", get.getSimilar)
router.post("/videos", get.getVideos)
router.post("/search", get.search)

module.exports = router