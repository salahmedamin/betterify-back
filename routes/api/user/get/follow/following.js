const follow = require("../../../../../controllers/user/follow")

module.exports = async(req,res)=>{
    try{
        const {userID, index, orderBy, order, keyword} = req.body
        res.send(await follow.getFollowing({
            userID,
            index,
            orderBy,
            order,
            keyword
        }))
    }
    catch(e){
        res.send({
            error:true,
            message: e.message
        })
    }
}