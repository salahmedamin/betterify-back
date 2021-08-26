const block = require("../../../../../controllers/blocking")

module.exports = async(req,res)=>{
    try{
        const {userID, index = 0, keyword=undefined} = req.body
        res.send(await block.getBlockList({
            userID,
            index,
            keyword
        }))
    }
    catch(e){
        res.send({
            error:true,
            message: e.message
        })
    }
}