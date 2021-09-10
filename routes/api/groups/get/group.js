const groups = require("../../../../controllers/groups")

module.exports = async(req,res)=>{
    try{
        const {
            userID,
            groupID,
            unique
        } = req.body
        
        res.send(await groups.getGroup({
            userID,
            groupID,
            unique
        }))
    }
    catch(e){
        res.send({
            error: true,
            message: e.message
        })
    }
}