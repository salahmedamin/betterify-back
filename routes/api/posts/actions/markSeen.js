const posts = require("../../../../controllers/posts")

module.exports = async (req, res) => {
    try {
        const {
            postID,
            userID
        } = req.body

        res.send(await posts.markSeen({
            postID,
            userID
        }))
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message
        })
    }
}