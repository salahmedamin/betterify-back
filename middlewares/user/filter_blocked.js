const checkBlock = require("../../controllers/blocking/checkBlock")
module.exports = async(req,res,next)=>{
    let available = []
    const { senderID } = req.body
    for(p of req.taggedInMessage){
        const isBlocked = await checkBlock({
            blockedID: req.taggedInMessage.id,
            blockerID: senderID,
            absolute: true
        })
        if(!isBlocked) available.push(p)
    }
    req.taggedInMessage = available
    next()
}