const bios = require("../../../../../controllers/bios")

module.exports = async(req,res)=>{
    try{
        const {
            bioID,
            userID
        } = req.body
        res.send(await bios.deleteBio({
            bioID,
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