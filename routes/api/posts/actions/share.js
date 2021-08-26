const posts = require("../../../../controllers/posts")

module.exports = async (req, res) => {
    try {
        const {
            postID,
            userID,
            _with,
            groupID,
            activity,
            content,
            isCommentable,
            isReactable,
            onlyFollowers,
            onlyFollowersAndFollowed,
            place,
            privacyType,
            taggedPersons,
            toBeIncludedInPrivacy
        } = req.body

        //create notifications

        res.send(await posts.share({
            postID,
            userID,
            _with,
            activity,
            content,
            groupID,
            isCommentable,
            isReactable,
            onlyFollowers,
            onlyFollowersAndFollowed,
            place,
            privacyType,
            taggedPersons,
            toBeIncludedInPrivacy
        }))
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message
        })
    }
}