const follow = require("../../../../../controllers/user/follow")

module.exports = async(req,res)=>{
    try{
        const {unfollowedID} = req.body
        res.send(await follow.deletefollow({
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