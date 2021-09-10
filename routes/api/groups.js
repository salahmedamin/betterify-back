const router = require("express").Router()


// sub-routers
const joinReqRouter = require("./groups/joinRequests")
const rolesRouter = require("./groups/roles")
const invitesRouter = require("./groups/invites")

router.use("/joinRequests", joinReqRouter)
router.use("/invites", invitesRouter)
router.use("/roles", rolesRouter)





//actions
const create = require("./groups/actions/create")
const _delete = require("./groups/actions/delete")
const edit = require("./groups/actions/edit")
const kick = require("./groups/actions/kick")


//get
const single = require("./groups/get/group")
const list = require("./groups/get/list")
const members = require("./groups/get/members")
const rules = require("./groups/get/rules")



//actions
router.post("/create",create)
router.post("/edit",edit)
router.post("/delete",_delete)
router.post("/kick",kick)


//get
router.post("/group/",single)
router.post("/",list)
router.post("/members",members)
router.post("/rules",rules)

module.exports = router