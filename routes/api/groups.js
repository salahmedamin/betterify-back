const router = require("express").Router()


router.use("/joinRequests", joinReqRouter)
router.use("/invites", invitesRouter)
router.use("/roles", rolesRouter)



//actions
router.post("/create",create)
router.post("/edit",create)
router.post("/delete",create)
router.post("/kick",create)


//get
router.post("/getGroup/",getGroup)
router.post("/getGroups/",getGroups) //filter to get created or member in
router.post("/getMembers/",getMembers)
router.post("/getRules/",getRules)

module.exports = router