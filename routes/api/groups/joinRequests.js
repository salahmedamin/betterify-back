const router = require("express").Router()

//action
router.post("/accept", setRole)
router.post("/send", setRole)
router.post("/delete", deleteRole)

//get
router.post("/", getRoles)

module.exports = router