const groups = require("../../../../../controllers/groups")

module.exports = async(req,res)=>{
    try{
        const {
            groupID,
            toBeSetID
        } = req.body
        
        res.send(await groups.rolesManager.setModerator({
            groupID,
            toBeSetID
        }))
    }
    catch(e){
        res.send({
            error: true,
            message: e.message
        })
    }
}