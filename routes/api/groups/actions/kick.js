const groups = require("../../../../controllers/groups")

module.exports = async(req,res)=>{
    try{
        const {
            groupID,
            isChatGroup,
            kickerID,
            memberID
        } = req.body
        
        res.send(await groups.kick({
            groupID,
            isChatGroup,
            kickerID,
            memberID
        }))
    }
    catch(e){
        res.send({
            error: true,
            message: e.message
        })
    }
}