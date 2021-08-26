const follow = require("../../../../../controllers/user/follow")

module.exports = async(req,res)=>{
    try{
        const {userID, followedID, isFromSuggestion = false} = req.body
        res.send(await follow.send({
            userID,
            followedID,
            isFromSuggestion
        }))
    }
    catch(e){
        res.send({
            error:true,
            message: e.message
        })
    }
}