const router = require("express").Router()
const messagesRouter = require("./api/messages")
const postsRouter = require("./api/posts")
const userRouter = require("./api/user")
// const groupsRouter = require("./api/groups")
const visualizeMedia = require("./api/visualizeMedia")
// const AIRouter = require("../AI/AI")

router.use("/messages",messagesRouter)
router.use("/posts",postsRouter)
router.use("/user",userRouter)
// router.use("/groups",groupsRouter)
router.use("/media/:id",visualizeMedia)
// router.use("/AI",AIRouter)

module.exports = router