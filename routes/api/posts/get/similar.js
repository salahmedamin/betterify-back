const posts = require("../../../../controllers/posts")

module.exports = async (req, res) => {
    try {
        const {
            userID,
            postID,
            type = "tag", //tag or act_place
            index=0,
            complimentary = undefined,
            activity = undefined,
            place = undefined
        } = req.body
        if(type == "tag"){
            res.send(await posts.getSimilarTags({
                postID,
                userID,
                index
            }))
        }
        else if(type === "act_place"){
            res.send(await posts.getSimilarPlaceOrAct({
                userID,
                activity,
                complimentary,
                index,
                place
            }))
        }
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message
        })
    }
}