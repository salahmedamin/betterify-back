const bios = require("../../../../../controllers/bios")

module.exports = async(req,res)=>{
    try{
        const {
            bioID,
            userID,
            age,
            sex,
            text
        } = req.body
        res.send(await bios.editBio({
            age,
            sex,
            bioID,
            text,
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