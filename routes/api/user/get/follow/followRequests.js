const follow = require("../../../../../controllers/user/follow")

module.exports = async(req,res)=>{
    try{
        const {userID, index, order, keyword} = req.body
        res.send(await follow.getFollowRequests({
            userID,
            index,
            keyword,
            order
        }))
    }
    catch(e){
        res.send({
            error:true,
            message: e.message
        })
    }
}