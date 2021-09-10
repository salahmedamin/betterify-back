//action
const action = require("./actions/follow")

//get
const get = require("./get/follow")



const router = require("express").Router()

//action
router.post("/follow", action.sendFollow)
router.post("/unfollow", action.unFollow)
router.post("/reject", action.rejectFollow)
router.post("/accept", action.acceptFollow)
router.post("/deletefollow", action.deletefollow)

//get
router.post("/requests", get.followRequests)
router.post("/", get.following)
router.post("/followers", get.followers)

module.exports = router