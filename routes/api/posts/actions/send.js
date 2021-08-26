const posts = require("../../../../controllers/posts")

module.exports = async(req,res)=>{
    try {
        const { 
            postID,
            senderID,
            receiverID,
            groupID
        } = req.body

        res.send(await posts.sendTo({
            postID,
            senderID,
            groupID,
            receiverID
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