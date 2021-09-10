const groups = require("../../../../controllers/groups")

module.exports = async(req,res)=>{
    try{
        const {
            creatorID,
            groupName,
            groupPic,
            isPublic,
            rules,
            isChatGroup,
            members,
            strictness
        } = req.body
        
        res.send(await groups.create({
            creatorID,
            groupName,
            groupPic,
            isPublic,
            rules,
            isChatGroup,
            members,
            strictness
        }))
    }
    catch(e){
        res.send({
            error: true,
            message: e.message
        })
    }
}