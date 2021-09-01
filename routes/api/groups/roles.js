const router = require("express").Router()

//action
router.post("/set", setRole) //pass type ^^
router.post("/delete", deleteRole)

//get
router.post("/", getRoles)

module.exports = router