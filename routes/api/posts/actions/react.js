const posts = require("../../../../controllers/posts")

module.exports = async (req, res) => {
    try {
        const {
            postID,
            emoji,
            reactorID
        } = req.body

        res.send(await posts.react({
            emoji,
            postID,
            reactorID
        }))
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message
        })
    }
}