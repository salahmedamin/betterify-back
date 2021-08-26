const posts = require("../../../../controllers/posts")

module.exports = async (req, res) => {
    try {
        const {
            postID,
            keyword,
            userID
        } = req.body
        if(keyword.length < 3) throw new Error("keyword min length is 3")
        res.send(await posts.searchReacts({
            keyword,
            postID,
            userID
        }))
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message
        })
    }
}