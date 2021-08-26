const posts = require("../../../../controllers/posts")

module.exports = async (req, res) => {
    try {
        const {
            viewerID,
            userID,
            index
        } = req.body

        res.send(await posts.getProfilePosts({
            userID,
            viewerID,
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