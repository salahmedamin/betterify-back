//get with filter to have: created groups or groups you're a member of
const groups = require("../../../../controllers/groups")

module.exports = async(req,res)=>{
    try{
        const {
            userID,
            chatGroupsOnly,
            createdOnly,
            index,
            selectAll
        } = req.body
        
        res.send(await groups.getUserGroups({
            userID,
            chatGroupsOnly,
            createdOnly,
            index,
            selectAll
        }))
    }
    catch(e){
        res.send({
            error: true,
            message: e.message
        })
    }
}