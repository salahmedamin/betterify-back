const posts = require("../../../../controllers/posts")

module.exports = async (req, res) => {
    try {
        const {
            postID,
            userID,
            index,
            order,
            orderBy,
            replyToID
        } = req.body

        res.send(await posts.getComments({
            postID,
            userID,
            index,
            order,
            orderBy,
            replyToID
        }))
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message
        })
    }
}