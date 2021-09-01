const posts = require("../../../../controllers/posts")

module.exports = async(req,res)=>{
    try{
        const { 
            userID,
            groupID,
            _with,
            activity, 
            content,
            taggedPersons,
            isCommentable,
            isReactable,
            isShareable,
            onlyFollowers,
            onlyFollowersAndFollowed,
            place,
            privacyType,
            toBeIncludedInPrivacy
        } = req.body

        res.send(await posts.create({
            userID: parseInt(userID),
            _with,
            activity,
            content,
            files: req.files,
            groupID: parseInt(groupID),
            isCommentable,
            isReactable,
            isShareable,
            onlyFollowers,
            onlyFollowersAndFollowed,
            place,
            privacyType,
            taggedPersons,
            toBeIncludedInPrivacy
        }))
    }
    catch(e){
        res.send({
            error: true,
            message: e.message,
            stack: e.stack
        })
    }
    
}