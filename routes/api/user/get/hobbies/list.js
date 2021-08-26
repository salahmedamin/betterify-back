const hobbies = require("../../../../../controllers/hobbies")

module.exports = async(req,res)=>{
    try{
        const { userID } = req.body
        res.send(await hobbies.get({
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