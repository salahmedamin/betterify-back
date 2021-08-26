const posts = require("../../../../controllers/posts")

module.exports = async (req, res) => {
    try {
        const {
            postID
        } = req.body

        res.send(await posts._delete({
            postID
        }))
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message
        })
    }
}