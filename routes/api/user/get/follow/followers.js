const follow = require("../../../../../controllers/user/follow")

module.exports = async(req,res)=>{
    try{
        const {userID, index, orderBy, order, keyword} = req.body
        res.send(await follow.getFollowers({
            userID,
            index,
            order,
            orderBy,
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