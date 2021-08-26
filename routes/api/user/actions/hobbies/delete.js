const hobbies = require("../../../../../controllers/hobbies")

module.exports = async(req,res)=>{
    try{
        const {hobbyID, userID} = req.body
        res.send(await hobbies.remove({
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