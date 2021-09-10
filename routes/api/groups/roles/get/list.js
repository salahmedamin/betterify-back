const groups = require("../../../../../controllers/groups")

module.exports = async(req,res)=>{
    try{
        const {
            groupID,
            userID
        } = req.body
        
        res.send(await groups.rolesManager.getRoles({
            groupID,
            userID
        }))
    }
    catch(e){
        res.send({
            error: true,
            message: e.message
        })
    }
}