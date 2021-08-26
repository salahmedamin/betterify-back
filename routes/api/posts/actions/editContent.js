const posts = require("../../../../controllers/posts")

module.exports = async (req, res) => {
    try {
        const {
            postID,
            text
        } = req.body

        res.send(await posts.edit.editContent({
            postID,
            text
        }))
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message
        })
    }
}