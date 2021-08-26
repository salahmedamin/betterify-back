const follow = require("../../../../../controllers/user/follow")

module.exports = async(req,res)=>{
    try{
        const {followID} = req.body
        res.send(await follow.accept({
            followID
        }))
    }
    catch(e){
        res.send({
            error:true,
            message: e.message
        })
    }
}