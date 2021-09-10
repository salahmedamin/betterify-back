const groups = require("../../../../../controllers/groups")

module.exports = async(req,res)=>{
    try{
        const {
            actionTakerID,
            joinReqID
        } = req.body
        
        res.send(await groups.joinGroupManager.acceptRequest({
            actionTakerID,
            joinReqID
        }))
    }
    catch(e){
        res.send({
            error: true,
            message: e.message
        })
    }
}