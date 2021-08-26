const posts = require("../../../../controllers/posts")

module.exports = async (req, res) => {
    try {
        const {
            postID,
            emoji,
            index
        } = req.body

        res.send(await posts.getReactions({
            postID,
            emoji,
            index
        }))
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message,
            stack: e.stack
        })
    }
}