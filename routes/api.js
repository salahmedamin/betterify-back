const router = require("express").Router()
const messagesRouter = require("./api/messages")
const postsRouter = require("./api/posts")
// const AIRouter = require("../AI/AI")

router.use("/messages",messagesRouter)
router.use("/posts",postsRouter)
// router.use("/AI",AIRouter)

module.exports = router