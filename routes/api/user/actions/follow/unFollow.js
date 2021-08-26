const follow = require("../../../../../controllers/user/follow")

module.exports = async(req,res)=>{
    
    try{
        const {userID, unfollowedID} = req.body
        res.send(await follow.unfollow({
            unfollowedID,
            userID
        }))
    }
    catch(e){
        res.send({
            error:true,
            message: e.message
        })
    }
    
}