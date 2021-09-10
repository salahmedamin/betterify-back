const router = require("express").Router()
const router = require("express").Router()

const setAdmin = require("./roles/actions/setAdmin"),
setModerator = require("./roles/actions/setModerator"),
setReportsAnalyst = require("./roles/actions/setReportsAnalyst"),
_delete = require("./roles/actions/delete"),
get = require("./roles/get/list")

//action
router.post("/set/admin", setAdmin)
router.post("/set/moderator", setModerator)
router.post("/set/reportsAnalyst", setReportsAnalyst)
router.post("/delete", _delete)

//get
router.post("/", get)

module.exports = router