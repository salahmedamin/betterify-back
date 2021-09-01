const edit = require("../../../../../controllers/user/edit")

module.exports = async(req,res)=>{
    try{
        const {username} = req.body
        if(!username) throw new Error("Missing needed parameters")
        res.send(await edit({
            userID,
            username
        }))
    }
    catch(e){
        res.send({
            error:true,
            message: e.message
        })
    }
}