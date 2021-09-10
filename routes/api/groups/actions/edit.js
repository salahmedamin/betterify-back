const groups = require("../../../../controllers/groups")

module.exports = async(req,res)=>{
    try{
        const {
            groupID,
            userID,
            isPublic,
            name
        } = req.body
        
        res.send(await groups.edit({
            groupID,
            userID,
            isPublic,
            name,
            picture: req.file.name
        }))
    }
    catch(e){
        res.send({
            error: true,
            message: e.message
        })
    }
}