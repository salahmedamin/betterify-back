const posts = require("../../../../controllers/posts")

module.exports = async (req, res) => {
    try {
        const {
            postID,
            index
        } = req.body

        res.send(await posts.getEdits({
            postID,
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