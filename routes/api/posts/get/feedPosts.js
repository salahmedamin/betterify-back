const posts = require("../../../../controllers/posts")

module.exports = async (req, res) => {
    try {
        const {
            postID,
            userID,
            index
        } = req.body

        res.send(await posts.getFeedPosts({
            postID,
            userID,
            index
        }))
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message
        })
    }
}