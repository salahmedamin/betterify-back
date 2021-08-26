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

//get
router.post("/getFollowRequests", get.followRequests)
router.post("/viewFollowing", get.following)
router.post("/viewFollowers", get.followers)

module.exports = router