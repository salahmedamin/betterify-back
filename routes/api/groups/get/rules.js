//get with filter to have: created groups or groups you're a member of
const groups = require("../../../../controllers/groups")

module.exports = async(req,res)=>{
    try{
        const {
            groupID,
            userID
        } = req.body
        
        res.send(await groups.getRules({
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