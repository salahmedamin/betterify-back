//action
const multer = require("../../../multer")
const action = require("./actions/edit")

const router = require("express").Router()

//action
router.post("/username", action.username)
router.post("/picture", multer.single("file") , action.picture)
router.post("/location", action.location)

module.exports = router