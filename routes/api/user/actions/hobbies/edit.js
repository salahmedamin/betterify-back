const hobbies = require("../../../../../controllers/hobbies")

module.exports = async(req,res)=>{
    try{
        const {hobby, userID, hobbyID} = req.body
        res.send(await hobbies.edit({
            hobby,
            hobbyID,
            userID
        }))
    }
    catch(e){
        res.send({
            error:true,
            message: e.message
        })
    }
}