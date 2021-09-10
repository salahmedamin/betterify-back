const followRouter = require("./user/following")
const blockRouter = require("./user/blocking")
const hobbiesRouter = require("./user/hobbies")
const actorsRouter = require("./user/actors")
const showsRouter = require("./user/shows")
const bioRouter = require("./user/bio")
const ratingRouter = require("./user/rating")
const editRouter = require("./user/edit")
const signin = require("./user/actions/signin")
const signup = require("./user/actions/signup")


//simple task
const profile = require("./user/get/profile")


const router = require("express").Router()

router.post("/profile", profile)
router.post("/signin", signin)
router.post("/signup", signup)


router.use("/following", followRouter)
router.use("/blocking", blockRouter)
router.use("/hobbies", hobbiesRouter)
router.use("/actor", actorsRouter)
router.use("/show", showsRouter)
router.use("/bio", bioRouter)
router.use("/rating", ratingRouter)
router.use("/edit", editRouter)

module.exports = router