const followRouter = require("./user/following")
const blockRouter = require("./user/blocking")
const hobbiesRouter = require("./user/hobbies")
const actorsRouter = require("./user/actors")
const showsRouter = require("./user/shows")
const bioRouter = require("./user/bio")



//simple task
const profile = require("./user/get/profile")


const router = require("express").Router()

router.post("/profile", profile)


router.use("/following", followRouter)
router.use("/blocking", blockRouter)
router.use("/hobbies", hobbiesRouter)
router.use("/actors", actorsRouter)
router.use("/shows", showsRouter)
router.use("/bio", bioRouter)

module.exports = router