const posts = require("../../../../controllers/posts")

module.exports = async (req, res) => {
    try {
        const {
            userID,
            index
        } = req.body

        res.send(await posts.getFeedPosts({
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