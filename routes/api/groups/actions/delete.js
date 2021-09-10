const groups = require("../../../../controllers/groups")

module.exports = async(req,res)=>{
    try{
        const {
            groupID,
            userID,
            isChatGroup
        } = req.body
        
        res.send(await groups._delete({
            groupID,
            userID,
            isChatGroup
        }))
    }
    catch(e){
        res.send({
            error: true,
            message: e.message
        })
    }
}