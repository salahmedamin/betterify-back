const posts = require("../../../../controllers/posts")

module.exports = async (req, res) => {
    try {
        const {
            postID,
            audio,
            file,
            video,
            image
        } = req.body

        res.send(await posts.getPostMedia({
            postID,
            audio,
            file,
            image,
            video
        }))
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message
        })
    }
}