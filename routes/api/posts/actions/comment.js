const posts = require("../../../../controllers/posts")

module.exports = async(req,res)=>{
    try{
        const {postID, userID, content, taggedPersons} = req.body
        res.send(await posts.comment({
            postID: parseInt(postID),
            userID: parseInt(userID),
            content,
            files: req.files,
            taggedPersons
        }))
    }
    catch(e){
        res.send({
            error: true,
            message: e.message
        })
    }
}