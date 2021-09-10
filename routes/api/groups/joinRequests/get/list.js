const groups = require("../../../../../controllers/groups")

module.exports = async(req,res)=>{
    try{
        const {
            groupID,
            userID,
            index
        } = req.body
        
        res.send(await groups.joinGroupManager.getRequests({
            groupID,
            userID,
            index
        }))
    }
    catch(e){
        res.send({
            error: true,
            message: e.message
        })
    }
}