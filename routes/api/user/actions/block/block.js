const block = require("../../../../../controllers/blocking")

module.exports = async(req,res)=>{
    try{
        const {blockedID, blockerID} = req.body
        res.send(await block.block({
            blockedID,
            blockerID
        }))
    }
    catch(e){
        res.send({
            error:true,
            message: e.message
        })
    }
}