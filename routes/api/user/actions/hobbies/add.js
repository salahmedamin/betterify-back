const hobbies = require("../../../../../controllers/hobbies")

module.exports = async(req,res)=>{
    try{
        const {hobby, userID} = req.body
        res.send(await hobbies.add({
            hobby,
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