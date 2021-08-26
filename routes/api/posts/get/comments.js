const posts = require("../../../../controllers/posts")

module.exports = async (req, res) => {
    try {
        const {
            postID,
            userID,
            index,
            order,
            orderType
        } = req.body

        res.send(await posts.getComments({
            postID,
            userID,
            index,
            order,
            orderType
        }))
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message
        })
    }
}