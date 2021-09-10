//get with filter to have: created groups or groups you're a member of
const groups = require("../../../../controllers/groups")

module.exports = async(req,res)=>{
    try{
        const {
            groupID,
            index,
            userID
        } = req.body
        
        res.send(await groups.getMembers({
            groupID,
            index,
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