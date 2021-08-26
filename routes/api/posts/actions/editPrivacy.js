const posts = require("../../../../controllers/posts")

module.exports = async (req, res) => {
    try {
        const {
            postID,
            followersAndFollowed,
            followersOnly,
            privacy
        } = req.body

        res.send(await posts.edit.editPrivacy({
            postID,
            followersAndFollowed,
            followersOnly,
            privacy
            /* has this shape{ 
                toAdd = [],
                toDelete = [],
                newType = null 
            }
            */
        }))
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message
        })
    }
}